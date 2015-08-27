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
	.on('click', '.dobjBox .set',function(){
		var th = $(this);
		var box = th.closest('.dobjBox');
		box.find('.setBox').toggle();
	})		
	//
	.on('click', '.dobjBox .make',function(){
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
	.on('click', '.dobjBox .make2',function(){
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

			console.info(classifyList, groupNum)
		q = combineWrap(window.classifyList,groupNum);
		q = groupWrap(q);

		q =	xxUniq(q, gruopSize);

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
	.on('click', '.dobj2Box .invert',function(){
		var th = $(this);
		var dobjBox = th.closest('.dobj2Box');
		
		dobjBox.find('.dobj2 li em').each(function(){
			var $th = $(this).click();
		});		
		
	})
	//
	.on('click', '#filterByRefArr .add',function(){
		var str, arr;
		str = $('#filterByRefArr input:text').val().trim();
		str = str.replace(/\(/,'').replace(/\)/,' ');
		arr = str.split(/\s+/);
		filterByRefArr.push(arr);
		cc(filterByRefArr, 'filterByRefArr')
	})		
	//
	.on('click', '#redsBox .combine',function(){
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
	.on('click', '.key i',function(){
		var $th = $(this);
		var checkbox = $th.next('input:checkbox');
		$th.toggleClass('selected');
		checkbox.trigger('click');
	})
	//
	.on('click', '.key .add',function(){
		var th = $(this);
		var prev = th.prev('span').clone(true).insertBefore(th);
		return false;
	})
	//
	.on('click', '.key .lessen',function(){
		var th = $(this);
		var nextAll = th.nextAll('span');
		if(nextAll.length > 1){
			nextAll.eq(nextAll.length-1).remove();
		}
		return false;
	})		
	//
	.on('click', '.dobj em',function(){
		var $th = $(this);
		var checkbox = $th.next('input:checkbox');
		$th.toggleClass('cancel');
		checkbox.trigger('click');
			if(checkbox.is(':checked')){
				//checkbox.prop('checked', 'checked');
				checkbox[0].setAttribute('checked', 'checked');
			}else{
				checkbox.removeAttr('checked');
			}
		checkbox.trigger('change');
	})	
	//
	.on('change', '.dobj input:checkbox',function(){
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
	.on('click', '#groupList li .make',function(){
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
	.on('click', 'li .visual',function(){
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
	.on('mouseover', '#groupList li', function() {
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
	.on('mouseout', '#groupList li', function() {
		$('#refList li.ls:last').remove();
	})
	//
	.on('click', '#groupListBox .showRef',function() {
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
	.on('click', '#numSelListBox .showRef',function() {
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
	.on('mouseover', '#numSelList li', function() {
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
	.on('mouseout', '#numSelList li', function() {
		$('#numSelRefList li.ls:last').remove();
	})
	//显示筛选框
	.on('click', '.sortBtn', function() {
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
	.on('click', '#sortBox button', function() {
		var th = $(this);
		var box = th.closest('.layer');
		var sortBox = th.closest('#sortBox');
		var filterPattern = sortBox.find('input[name="filterPattern"]').prop('checked');
		var reg = sortBox.find('input[name="reg"]:checked').val();
		var name = th.attr('data-name');
		var val = th.prev('input').val();
		var attr;
		var filter;

			if(reg == '//'){
				attr = new RegExp(val);

				filter = function(){

					var str = $(this).attr('data-'+name);
					str = str.replace(/^\[/i,'').replace(/\]$/i,'');
					console.log(attr, str);
					return attr.test(str);

				};
			}else{
				attr = '[data-' + name + reg + '="'+ val +'"]';
				filter = 'li' + attr;
			}
		
		var limit = box.find('li');
		
		if(filterPattern){
			limit = box.find('li.selected');
			limit.find('input[name="itemIsSelected"]:checkbox').prop('checked',false).trigger('change');
		}


		var list = limit.filter(filter);
		var size = list.length;
		
		box.find('.sortInfo b').text(size);
		
		list.prependTo( list.parent() ).find('input[name="itemIsSelected"]:checkbox').prop('checked',true).trigger('change');
		

		$('body').scrollTop(0);
		
		sortBox.remove();
		
		return false;
	})
	//单列细节隐藏或显示
	.on('click', '.tabBar strong[data-tab]', function() {
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
	.on('click', 'li[optional=1]', function() {
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
	.on('click', '.copy',function() {
		var box = $(this).closest('.layer');
		var copyBox = box.find('.copyBox').empty().toggle();
		var red = $('#numSelList .redBall').clone().appendTo(copyBox);
		
		$('body').scrollTop(0);

		//var textarea = $('<textarea></textarea>');
		//textarea.text(copyBox[0].innerText).appendTo(copyBox);
		//red.remove();
	})	
	//删除所选
	.on('click', '.del', function() {

			if(confirm('确定彻底删除？')){

				var box = $(this).closest('.layer');
				box.find('li[optional=1] input[name="itemIsSelected"]:checked').each(function() {
					$(this).closest('li').remove();
				});
				box.find('.info b').text(box.find('li[optional=1]').length);
			}

	})
	//移动到回收站
		.on('click', '[role=trash]', function(e){
			var box = $(this).closest('.layer');
			var delBox = $('#delBox')//.empty();
			box.find('li[optional=1] input[name="itemIsSelected"]:checked').each(function() {
				$(this).closest('li').appendTo(delBox);
			});
			box.find('.info b').text(box.find('li[optional=1]').length);
		})
	//撤销删除
	.on('click', '.cancel',function() {
		var box = $(this).closest('.layer');
		var optionalList = box.find('.optionalList');
		$('#delBox li').prependTo(optionalList);
	})	
	//反选
	.on('click', '.reset',function() {
		var box = $(this).closest('.layer');
		
		box.find('li input[name="itemIsSelected"]:checkbox').each(function() {
			var input = $(this);
			if (input.prop('checked')) {
				input.prop('checked', false).trigger('change');
			} else {
				input.prop('checked', true).trigger('change');
			}
		});
	})
	//全不选
	.on('click', '.not',function() {
		var box = $(this).closest('.layer');
		box.find('li[optional=1] input[name="itemIsSelected"]:checked').each(function() {
			var input = $(this);
			input.prop('checked', false).trigger('change');;
		});
	})	
	/////////////////////////////////////////////////////////////////////
	//选中样式
	.on('change', 'li[optional=1] input[name="itemIsSelected"]:checkbox', function() {
		var th = $(this);
		var li = th.closest('li');
		
		if (th.prop('checked')) {
			li.addClass('selected');
		} else {
			li.removeClass('selected');
		}
	})
	//切换细节
	.on('click', '.toggle',function() {
		var box = $(this).closest('.layer');
		box.find('.details').toggle();
	})	
	//层展开或收缩
	.on('click','.expandable',function() {
		var th = $(this);
		var box = th.closest('.layer');
		var operateBar = box.find('.operateBar,.tabBar');
		var refList = box.find('#refList,#numSelRefList');
		
		if(!th.attr('expandable')){
			th.css({'position':'fixed','left':0, 'top':0}).text('展开');
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
	.on('click', '#tScroll',function() {
		$('body').scrollTop(0);
	})
	.on('click', '#bScroll',function() {
		var h = $('#numSelList').height() - $(window).height();
		$('body').scrollTop(h);
	})
	.on('click', '#lScroll',function() {
		$('body').scrollLeft(0);
	})
	.on('click', '#rScroll',function() {
		$('body').scrollLeft(1287);
	})		
	//删除模块
	.on('click', '.remove',function() {
		 $(this).parent().remove();
	})	
	//关闭box
	.on('click', '.close',function() {
		var box = $(this).closest('.layer');
		if(confirm('确定关闭窗口?!')){
			box.remove();
		}
	});


////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
//all comb
	$('body')
		.on('click', '[role=countMoney]', function(e){

			var input = prompt(' 开奖结果是: ' + getCurrentLottey() +  ';reset,\r\n example: 4 9 10 24 27 33:9');

			if(input){
				var arr = input.split(':');
				var blue = arr[1];
				var red = arr[0].split(/\s+/img);
				var dob = {red:red, blue: blue};
				localStorage.setItem('currentLottey', JSON.stringify(dob));
			}else{
				dob = getCurrentLottey();
			}


			var result = countMoney(window.currentCombList, dob);

			result.list.sort(function(a, b){
				return a.money - b.money;
			});

			$(this).find('sup').text(result.money);

			console.log(JSON.stringify(result.list).replace(/},\{/img, '},\r\n{'));

			console.log('all money is ' + result.money + '; list length is ' + result.list.length);


		})
		.on('click', '[role=allComb]', function (e) {

			var box = $(this).closest('.layer');

			if( box.find('.copyBox').is(":visible") ){
				return box.find('.copyBox').hide();
			}

			var groupList = [];

			var patch = getAllCombPatch() || window.allCombPatch || [];

			var $list = box.find('#groupList li');

			var $selectList = $list.filter('.selected');

			$list = $selectList.length ? $selectList : $list;

			alert('gruop list is' + $list.length);

			$list.each(function(i){

				var group = $(this).attr('data-group');
				group = JSON.parse(group);
				var len = group.length;

				if(patch.length && len < getLimitLengthByData()){

					_.forEach(patch, function(v, i, list){
						var _group = group.slice();

						_group = _group.concat(v);

						_group.sort(function(a, b){ return a - b;});

						if(_.uniq(_group).length == len){
							groupList.push(_group);
						}

					});

				}else{
					groupList.push(group);
				}

			});

			console.info('before filter length is', groupList.length);
			groupList = _.uniq(groupList,function(a){return JSON.stringify(a)});
			console.info('after uniq length is', groupList.length);
			groupList = filterForGroupByDown(groupList);
			console.info('after filter length is', groupList.length);

			console.log(JSON.stringify(groupList).replace(/],\[/img, '],\r\n['));

			var numList = [];

			_.forEach(groupList, function(v, i, list){
				var q;
				try{
					q = combineWrap(window.classifyByDownMargin,v);
				}catch (e){
					console.log(1,e)
				}

				q = filterByRef(q, window.filterByRefArr);
				q = redBlueBallModel(q);
				numList = numList.concat(q||[]);
			});


			window.currentCombList = numList.map(function(item){
				var red = item.redBall.slice();
				var blue = red.pop();
				blue = blue.replace(/^\:/img, '');
				return {red:red,blue:blue};
			});

			console.log(numList);
			console.log('all comb length is %s', numList.length);
			$(this).find('sup').text(numList.length);
			$('title').text('方案-' + numList.length);


			var str = '';

			for(var i = 0; i < numList.length; i++){
				str += (numList[i].redBall + '').replace(/,/g,'  ') + '<br>';
			}

			var copyBox = box.find('.copyBox').empty().toggle().html(str);

			$('body').scrollTop(0);


		});

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
//init

	$('body').on('click', '[role=store]', function (e) {

		if(!confirm('确认缓存？')) return;

		var box = $(this).parent();

		var name = box.attr('name');

		localStorage.setItem(name + '_0', JSON.stringify(window[name]));

		var html = box.find('ul').html();

		localStorage.setItem(name + '_1', html);

		//html = box.find('[role=setBox]').html();
		//localStorage.setItem(name+'_2',html);

	})
		.on('click', '[role=apply]', function (e) {

			if(!confirm('确认应用？')) return;

			var box = $(this).parent();

			var name = box.attr('name');

			window[name] = JSON.parse(localStorage.getItem(name + '_0'));

			var html = localStorage.getItem(name + '_1');

			box.find('ul').html(html);
			box.find('.dobj input:checkbox:first').trigger('change');


			//html = localStorage.getItem(name+'_2');
			//html && box.find('[role=setBox]').html(html);

		})
		.on('click', '[role=reset]', function (e) {

			return;

			var box = $(this).parent();

			var html = box.find('ul').html();

			var id = box.attr('id');

			localStorage.setItem(id, html);

		})
		.on('click', '[role=combPatch]', function(e){

			var str = prompt('allCombPatch is ' + getAllCombPatch() + '; reset. \r\n example:0 1,0 0 or 0,1,3');

			if(!str) return alert('not set.');

			str = str.trim();

			var arr = str.split(/\s+/img);

			arr.forEach(function(v, i, list){
				var a =  v.split('');
				for(var j in a) a[j] = a[j] * 1;
				list[i] = a;
			});

			window.allCombPatch = arr;

			str = JSON.stringify(arr);

			console.log('allCombPatch is =>', str);

			var data = getUrlParam('data') || 33;

			localStorage[ 'allCombPatch' + data ] = str;


		});


	
});



/////////////////////////////////////////////////////////
//global









