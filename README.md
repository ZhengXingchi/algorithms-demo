# algorithms-demo
Algorithms  and Data Structures

## 排序算法
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


