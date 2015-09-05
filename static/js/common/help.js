/**
 * 
 * 定义工具函数
 * 
 */

function getUrlParam(param){
    var reg = new RegExp("(^|&)" + param + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) 
        return decodeURIComponent(r[2]);
    return null;
}

/*
 * 获取数组最后一个元素
 */
function getArrayLast(arr){
	if(!arr) return;
	var last = arr.slice(-1);
	return last[0];
}

/*
 * 判断数组元素是否全是偶数
 */
function isAlloddOrEven( arr ){

	var len = arr.length;

	var j = 0;
	
	for(var i in arr){
		j += arr[i] * 1 % 2;
	}
	
	return j==0 || j==len ? true : false;
}

/*
 * 
 */
function getArrayUnique( arr ){
	var arr = arr.slice().reverse();
	return $.unique(arr);
} 

/*
 * 控制台打印输出
 */
function cc(obj,prefix){return;
	var prefix = prefix || '';
	if(typeof obj == 'object'){
		console.log(prefix +  ' = ' + JSON.stringify(obj) + ';');
	}else{
		console.log(prefix + ' : ' + obj);
	}
}
function cg(obj){
	cc(obj,'debug =>');
}
/*
 * 以参数为参照，取得1-60的数字的相对位置;
 * 返回一个映射数组;
 * 或重;(1)
 * 或连;(2)
 * 或延;(3)
 */
function getLocation_ (referArr,countArr){
	var countArr = countArr || window.colMap;
	var result = {};
	var item;
	
	outerloop:
	for(var i in countArr){
		for(var j in referArr){
			item = referArr[j];
			if(i == item){
				result[i] = 1;
				continue outerloop; 
			}
		}

		for ( var k in referArr) {
			item = referArr[k];
			if (i == item*1 - 1 || i == item*1 + 1) {
				result[i] = 2;
				break;
			} else {
				result[i] = 3;
			}
		}		
		
	}
	
	if(countArr === window.colMap){
		delete result[0];
	}
	
	return result;	
}

function getLocation (referArr,countArr){
	
	if(!countArr) return getLocation_(referArr);
	if(countArr.constructor === Object) return getLocation_(referArr,countArr);
	
	var result = {};
	var item;
	var val;
	
	outerloop:
	for(var i in countArr){
		
		val = countArr[i];
		
		for(var j in referArr){
			item = referArr[j];
			if(val == item){
				result[val] = 1;
				continue outerloop; 
			}
		}

		for ( var k in referArr) {
			item = referArr[k];
			if (val == item*1 - 1 || val == item*1 + 1) {
				result[val] = 2;
				break;
			} else {
				result[val] = 3;
			}
		}		
		
	}
	
	return result;
}

/*
 * 
 */
function countLocation(data) {
	var loca1 = 0, loca2 = 0, loca3 = 0;

	for ( var i in data) {
		var val = data[i];
		if (val == 1) {
			loca1 += 1;
		} else if (val == 2) {
			loca2 += 1;
		} else {
			loca3 += 1;
		}
	}
	
	return [loca1,loca2,loca3];
}


/*
 * example:
 * var r = combine([1,2,3],[0],[9]);
 * JSON.stringify(r) == "[[1,0,9],[2,0,9],[3,0,9]]";
 */
function combine(){
	var  args = Array.prototype.slice.call(arguments, 0);

	var arr1;
	var arr2;
	var arr3;	
	
	function func(arr1,arr2){
		var arr3 = [];
		var item1,item2,item1c;

		if(arr1.length == 0) return arr2;
		if(arr2.length == 0) return arr1;

		for(var i in arr1){
			item1 = arr1[i];
			item1 = item1.constructor === Array ? item1 : [item1];

			for(var j in arr2){
				item1c = item1.slice();
				item2 = arr2[j];
				item1c = item1c.concat(item2);

				arr3.push(item1c);
			}

		}

		return arr3;

	}
	
	if(args.length == 1) {
		//console.log(args);
		return args[0];
	}
	if(args.length > 1){
		arr1 = args.shift();
		arr2 = args.shift();
		arr3 = func(arr1,arr2);
		args.unshift(arr3);
		//return combine.apply(null,args);
		return _combine(args);
	}
	
}

