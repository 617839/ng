/**
 * 
 * 全局变量声明与设置
 * 
 */

//全局变量命名空间
window.NGGLOBAL = window.NGGLOBAL || {};
//ref window.open 
NGGLOBAL.win = undefined;

window.loadingFigure = '<span style="position:fixed;top:40%;left:50%;margin:25px auto;display:inline-block;text-align:center;" name="_loading_"><svg width="16" height="16" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" version="1.1"><path d="M 150,0 a 150,150 0 0,1 106.066,256.066 l -35.355,-35.355 a -100,-100 0 0,0 -70.711,-170.711 z" fill="#3d7fe6"><animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 150 150" to="360 150 150" begin="0s" dur="1s" fill="freeze" repeatCount="indefinite" /></path></svg></span>';

window.blueBallIsRandom = 0;

window.blues = [ '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16' ]; 

window.reds = (function(){
	var arr = [];
	for(var i = 1; i<34; i++){
		arr.push(i);
	}
	return arr;
})();

window.filter = function(loca, col, upMargin, downMargin, singleDigit){};

window.q = [];
window.filterByRefArr = [];

window.refMap = {
		'0' :  'colCountRef',
		'1' :  'upMarginRef',
		'2' :  'downMarginRef',
		'3' :  'singleDigitRef',
		'4' :  'downMarginRef',
		'5' :  'singleDigitRef'
	};
window.refMapByIndex = 2;

window.classifyBy = {
						'0' :  'classifyByColCount',
						'1' :  'classifyByUpMargin',
						'2' :  'classifyByDownMargin',
						'3' :  'classifyBySingleDigit',
						'4' :  'classifyByDownMarginLocaMap',
						'5' :  'classifyBySingleDigitLocaMap'
					};

window.classifyByIndex = 2;



//classify by colCount
window.classifyByColCount = classify(0);
cc(classifyByColCount,'classifyByColCount');

//classify by UpMargin
window.classifyByUpMargin = classify(1);
cc(classifyByUpMargin,'classifyByUpMargin');

//classify by DownMargin

window.classifyByDownMargin = classify(2);
cc(classifyByDownMargin,'classifyByDownMargin');

//classify by SingleDigit
window.classifyBySingleDigit = classify(3);
cc(classifyBySingleDigit,'classifyBySingleDigit');

//redBall location map
window.redBallLocaMap = getLocation(opnRedBall);
cc(redBallLocaMap,'redBallLocaMap');

//downMargin location map
window.downMarginLocaMap = getLocation(getArrayLast(window.downMarginRef),classifyByDownMargin);
cc(downMarginLocaMap,'downMarginLocaMap');

//upMargin location map
window.upMarginLocaMap = getLocation(getArrayLast(window.upMarginRef),classifyByUpMargin);
cc(upMarginLocaMap,'upMarginLocaMap');

//classify by DownMarginLocaMap
window.classifyByDownMarginLocaMap = classify(downMarginLocaMap);
cc(classifyByDownMarginLocaMap,'classifyByDownMarginLocaMap');

//classify by upMarginLocaMap
window.classifyByUpMarginLocaMap = classify(upMarginLocaMap);
cc(classifyByUpMarginLocaMap,'classifyByUpMarginLocaMap');

//singleDigit location map
window.singleDigitLocaMap = getLocation(getArrayLast(window.singleDigitRef),classifyBySingleDigit);
cc(singleDigitLocaMap,'singleDigitLocaMap');

//classify by singleDigitLocaMap
window.classifyBySingleDigitLocaMap = classify(singleDigitLocaMap);
cc(classifyBySingleDigitLocaMap,'classifyBySingleDigitLocaMap');


//xx
classifyByxx = (function(){

	var arr = [];
	for(var i in classifyByDownMargin){
		arr.push(i);
	}

	return {0:arr,1:arr.slice(),2:arr.slice(),3:arr.slice(),4:arr.slice(),5:arr.slice()};
})();




















