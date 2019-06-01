let OSS=require("ali-oss")
let fs=require("fs")
let express=require("express")
var router=express.Router();
var co=require('co');
var multer=require('multer')
var upload=multer({dest:'./temp'})




let client=new OSS({
	regin:'oss-cn-hangzhou',
	accessKeyId:'<Your AccessKeyId>',
	accessKeySecret:'<Your AccessKeySecret>',
	bucket:'Your bucket name'
})


var ali_oss = {
    bucket: 'imagepath',
    endPoint: 'oss-cn-shanghai.aliyuncs.com',
}

// 上传整个文件夹的图片到阿里云OSS
async function putOSS(src,dist){
	try{
		let result =await client.put(dist,src);
		console.log(result)
	}catch(e){
		console.log(e)
	}
}


function addFileToOSSSync(src,dist){
	var docs=fs.readdirSync(src);
	docs.forEach(function(doc){
		var _src=src+'/'+doc,
		    _dist=dist+'/'+doc;
		var st=fs.statSync(_src);
		if(st.isFile()&&doc!=='.DS_Store'){
			putOSS(_src,_dist)
		}else if(st.isDirectory()){
			addFileToOSSSync(_src,_dist);

		}
	})
}



//图片上传(本地地址)
router.all('/upload2',upload.single('file'),function(req,res,next){
	// 文件路径
    var filePath = './' + req.file.path;  
    // 文件类型
    var temp = req.file.originalname.split('.');
    var fileType = temp[temp.length - 1];
    var lastName = '.' + fileType;
    // 构建图片名
    var fileName = Date.now() + lastName;
    // 图片重命名
    fs.rename(filePath, fileName, (err) => {
        if (err) {
            res.end(JSON.stringify({status:'102',msg:'文件写入失败'}));   
        }else{
            var localFile = './' + fileName;  
            var key = fileName;

            // 阿里云 上传文件 
            co(function* () {
              client.useBucket(ali_oss.bucket);
              var result = yield client.put(key, localFile);
              var imageSrc = 'http://image.hgdqdev.cn/' + result.name;
              // 上传之后删除本地文件
              fs.unlinkSync(localFile);
              res.end(JSON.stringify({status:'100',msg:'上传成功',imageUrl:imageSrc})); 
            }).catch(function (err) {
              // 上传之后删除本地文件
              fs.unlinkSync(localFile);
              res.end(JSON.stringify({status:'101',msg:'上传失败',error:JSON.stringify(err)})); 
            });
        }
    });
 
module.exports = router;



// <form action="upload2" method="post" enctype="multipart/form-data">
//     <input type="file" name="file" />
//     <input type="submit" />
// </form>



// 图片上传(base64)
router.post('/upload', function(req, res, next){
    // 图片数据流
    var imgData = req.body.imgData;
    // 构建图片名
    var fileName = Date.now() + '.png';
    // 构建图片路径
    var filePath = './tmp/' + fileName;
    //过滤data:URL
    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64Data, 'base64');
    fs.writeFile(filePath, dataBuffer, function(err) {
        if(err){
          res.end(JSON.stringify({status:'102',msg:'文件写入失败'})); 
        }else{

                var localFile = filePath;
            var key = fileName;
            // 阿里云 上传文件 
            co(function* () {
              client.useBucket(ali_oss.bucket);
              var result = yield client.put(key, filePath);
              var imageSrc = 'http://image.hgdqdev.cn/' + result.name;
              res.end(JSON.stringify({status:'100',msg:'上传成功',imageUrl:imageSrc})); 
            }).catch(function (err) {
              res.end(JSON.stringify({status:'101',msg:'上传失败',error:JSON.stringify(err)})); 
            });
           // 上传之后删除本地文件
           fs.unlinkSync(filePath);
        }
    });
})


//nodejs 配合前端(签名)上传文件到阿里云 oss https://www.jianshu.com/p/3b7c8116f947
//js -- nodejs实现oss签名直传， 前端直传，最简单实现 https://www.jianshu.com/p/1f3bc1cebcc3

const crypto = require('crypto')
const config = {
  secret: 'xxxx',
  OSSAccessKeyId: 'xxxx',
  host: 'http://xxx.xxx.vip',
}

exports.OssSing = 
// (params) => new Promise((resolve, reject) => {
  ApiHook((v, resolve, reject) => {
  const dirPath = '/' 
  const {OSSAccessKeyId, host, secret} = config
  let end = new Date().getTime() + 300000
  let expiration = new Date(end).toISOString()
  let policyString = {
    expiration,
    conditions: [
      ["content-length-range", 0, 1048576000],
      // ["starts-with", "$key", dirPath]
    ]
  }
  policyString = JSON.stringify(policyString)
  const policy = new Buffer(policyString).toString('base64')
  const signature = crypto.createHmac('sha1', secret).update(policy).digest('base64')
  let res = {
    OSSAccessKeyId: OSSAccessKeyId,
    host,
    policy,
    signature,
    saveName: end,
    startsWith: dirPath
  }
  resolve(res)

})



import axios from 'axios'

export default async function(file, cb, errorcb){
    let params = {
        token: Store.getState().Common.userInfo.token
    }
    let ossInfo = await Http.shop['ossSign'](params)()
    {
        // 如果有企业和店铺的时候这里要做区分，分便统计
        let key = `commodity/${ossInfo.saveName}`
           /* eslint-disable no-undef */
        let param = new FormData() // 创建form对象
        param.append('name', file.name) // 通过append向form对象添加数据
        param.append('key', key)
        param.append('policy', ossInfo.policy)
        param.append('OSSAccessKeyId', ossInfo.OSSAccessKeyId)
        param.append('success_action_status', 200)
        param.append('signature', ossInfo.signature)
        param.append('file', file, file.name) // 通过append向form对象添加数据
        // console.log(param.get('file')) // FormData私有类对象，访问不到，可以通过get判断值是否传进去
        let config = {
            headers: {'Content-Type': 'multipart/form-data'}
        }
        // 添加请求头
        axios.post(ossInfo.host, param, config)
        .then(response => {
            // console.log('上传成功')
            // console.log(response)
            let url = `${ossInfo.host}/${key}`
            // console.log(url)
            cb(url)
        })
    }
}



//koa2使用阿里云oss的nodejs sdk实现上传图片 https://www.cnblogs.com/beileixinqing/p/9152113.html

 // 上传单张：
 exports.uploadFile = async (ctx,next) => {
    let alioss_uploadfile = function() {
        return new Promise(function(resolve, reject) {
            //上传单文件，使用formidable
            let form = new formidable.IncomingForm()
            form.parse(ctx.req, function(err, fields, files) {
                if (err) { ctx.throw('500',err)}
                // 文件名
                let date = new Date()
                let time = '' + date.getFullYear() + (date.getMonth() + 1) + date.getDate()
                let filepath = 'project/'+time + '/' + date.getTime()
                let fileext = files.file.name.split('.').pop()
                let upfile = files.file.path
                let newfile = filepath + '.' + fileext
                //ali-oss
                co(function*() {
                    client.useBucket('p-adm-test')
                    let result = yield client.put(newfile, upfile)
                    console.log('文件上传成功!', result.url)
                    let data=[]
                    data.push(result.url)
                    ctx.response.type = 'json'
                    ctx.response.body = {
                        errno: 0,
                        data: data
                    }
                    resolve(next())
                }).catch(function(err) {
                    console.log(err)
                })
            })
          
        })
    }
    await alioss_uploadfile()
}


//上传多张：
exports.uploadFile = async (ctx,next) => {
    let alioss_uploadfile = function() {
        return new Promise(function(resolve, reject) {
            //上传多文件，使用multiparty
            let form = new multiparty.Form({
                encoding: 'utf-8',
                keepExtensions: true  //保留后缀
            })
            form.parse(ctx.req, async function (err, fields, files) {
                let data=[]
                for(let f of files.file){
                    // 文件名
                    let date = new Date()
                    let time = '' + date.getFullYear() + (date.getMonth() + 1) + date.getDate()
                    let filepath = 'project/'+time + '/' + date.getTime()
                    let fileext = f.originalFilename.split('.').pop()
                    let upfile = f.path
                    let newfile = filepath + '.' + fileext
                    await client.put(newfile, upfile).then((results) => {
                        console.log('文件上传成功!', results.url)
                        data.push(results.url)

                    }).catch((err) => {
                        console.log(err)
                    })
                }
                ctx.response.type = 'json'
                ctx.response.body = {
                    errno: 0,
                    data: data
                }
                resolve(next())
            })
        })
    }
    await alioss_uploadfile()
}
 