function getLimitLengthByData(){
	var type = getUrlParam('data');

	if(type == 30) return 7;
	if(type == 35 || type == 15) return 5;
	return 6;
}

function _combine(args){

	var limitLength = getLimitLengthByData();

	function xxUniq(q1) {

		var qLength = q1.length;
		var qItem;
		while(qLength--){
			qItem = _.uniq(q1[qLength]);
			q1[qLength] = qItem;
			if(qItem.length > limitLength){
				q1.splice(qLength, 1);
			}
		}

		return _.uniq(q1,function(a){return typeof a == 'object' ? JSON.stringify(a) : a; });

	}

	function func(arr1,arr2){
		var arr3 = [];
		var item1,item2,item1c;

		if(arr1.length == 0) return arr2;
		if(arr2.length == 0) return arr1;

		for(var i in arr1){
			item1 = arr1[i];
			item1 = item1.constructor === Array ? item1 : [item1];

			for(var j in arr2){
				item1c = item1.slice();
				item2 = arr2[j];
				item1c = item1c.concat(item2);
				//console.log(item1c);
				arr3.push(item1c);
			}

		}

		return xxUniq(arr3);

	}

	var arr1;
	var arr2;
	var arr3;


	while(args.length > 1){
		arr1 = args.shift();
		arr2 = args.shift();
		arr3 = func(arr1,arr2);
		args.unshift(arr3);
	}

	if(args.length == 1) {
		return args[0];
	}

	/*if(args.length > 1){
		arr1 = args.shift();
		arr2 = args.shift();
		arr3 = func(arr1,arr2);
		args.unshift(arr3);
		console.log(arr1, arr2, arr3);
		return _combine(args);
	}*/

}


/*
 * 对数字进行编组
 *
 * example:
 * var r = group([1,2,3,4],3);
 * JSON.stringify(r) == "[[1,2,3],[1,2,4],[1,3,4],[2,3,4]]";
 */
function group(nu, groupl, result){
	
	var result = result ? result : [];
	var nul = nu.length;
	var outloopl = nul - groupl;
	
	var nuc = nu.slice(0);
	
	var item = nuc.shift();
	item = item.constructor === Array ? item : [item];
	
	
	(function func(item,nuc){
		var itemc;
		var nucc = nuc.slice(0);
		var margin = groupl- item.length
		
		
		if( margin == 0){
			result.push(item);
			return;
		}
		if( margin == 1){
			for(var j in nuc){
				itemc = item.slice(0);
				itemc.push(nuc[j]);
				result.push(itemc);
			}			
		}		
		if( margin > 1){
			itemc = item.slice(0);
			itemc.push(nucc.shift());
			func(itemc,nucc);

			if(item.length + nucc.length >= groupl){
				func(item,nucc);
			}
			
		}
		
	})(item,nuc);
	

	if(nuc.length >= groupl){
		return group(nuc, groupl, result);
	}else{
		return result;
	}
	
}


function group2(array, num) {
	var arraySize = array.length;
	var res=[];
	if (0 > num || num > arraySize) {
		return;
	}

	var loop = 0;
	var numZuhe = 0;
	var stopCondNum = 0;
	var currIdx = num - 1;
	var changeIdx = num - 1;
	var arrayIdx = new Array(array.length); //(int *)malloc(num * sizeof(int));
	var isChanged = true;

	if (null == arrayIdx) {
		return;
	}

	for (loop = 0; loop < num; ++loop) {
		arrayIdx[loop] = loop;
	}

	while (1) {
		var loop = 0;
		var stopCondNum = 0;

		if (isChanged) {
			var tem = [];
			for (loop = 0; loop < num; ++loop) {
				tem.push( array[arrayIdx[loop]]);

			}
			++numZuhe;
			res.push(tem);
		}

		// 判断终止条件
		for (loop = 0; loop < num; ++loop) {
			if (arrayIdx[num - loop - 1] == arraySize - loop - 1) {
				++stopCondNum;
			}
			else {
				break;
			}
		}
		if (num == stopCondNum) {
			break;
		}

		// 当前位已经达到最大值
		if (arrayIdx[currIdx] == arraySize - num + currIdx) {
			if (changeIdx == currIdx) // 是否变化到最左侧位数
			{
				changeIdx--;
				currIdx = num - 1;
				arrayIdx[changeIdx] = arrayIdx[changeIdx] + 1;
				for (loop = changeIdx + 1; loop < num; ++loop) {
					arrayIdx[loop] = arrayIdx[loop - 1] + 1;
				}

				isChanged = true;
			}
			else {
				currIdx--;

				isChanged = false;
			}
		}
		else {
			arrayIdx[currIdx] = arrayIdx[currIdx] + 1;
			isChanged = true;
		}
	}

	console.log('group => ', JSON.stringify(res));
	return res;
}




