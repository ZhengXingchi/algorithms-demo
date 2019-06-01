generator  https://www.liaoxuefeng.com/wiki/1022910821149312/1023024381818112
koa源码分析系列（二）co的实现 #8  https://github.com/purplebamboo/blog/issues/8
co库的简易实现  https://www.jianshu.com/p/21d941132e42





// function promiseToThunk(promise){
//     return function(done){
//         promise.then(function(err,res){
//             done(err,res);
//         },done)
//     }
// }


var fs = require('fs');
function size(file) {
  return function(fn){
    fs.stat(file, function(err, stat){
      if (err) return fn(err);
      fn( stat.size);
    });
  }
}
var getIndexSize = size("./test.html");

getIndexSize(function(size){
    console.log(size);
})

