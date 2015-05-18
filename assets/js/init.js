/**
 * 
 * 应用初始化
 * 
 * 事件绑定
 * 
 * 数据与视图绑定
 * 
 */


////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
//事件绑定

$(function(){
	
	$('body')
	
	//设定编组补丁及编组长度
	.delegate('.dobjBox .set','click',function(){
		var th = $(this);
		var box = th.closest('.dobjBox');
		box.find('.setBox').toggle();
	})		
	//
	.delegate('.dobjBox .make','click',function(){
		var th = $(this);
		var dobjBox = th.closest('.dobjBox');
		var name = th.attr('data-name');
		var refName = th.attr('data-refName');
		var groupNum = [];
		var patch = [];
		var gruopSize = dobjBox.find('.setBox input[type="number"]').val()*1 || 6;
		
		dobjBox.find('.dobj .key input:checked').each(function(){
			var $th = $(this);
			var val = $th.val() * 1;
			groupNum.push(val);
		});
		
		dobjBox.find('.setBox .key input:checked').each(function(){
			var $th = $(this);
			var val = $th.val() * 1;
			patch.push(val);
		});		
		
		refName && ( window.groupRefList = window[refName] );
		window.classifyList = window[name];
		
		//groupCall(groupNum,patch,gruopSize);
		var size = patch ? gruopSize - patch.length : gruopSize;

		var q = size ? group(groupNum, size) : false;

		q = q ? groupWrap(q,patch) : groupWrap([patch]);

		q = groupListModel(q);

		$(template('boxTemp', {
			list : q,
			info : q.length,
			id : 'groupList',
			type: refName,
			embedTemp : ''
		})).appendTo('body');	
		
	})	
	//
	.delegate('.dobjBox .make2','click',function(){
		var th = $(this);
		var dobjBox = th.closest('.dobjBox');
		var name = th.attr('data-name');
		var refName = th.attr('data-refName');
		var groupNum = [];
		var gruopSize = dobjBox.find('.setBox input[type="number"]').val()*1 || 6;
		var q;
		
		dobjBox.find('.setBox .key input:checked').each(function(){
			var $th = $(this);
			var val = $th.val() * 1;
			groupNum.push(val);
		});
		
		refName && ( window.groupRefList = window[refName] );
		window.classifyList = window[name];


		q = combineWrap(window.classifyList,groupNum);
		q = groupWrap(q);


			(function (q, groupSize) {

				var qLength = q.length;
				var qItem;
				while(qLength--){
					qItem = _.uniq(q[qLength]);
					q[qLength] = qItem;
					if(qItem.length != groupSize){
						q.splice(qLength, 1);
					}
				}

				q = _.uniq(q,function(a,b){return JSON.stringify(a)===JSON.stringify(b)});

			})(q, gruopSize);


		q = groupListModel(q);

		$(template('boxTemp', {
			list : q,
			info : q.length,
			id : 'groupList',
			type: refName,
			embedTemp : ''
		})).appendTo('body');
	})	
	//
	.delegate('.dobj2Box .invert','click',function(){
		var th = $(this);
		var dobjBox = th.closest('.dobj2Box');
		
		dobjBox.find('.dobj2 li em').each(function(){
			var $th = $(this).click();
		});		
		
	})
	//
	.delegate('#filterByRefArr .add','click',function(){
		var str, arr;
		str = $('#filterByRefArr input:text').val().trim();
		str = str.replace(/\(/,'').replace(/\)/,' ');
		arr = str.split(/\s+/);
		filterByRefArr.push(arr);
		cc(filterByRefArr, 'filterByRefArr')
	})		
	//
	.delegate('#redsBox .combine','click',function(){
		if(reds.length > 14) {
			if(!confirm('组合数量太大,是否继续')){
				return false;
			}; 
		}
		
		var q = group(window.reds,6); 
		
		q = filterByRef(q, window.filterByRefArr);
		q = window.NUMLIST = redBlueBallModel(q);
		
		if(q.length){
			$( template('boxTemp',{list:q, id: 'numSelList', embedTemp: 'numSelListItemTemp', info:q.length}) ).prependTo('body');
		}
			
		return false;
	})	
	//
	.delegate('.key i','click',function(){
		var $th = $(this);
		var checkbox = $th.next('input:checkbox');
		$th.toggleClass('selected');
		checkbox.trigger('click');
	})
	//
	.delegate('.key .add','click',function(){
		var th = $(this);
		var prev = th.prev('span').clone(true).insertBefore(th);
		return false;
	})
	//
	.delegate('.key .lessen','click',function(){
		var th = $(this);
		var nextAll = th.nextAll('span');
		if(nextAll.length > 1){
			nextAll.eq(nextAll.length-1).remove();
		}
		return false;
	})		
	//
	.delegate('.dobj em','click',function(){
		var $th = $(this);
		var checkbox = $th.next('input:checkbox');
		$th.toggleClass('cancel');
		checkbox.trigger('click');
		checkbox.trigger('change');
	})	
	//
	.delegate('.dobj input:checkbox','change',function(){
		var th = $(this);
		var name = th.attr('name');
		var dobj = th.closest('.dobj');
		var obj;
		var call;
		
		if(th.attr('data-key')){
			obj = {};
			call = function(i){
				var th = $(this);
				var val = th.val()*1;
				var key = th.attr('data-key');
				obj[key] = obj[key] || [];
				obj[key].push(val);
			};
		}else{
			obj = [];
			call = function(i){
				var th = $(this);
				var val = th.val()*1;
				val = val > 9 ? val : '0'+val;
				obj.push(val);
			};			
		}
		
		dobj.find('input[name="'+ name + '"]:checked').each(call);
		
		window[name] = obj;
	})	
	//
	.delegate('#groupList li .make','click',function(){
		var $th = $(this);
		var group = JSON.parse( $th.attr('data-group') );
		var q;
		
		$('title').text(group.join(''));
		try{
			q = combineWrap(window.classifyList,group);
		}catch (e){
			console.log(1,e)
		}

		
		q = filterByRef(q, window.filterByRefArr);
		q = window.NUMLIST = redBlueBallModel(q);
		
		if(q){
			$( template('boxTemp',{list:q, id: 'numSelList', embedTemp: 'numSelListItemTemp', info:q.length}) ).prependTo('body');	
		}else{
			alert('没有组合数据,可能都被过滤掉了.')
		}
		
	})
	//
	.delegate('li .visual','click',function(){
		var $th = $(this);
		var group =  $th.attr('data-push');
		var type = $th.attr('data-type');
		
		var url = 'visual.html?type='+type+'&push='+group;
		
		if(NGGLOBAL.win){
			NGGLOBAL.win.location = url;
			NGGLOBAL.win.focus();
		}else{
			NGGLOBAL.win = window.open(url);
		}
	})	
	//
	.delegate('#groupList li', 'mouseover', function() {
		if( !$('#refList:visible').length) return;
		$('#refList li.ls:last').remove();
		
		var $th = $(this);
		var group = JSON.parse( $th.attr('data-group') );
		var unique = JSON.parse( $th.attr('data-unique') ); 
		var loca = JSON.parse( $th.attr('data-loca') ); 
		
		var list = [{
			group: group,
			unique: unique,
			loca: loca			
		}];
		
		$( template('refListItemTemp',{list: list, className: 'ls'}) ).appendTo('#refList');
	})
	//
	.delegate('#groupList li', 'mouseout', function() {
		$('#refList li.ls:last').remove();
	})
	//
	.delegate('#groupListBox .showRef','click',function() {
		var refList = $('#refList');
		var refName, q;
		
		if( refList.length ){
			refList.toggle();
		}else{
			refName = $(this).attr('data-type');
			if(!refName){
				alert('没有确定参照类型，请在up，down，digit之间选择');
				return;
			}
			q = NGGLOBAL[refName].slice(-18);
			
			q = groupRefListModel(q);
			
			$( template('list2Temp', {list: q, id: 'refList', embedTemp:'refListItemTemp'}) ).appendTo('#groupListBox');			
		}
	})	
	
	/////////////////////////////////////////////////////////////////////
	//
	.delegate('#numSelListBox .showRef','click',function() {
		var numSelRefList = $('#numSelRefList');
		var refName, q;
		
		if( numSelRefList.length ){
			numSelRefList.toggle();
		}else{
			refName = $(this).attr('data-type');
			if(!refName){
				alert('没有确定参照类型，请在up，down，digit之间选择');
				return;
			}
			q = NGGLOBAL[refName].slice(-18);
			q = groupRefListModel(q);
			
			//var q = numSelRefListModel();
			//$( template('list2Temp',{list:q, id:'numSelRefList',  embedTemp: 'numSelRefListItemTemp'}) ).appendTo('#numSelListBox');
			$( template('list2Temp', {list: q, id: 'numSelRefList', embedTemp:'refListItemTemp'}) ).appendTo('#numSelListBox');
		}
	})		
	//
	.delegate('#numSelList li', 'mouseover', function() {
		if( !$('#numSelRefList:visible').length) return;
		$('#numSelRefList li.ls:last').remove();
		
		var list = [], obj = {}, map = ['group','unique','loca'];
		var $th = $(this);
		var layer = $th.closest('.layer');
		var refName = layer.find('.operateBar .showRef').attr('data-type');
		$th.find('.details .'+refName+' p button').each(function(i){
			var val = $(this).attr('data-value');
			obj[map[i]] = JSON.parse(val);
		})
		
		list.push(obj);
		
		$( template('refListItemTemp',{list: list, className: 'ls'}) ).appendTo('#numSelRefList');
	})
	//
	.delegate('#numSelList li', 'mouseout', function() {
		$('#numSelRefList li.ls:last').remove();
	})
	//显示筛选框
	.delegate('.sortBtn', 'click', function() { 
		$('#sortBox ').remove();
		var th = $(this);
		var size = th.closest('li[optional=1]').filter('.selected').length;
		var name = th.attr('data-name');
		var val = th.attr('data-value');
		$( template('sortTemp',{name:name, val:val, filterPattern: size}) ).insertAfter(th);
		return false;
	})
	//分类排序筛选
	.delegate('#sortBox input[type="redio"]', 'click', function(e) {
		 e.stopPropagation();
	})	
	//分类排序筛选
	.delegate('#sortBox button', 'click', function() {
		var th = $(this);
		var box = th.closest('.layer');
		var sortBox = th.closest('#sortBox');
		var filterPattern = sortBox.find('input[name="filterPattern"]').attr('checked');
		var reg = sortBox.find('input[name="reg"]:checked').val();
		var name = th.attr('data-name');
		var val = th.prev('input').val();
		var attr = '[data-' + name + reg + '="'+ val +'"]';
		
		var limit = box.find('li');
		
		if(filterPattern){
			limit = box.find('li.selected');
			limit.find('input[name="itemIsSelected"]:checkbox').attr('checked',false).trigger('change');
		}
		
		var list = limit.filter('li' + attr);
		var size = list.length;
		
		box.find('.sortInfo b').text(size);
		
		list.prependTo( list.parent() ).find('input[name="itemIsSelected"]:checkbox').attr('checked',true).trigger('change');
		
		/*list.each(function(){
			var th = $(this);
			th.find('input[name="itemIsSelected"]:checkbox').attr('checked',true).trigger('change');
			th.prependTo( th.parent() );
		});*/
		
		$('body').scrollTop(0);
		
		sortBox.remove();
		
		return false;
	})
	//单列细节隐藏或显示
	.delegate('.tabBar strong[data-tab]', 'click', function() {
		var th = $(this);
		var box = th.closest('.layer');
		var tab = th.attr('data-tab');
		
		th.siblings('.white').click();
		
		th.toggleClass('white');
		box.find('#numSelList li[optional=1] div[class^="' + tab + '"]').toggleClass('show');
		box.find('.operateBar .showRef').attr('data-type',tab);
		box.find('#numSelRefList').remove();
	})	
	/////////////////////////////////////////////////////////////////////
	//选中
	/*
	.delegate('li[optional=1]', 'click', function() {
		var $th = $(this);
		var input = $th.find('input[name="itemIsSelected"]:checkbox');
		
		if (input.attr('checked')) {
			input.attr('checked', false).trigger('change');
		} else {
			input.attr('checked', true).trigger('change');
		}
	})
	*/
	//拷贝
	.delegate('.copy','click',function() {
		var box = $(this).closest('.layer');
		var copyBox = box.find('.copyBox').empty().toggle();
		var textarea = $('<textarea></textarea>');
		var red = $('#numSelList .redBall').clone().appendTo(copyBox);
		
		$('body').scrollTop(0);
		
		//textarea.text(copyBox[0].innerText).appendTo(copyBox);
		//red.remove();
	})	
	//删除所选
	.delegate('.del','click',function() {
		var box = $(this).closest('.layer');
		var delBox = $('#delBox').empty();
		box.find('li[optional=1] input[name="itemIsSelected"]:checked').each(function() {
			$(this).closest('li').appendTo(delBox);
		});
		box.find('.info b').text(box.find('li[optional=1]').length);
	})
	//撤销删除
	.delegate('.cancel','click',function() {
		var box = $(this).closest('.layer');
		var optionalList = box.find('.optionalList');
		$('#delBox li').prependTo(optionalList);
	})	
	//反选
	.delegate('.reset','click',function() {
		var box = $(this).closest('.layer');
		
		box.find('li input[name="itemIsSelected"]:checkbox').each(function() {
			var input = $(this);
			if (input.attr('checked')) {
				input.attr('checked', false).trigger('change');
			} else {
				input.attr('checked', true).trigger('change');
			}
		});
	})
	//全不选
	.delegate('.not','click',function() {
		var box = $(this).closest('.layer');
		box.find('li[optional=1] input[name="itemIsSelected"]:checked').each(function() {
			var input = $(this);
			input.attr('checked', false).trigger('change');;
		});
	})	
	/////////////////////////////////////////////////////////////////////
	//选中样式
	.delegate('li[optional=1] input[name="itemIsSelected"]:checkbox', 'change', function() { 
		var th = $(this);
		var li = th.closest('li');
		
		if (th.attr('checked')) {
			li.addClass('selected');
		} else {
			li.removeClass('selected');
		}
	})
	//切换细节
	.delegate('.toggle','click',function() {
		var box = $(this).closest('.layer');
		box.find('.details').toggle();
	})	
	//层展开或收缩
	.delegate('.expandable','click',function() {
		var th = $(this);
		var box = th.closest('.layer');
		var operateBar = box.find('.operateBar,.tabBar');
		var refList = box.find('#refList,#numSelRefList');
		
		if(!th.attr('expandable')){
			th.css({'position':'absolute','left':0, 'top':0}).text('展开');
			box.addClass('collapse');
			operateBar.css({'position':'static'});
			refList.css({'position':'static'});
			th.attr('expandable',1);
		}else{
			th.css('position','').text('收缩');
			box.removeClass('collapse');
			operateBar.css({'position':'fixed'});
			refList.css({'position':'fixed'});
			th.removeAttr('expandable');
		}
	})
	//文档滚动
	.delegate('#tScroll','click',function() {
		$('body').scrollTop(0);
	})
	.delegate('#bScroll','click',function() {
		var h = $('#numSelList').height() - $(window).height();
		$('body').scrollTop(h);
	})
	.delegate('#lScroll','click',function() {
		$('body').scrollLeft(0);
	})
	.delegate('#rScroll','click',function() {
		$('body').scrollLeft(1287);
	})		
	//删除模块
	.delegate('.remove','click',function() {
		 $(this).parent().remove();
	})	
	//关闭box
	.delegate('.close','click',function() {
		var box = $(this).closest('.layer');
		if(confirm('确定关闭窗口?!')){
			box.remove();
		}
	});	
	
	
});


////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
//init
