/*
 * 
 */
function format(arr){
	var result = [];
	var item;
	for(var i in arr){
		item = arr[i];
		item = item.constructor === Array ? item : [item];
		result.push(item.join(' '));
	}
	return result;
}	

/*
 * 
 */
function compare(arr1,arr2,nu1){
	var nu2 = 0;
	var arr3 = [];
	var val;
	for(var i in arr1){
		val = arr1[i]-arr2[i];
		arr3.push(val);
	}
	
	for(i in arr3){
		if(arr3[i] == 0) nu2+=1;
	}
	
	//console.log(nu2-nu1)
	
	if( nu2-nu1 > 0) return true;
	
}

/*
 * 
 */
function classify_(index){
	var arr = window.colMap;
	var length = arr.length;
	var result = {};
	var item;
	
	for(var i = 1; i< length; i++){
		item = arr[i];
		key = item[index]; 
		key = typeof key !== 'undefined' ? key : (i+'').slice(-1) != 0 ? (i+'').slice(-1) : '0';
		result[key] = result[key] || [];
		result[key].push(i);
	}
	
	return result;
}

function classify(arr){
	var result = {};
	var key;
	
	if(typeof arr === 'number' ){
		return classify_(arr);
	}
		
	for(var i in arr){
		key = arr[i];
		result[key] = result[key] || [];
		result[key].push(i*1);
	}
	
	return result;
}

/*
 * 
 */
function count(arr){
	var length = arr.length;
	var result = {};
	var item;
	
	for(var i = 0; i< length; i++){
		item = arr[i];
		result[item] = result[item] ? result[item]+1 : 1;
	}	
	
	//console.log(JSON.stringify(result));
	
	return result;	
}

/**
 * 计算数组元素重复次数
 * @returns {{}}
 * example：
 * countRepeat([1,1,1,3])  //return {1:3,3:1}
 */
function countRepeat(arr){
	var length = arr.length;
	var result = {};
	var item;

	for(var i = 0; i< length; i++){
		item = arr[i];
		result[item] = result[item] ? result[item]+1 : 1;
	}

	return result;
}

/*
 * 计算数组元素Unique值得数量
 */
function getArrUniqueSize(arr){
	var length = arr.length;
	var result = {};
	var r = [];
	var item;
	
	for(var i = 0; i< length; i++){
		item = arr[i];
		result[item] = result[item] ? result[item]+1 : 1;
	}	
	
	for(var j in result){
		r.push( [j , result[j]] );
	}
	
	return r;		
}


/*
 * 
 */
function countCol(arr) {
	var length = arr.length;
	var result = [];
	var obj = count(arr);
	
	for(var i = 0; i < length; i++){
		result[i] = 0;
	}
	
	for(var j in obj){
		result[j*1-1] = obj[j];
	}
	
	return result;
}

function locaCompare(arr1,arr2){
	if(!arr1) return;
	if(arr1.length<=0 || arr2.length<=0) return;
	
	var arr1 = $.unique( arr1.slice() );
	var arr2 = $.unique( arr2.slice() );
	
	var locaMap = getLocation(arr1,arr2);
	
	return countLocation(locaMap);
}

/*
 * 
 */
