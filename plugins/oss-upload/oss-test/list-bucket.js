let OSS = require('ali-oss');

let client = new OSS({
  region: 'oss-cn-hangzhou',
  //云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
  accessKeyId: 'LTAIHICo7NbX6GQg',
  accessKeySecret: 'M2PsZBzi6KyVDD41OEnw7CPwzgCHit'
  
});

client.useBucket('asman-static-test');

async function listBuckets () {
  try {
    let result = await client.listBuckets();
    console.log(result)
  } catch(err) {
    console.log(err)
  }
}

// listBuckets();



 
async function list () {
  try {
    let result = await client.list({
      'max-keys': 20
    })
    console.log(result)
  } catch (err) {
    console.log (err)
  }
}
// list();

// putBucket
async function putBucket() {
  try {
    const result = await client.putBucket('official-new');
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}

// putBucket();


async function put () {
  try {
    let result = await client.put('testtesttest.png', 'C:/works/programs/official_new/static/img/ask.png');
    console.log(result);
  } catch (e) {
    console.log(e);
  }
}

// put();


async function deleteFile () {
  try {
    let result = await client.delete('testtesttest.png');
    console.log(result);
  } catch (e) {
    console.log(e);
  }
}

deleteFile();

async function deleteBucket() {
  try {
    const result = await client.deleteBucket('official-new');
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}

// deleteBucket();