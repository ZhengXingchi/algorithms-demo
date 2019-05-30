# algorithms-demo
Algorithms  and Data Structures

## 排序算法
参考[Javascript算法——希尔排序](https://segmentfault.com/a/1190000009461832)
![排序算法](./img/sort.png "排序算法")
 
1. 快速排序
```js
var quickSort=function(arr){
  if(arr.length<=1){return arr;}
  var pivotIndex=Math.floor(arr.length/2)
  var left=[];
  var right=[];
  var pivot= arr.splice(pivotIndex,1)[0]
  for(let i=0;i<arr.length;i++){
    if(arr[i]<pivot){
        left.push(arr[i])
    }else{
        right.push(arr[i])
    }
  }
  return quickSort(left).concat([pivot],quickSort(right))
}
```


2.插入排序

15  14  13  12  11

14  15  13  12  11  取出14与前面比较知道前面没有元素或者大于前面元素的时候停下来

13  14  15  12  11  取出13与前面比较知道前面没有元素或者大于前面元素的时候停下来

```js
var insertSort=function(arr){
  for(let i=1;i<arr.length;i++){
    for(let j=i;j>0&&arr[j]<arr[j-1];j--){
        var temp=arr[j]
          arr[j]=arr[j-1]
          arr[j-1]=temp
    }
  }
  return arr
}
```

这种的效率很低，以下是改良版本
```js
var insertSort=function(arr){
let i;
let j;
var temp; 
  for(i=1;i<arr.length;i++){ 
    temp=arr[i]
    for(j=i;j>=0&&temp<arr[j-1];j--){    
      arr[j] =arr[j-1]
    }  
    if(j!=i){    
        arr[j]=temp      
    }
  }
  return arr
}
```


3. 选择排序
```js
var selectSort=function(arr){
  var minIndex; 
  for(let i=0;i<arr.length;i++){ 
     minIndex=i
    for(let j=i;j<arr.length;j++){   
        if(arr[minIndex]>arr[j]){
            minIndex=j
        }    
    }
    var temp=arr[minIndex]
    
    arr[minIndex]=arr[i]
    arr[i]=temp;
  }
  return arr
}
```


4.希尔排序
```js
function shellSort(arr) {
    var len = arr.length,
        temp,
        gap = 1;
    while(gap < len/3) {          //动态定义间隔序列
        gap = gap*3+1;
    }
    for (gap; gap > 0; gap = Math.floor(gap/3)) {
        for (var i = gap; i < len; i++) {
            temp = arr[i];
            for (var j = i-gap; j >= 0 && arr[j] > temp; j -= gap) {
                arr[j+gap] = arr[j];
            }
            arr[j+gap] = temp;
        }
    }
    return arr;
}

```


## 栈队列链表
参考[JavaScript 的数据结构与算法 (一)](https://juejin.im/entry/58759e79128fe1006b48cdfd)

1.栈的实现  先进后出
```js
function Stack(){
  this.items=[]
}
Stack.prototype={
    constructor:Stack,
    push:function(element){
        this.items.push(element)
    },
    pop:function(){
        this.items.pop()
    },
    peek:function(){
        return this.items[this.items.length-1]
    },
    isEmpty:function(){
       return this.items.length==0
    },
    clear:function(){
        this.items=[]
    },
    size:function(){
        return this.items.length
    },
    print:function(){
        console.log(this.items.toString())
    }
}
```

通过栈实现对正整数的二进制转换
```
function divideBy2(decNumber){
  var decStack=new Stack()
  var rem;
  var decString=''
  while(decNumber>0){
    rem=decNumber%2
    decStack.push(rem)
    decNumber=Math.floor(decNumber/2)
  }
  while(!decStack.isEmpty){
    decString+=decStack.pop().toString()
  }
  return decString;
}
```


## 二叉树
参考[js 中二叉树的深度遍历与广度遍历(递归实现与非递归实现)](https://www.jianshu.com/p/5e9ea25a1aae)
二叉树`(a+b*c)-d/e`在js中可以用对象的形式表示出来：
```
var tree = {
    value: "-",
    left: {
        value: '+',
        left: {
            value: 'a',
        },
        right: {
            value: '*',
            left: {
                value: 'b',
            },
            right: {
                value: 'c',
            }
        }
    },
    right: {
        value: '/',
        left: {
            value: 'd',
        },
        right: {
            value: 'e',
        }
    }
}

```

先序遍历-递归遍历
```
let result = []
let dfs=function(node){
  if(node){
    result.push(node.value)
    dfs(node.left)
    dfs(node.right)
  }
}
dfs(tree)
console.log(result)
```

先序遍历-非递归遍历
```
let dfs=function (nodes){
  let result = []
  let stack =[]
  stack.push(nodes);
  while(stack.length){
    let node = stack.pop()
    result.push(node.value)
    if(node.right) stack.push(node.right)
    if(node.left)  stack.push(node.left)
  }
  return result
}
dfs(tree)

```


中序遍历-非递归遍历
```
let dfs=function(node){
  let result = []
  let stack= []
  while(stack.length || node){
    if(node){
      stack.push(node)
      node=node.left
    }else{
      node=stack.pop()
      result.push(node.value)
      node=node.right
    }

  }
  return result
}
dfs(tree)
```



波兰式&逆波兰式
参考[前面面试之3-15 算法类](https://www.jianshu.com/p/461a3ef491b0?utm_campaign=maleskine&utm_content=note&utm_medium=seo_notes&utm_source=recommendation)


```
var keys = ['province', 'city', 'name']
var data = [{
  "province": "浙江",
  "city": "杭州",
  "name": "西湖"
}, {
  "province": "四川",
  "city": "成都",
  "name": "锦里"
}, {
  "province": "四川",
  "city": "成都",
  "name": "方所"
}, {
  "province": "四川",
  "city": "阿坝",
  "name": "九寨沟"
}]
```


=>




```
var data = [{
  "value": "浙江",
  "children": [{
    "value": "杭州",
    "children": [{
      "value": "西湖"
    }]
  }]
}, {
  "value": "四川",
  "children": [{
    "value": "成都",
    "children": [{
      "value": "锦里"
    }, {
      "value": "方所"
    }]
  }, {
    "value": "阿坝",
    "children": [{
      "value": "九寨沟"
    }]
  }]
}]
```

采用trie 树实现
```

var transObject = function(tableData, keys) {
  let hashTable = {}, res = []
  for (let i = 0; i < tableData.length; i++) {
    let arr = res, cur = hashTable
    for (let j = 0; j < keys.length; j++) {
      let key = keys[j], filed = tableData[i][key]
      if (!cur[filed]) {
        let pusher = {
          value: filed
        }, tmp
        if (j !== (keys.length - 1)) {
          tmp = []
          pusher.children = tmp
        }
        cur[filed] = { $$pos: arr.push(pusher) - 1 }
        cur = cur[filed]
        arr = tmp
      } else {
        cur = cur[filed]
        arr = arr[cur.$$pos].children
      }
    }
  }
  return res
}
```