function groupWrap(groupList, patch) {
	var item;

	for ( var i in groupList) {
		item = groupList[i];
		if (patch && patch.length) {
			item = item.concat(patch);
		}
		
		item.sort(function(a, b) {
			return a - b;
		});

		groupList[i] = item;
	}

	//cc(groupList,'groupList');
	return groupList;
}

/*
 * 
 */
function combineWrap(classifyListMap, groupScheme) {
	var countList = count(groupScheme);

	var args = [];
	var number;
	var item;

	for ( var i in countList) {
		number = countList[i];
		//console.log(2222,classifyListMap[i])
		item = group(classifyListMap[i], number);
		console.info(item);
		args.push(item);
	}

	return (combine.apply(null, args));
}


////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
//检测操作

function numSelFilter( numSelObj ){
	
	var details = numSelObj.details;
	var locaCount = details.loca.loca;
	var colCount = details.col.col;
	var upMargin = details.upMarginRef.up;
	var downMargin = details.downMarginRef.down;
	var singleDigit = details.singleDigitRef.digit;
	
	var i
	var item;
	
	//col check
	if(JSON.stringify(colCount) === '[1,1,1,1,1,1]') return false;
	
	for(i in colCount){
		if( colCount[i] > 3) return false;
	}
	
	if( getArrayUnique(upMargin).length < 3 ) return false;
	if( getArrayUnique(downMargin).length < 3 ) return false;
	if( getArrayUnique(singleDigit).length < 4 ) return false;
	
	//upMargin check
	if( isAlloddOrEven(upMargin) &&  isAlloddOrEven(downMargin) ) return false;	
	
	//downMargin check
	if( isAlloddOrEven(downMargin) && isAlloddOrEven(singleDigit) ) return false;
	
	//singDigit check
	if( isAlloddOrEven(singleDigit) && isAlloddOrEven(upMargin) ) return false;
	
	//custom check
	if( filter(locaCount, colCount, upMargin, downMargin, singleDigit) === false ) return false;
	
	// if chexck ok
	return true;
}

//计算两个数组相似度
function getMatchSize(arr1, arr2){
	
	var length = arr1.length;
	var length2 = arr2.length;
	
	var val1, val2;
	var size = 0;
	
	for(var i = 0; i < length; i++){
		
		val1 = arr1[i];
		
		for(var j = 0; j < length2; j++){
			val2 = arr2[j];
			
			if (val1 == val2) {
				size+=1;
				break;
			}
		}
		
	}
	
	return size;
}

//根据提供的参考数组进行过滤
function filterByRef(filterArr, refArr, limit){
	
	if(!refArr || refArr.length==0 ) return filterArr;
	
	limit = limit || 4;
	
	var result = [];
	var length = filterArr.length;
	var length2 = refArr.length;
	
	var filterItem, refItem;
	
	for(var i = 0; i < length; i++){
		
		filterItem = filterArr[i];
		result.push(filterItem);
		
		for(var j = 0; j < length2; j++){
			refItem = refArr[j];
			
			if(getMatchSize(filterItem, refItem) > limit){
				result.pop();
				break;
			}
		}
		
	}
	
	return result;
}

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
//封装操作


//
function redBlueBallModel(arr) {
	var result = [];
	var item;
	var red;
	var blue;
	var ri;
	var inLoca;
	var inCol;
	var upMargin;
	var downMargin;
	var singleDigit;
	var locaCount;
	var colCount;
	var obj;

	for ( var i in arr) {
		
		obj = {};
		inLoca = [];
		inCol = [];
		upMargin = [];
		downMargin = [];
		singleDigit = [];

		item = arr[i];

		// 数组转字符，再转为数组;
		item = $.trim(item.join(' ')).split(/\s+/);

		$.each(item, function(i, val) {

			singleDigit[i] = val.slice(val.length - 1) * 1;

			val = val * 1;
			item[i] = val;
			inLoca[i] = redBallLocaMap[val];
			inCol[i] = colMap[val][0];
			upMargin[i] = colMap[val][1];
			downMargin[i] = colMap[val][2];

		});

		item.sort(function(a, b) {
			return a - b;
		});
		
		red = item.slice();

		$.each(item, function(index, val) {
			item[index] = val < 10 ? '0' + val : val;
		});

		locaCount = countLocation(inLoca);
		colCount = countCol(inCol);

		upMargin.sort(function(a, b) {
			return a - b;
		});
		downMargin.sort(function(a, b) {
			return a - b;
		});
		singleDigit.sort(function(a, b) {
			return a - b;
		});

		// 过滤
		if ( filter(locaCount, colCount, upMargin, downMargin, singleDigit) === false ) continue;
		
		
		var colCountRefLast = getArrayLast(colCountRef);
		var upMarginRefLast = getArrayLast(upMarginRef);
		var downMarginRefLast = getArrayLast(downMarginRef);
		var singleDigitRefLast = getArrayLast(singleDigitRef);
		
		var upLoca, downLoca, digitLoca;
		
		upLoca = locaCompare( upMarginRefLast, upMargin);
		downLoca = locaCompare( downMarginRefLast, downMargin);
		digitLoca = locaCompare( singleDigitRefLast, singleDigit);
		
		var upUnique, downUnique, digitUnique;
		
		upUnique = getArrayUnique(upMargin);
		downUnique = getArrayUnique(downMargin);
		digitUnique = getArrayUnique(singleDigit);
		
		obj = {
				redBall: item,
				details:{
					red:{
						red: red
					},
					loca:{
						loca: locaCount
					},
					col:{
						col: colCount
					},
					upMarginRef:{
						up: upMargin,
						upUnique: upUnique,
						upLoca: upLoca					
					},
					downMarginRef:{
						down: downMargin, 
						downUnique: downUnique,
						downLoca: downLoca					
					},
					singleDigitRef:{
						digit: singleDigit,
						digitUnique: digitUnique,
						digitLoca: digitLoca						
					}
				},
				data:{
					red: JSON.stringify(red),
					loca: JSON.stringify(locaCount),
					col : JSON.stringify(colCount),
					up : JSON.stringify(upMargin),
					upUnique: JSON.stringify(upUnique),
					upLoca : JSON.stringify(upLoca),
					down : JSON.stringify(downMargin),
					downUnique: JSON.stringify(downUnique),
					downLoca : JSON.stringify(downLoca),
					digit : JSON.stringify(singleDigit),
					digitUnique: JSON.stringify(digitUnique),
					digitLoca : JSON.stringify(digitLoca)				
				}
				
		};	
		
		if(numSelFilter(obj) ){
			if(window.blueBallIsRandom){
				// 随机提取篮球
				blue = blues[Math.round(Math.random() * (blues.length - 1))];			
			}else{
				// 顺序提取篮球
				blue = blues.shift();
				blues.push(blue);
			}

			blue = blue ? ':' + blue : '';
			obj.redBall.push(blue);
			result.push(obj);
		}
		
	}
	
	return result;
}

//
function numSelRefListModel(){
	var colArr = colCountRef.slice();
	var upArr = upMarginRef.slice();
	var downArr = downMarginRef.slice();
	var digitArr = singleDigitRef.slice();
	
	var length = Math.min(colArr.length, upArr.length, downArr.length, digitArr.length, 10);
	var result = [];
	var prev = [];
	var obj;
	var col,up,down,digit;
	var upLoca,downLoca,digitLoca;
	
	for(var i = length; i > 0; i--){
		col = colArr.pop();
		up = upArr.pop();
		down = downArr.pop();
		digit = digitArr.pop();
		
		upLoca = locaCompare( getArrayLast(upArr), up);
		downLoca = locaCompare( getArrayLast(downArr), down);
		digitLoca = locaCompare( getArrayLast(digitArr), digit);
		
		obj = {
				col:col, 
				up: up, 
				upLoca: upLoca,
				down: down, 
				downLoca: downLoca,
				digit: digit,
				digitLoca: digitLoca
			  };
		
		result.unshift(obj);
	}
	
	//cc(result,'refList');
	return result;
	
}

//
function groupListModel(arr){
	var result = [];
	var length = arr.length;
	var prevRef = getArrayLast(window.groupRefList);
	var item;
	var loca;
	var unique;
	
	for(var i = 0; i < length; i++){
		
		item = arr[i];
		
		loca = locaCompare(prevRef,item);
		
		unique = $.unique( item.slice() );
		unique.sort(function(a,b){
			return a-b;
		});
		
		if( window.groupFilter(group,unique,loca) === false ) continue;
		
		result.push({
			group: item,
			data: {
				loca: JSON.stringify(loca),
				unique : JSON.stringify(unique),
				group: JSON.stringify(item)				
			},
			details:{
				group: item,
				loca: loca,
				unique : unique				
			}
		});		
	}
	
	return result;
}
//
function groupRefListModel(arr){
	var arr = arr.slice();
	var length = arr.length-1;
	var result = [];
	var current;
	var unique;
	var obj;
	var loca;
	
	for(var i = length; i > 0; i--){
		current = arr.pop();
		loca = locaCompare(getArrayLast(arr),current);
		
        unique = _.uniq( current.slice() );

        unique.sort(function(a,b){
			return a - b;
		});

		//obj = {
		//		group: current.sort(function(a, b){return a-b;}),
		//		unique : unique,
		//		loca: loca
		//};
		obj = {
			original: current.sort(function(a, b){return a-b;}),
			cys: loca,
			uniq : unique
		};

		result.unshift(obj);
	}
	
	return result;
}


///////////////////////////////////////////////////

function xxReverse(e){
	var box = $(e.target).parent();

	box.find('span em').each(function(){
		$(this).click();
	});
}


function xxUniq(q1, groupSize) {

	var qLength = q1.length;
	var qItem;
	while(qLength--){
		qItem = _.uniq(q1[qLength]);
		q1[qLength] = qItem;
		if(qItem.length != groupSize){
			q1.splice(qLength, 1);
		}
	}

	return _.uniq(q1,function(a){return JSON.stringify(a)});

}
///////////////////////////////////////////////////
//回调函数

function groupCall(groupnum,patch,size) {
	
	size = patch ? size - patch.length : size;

	var q = size ? group(groupnum, size) : false;

	q = q ? groupWrap(q,patch) : groupWrap([patch]);

	q = groupListModel(q);

	$(template('boxTemp', {
		list : q,
		info : q.length,
		id : 'groupList',
		embedTemp : ''
	})).appendTo('body');
}

/**
 * 统计组合数量
 * @param all
 * @param active
 */
function countComb(all, active){

	var result = {};
	var item;

	for(var i = 0, v; i < all.length; i++){

		v = all[i];

		item = result[v] = result[v] || [];

		item.push(i+1);

	}

	return combineWrap(result, active);

}


function u2d(){

	var sm = NGGLOBAL.countUm[countUm.length-1].all.slice();

	var cache = {};

	_.forEach(sm, function(v, i, list){

		for(var j = 1; j < colMap.length; j++){

			if( colMap[j][1] === i  ){

				cache[v] = cache[v] || [];

				cache[v].push(colMap[j][2]);

			}

		}

	});


	console.log(cache);
	return cache;

}



function s2d(){

	var sm = NGGLOBAL.countSm[countSm.length-1].all.slice();

	var cache = {};

	_.forEach(sm, function(v, i, list){

		for(var j = 1; j < colMap.length; j++){

			if( i === (j+'').replace(/\d*(?=\d)/,'') * 1 ){

				cache[v] = cache[v] || [];

				cache[v].push(colMap[j][2]);

			}

		}

	});


	for(var i in cache){
		cache[i] = _.uniq(cache[i]);
	}


	console.log(cache);

	return cache;


}


function getAllCombPatch(data){

	data = data || getUrlParam('data') || 33;

	var str = localStorage['allCombPatch'+data];

	try{
		var allCombPatch = JSON.parse(str);
	}catch(e){
		console.log(e);
		alert('err on getAllCombPatch');
	}

	return allCombPatch;

}

function getCurrentLottey(){

	var str = localStorage['currentLottey'];

	try{
		var currentLottey = JSON.parse(str);
	}catch(e){
		console.log(e);
		alert('err on getAllCombPatch');
	}

	return currentLottey;

}


