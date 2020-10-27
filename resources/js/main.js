var login = new Vue({
	el: '#main',
	data: {
		newGoods: {
			name: '',
			desc: '',
			price: '',
			goodsid:''
		},
		menu:1,
		userid:'',
		username:'',
		goodsinfo:[],
		favinfo:[],
		term:''
	},
	mounted: function() {
		var _this = this;
		_this.init();
		_this.initGoods()
	},
	methods: {
		init:function()
		{
			var _this = this;
			var userid = sessionStorage.getItem('userid');
			_this.userid=userid;
			var username = sessionStorage.getItem('username');
			_this.username=username;
		},
		logout:function()
		{
			sessionStorage.removeItem('username');
			sessionStorage.removeItem('userid');
			window.location.href="/login"
		},
		initGoods:function()
		{
			var _this = this;
				var param = {'userid':_this.userid,"term":_this.term};
			if(_this.userid==null)
			{
				param.userid=-1;
			}
			$.ajax({
				type: "post",
				url: "/findGoods",
				data:param,
				success: function(data) { // The requested method to return success
					_this.goodsinfo = JSON.parse(data);
				}
			});
		},
		
		addNewGoods: function() {

			var _this = this;
			var newFile = $("#newImage").val();
			if(_this.newGoods.goodsid!='')
			{
				_this.updateGoodsForm();
				return;
			}
			
			
			if (_this.newGoods.name == "" || _this.newGoods.desc == "" || _this.newGoods.price == "" || newFile == "") {
				alert("All info can not be empety");
				return
			}
			var _this = this;
			var options = {
				//target: '#output',          //Put the content returned by the server into the element with id output
				//beforeSubmit: showRequest,  //Callback function before submission
				//url: url,                 //The default is the action of the form, if declared, it will be overwritten
				//clearForm: true,          //After successful submission, clear the values of all form elements
				//resetForm: true,          //After successful submission, clear the values of all form elements
				//timeout: 3000,            //Limit the request time, when the request is greater than 3 seconds, the request will be jumped out
				url: "/newGoods",
				type: 'post',
				success: function(res) {
					if (res == "success") {
						_this.newGoods = {
							name: '',
							desc: '',
							price: ''
						}
						alert("publish success");
					}
				}
			}
			$('#fileForm').ajaxSubmit(options);
		},
		deleteGoods:function(item){
			var goodsid=item.goodsid;
			var _this = this;
			$.ajax({
				url: "/deleteGoods",
				type:'delete',
				data: {'goodsid':goodsid},
				success: function(data) { //The requested method to return success
					if (data == 'success') {
						alert("success");
						_this.initGoods();
					} else {
						alert("error")
					}
				}
			});
		},
		deletFav:function(item){
			var uuid=item.uuid;
			var _this = this;
			$.ajax({
				url: "/deletFav",
				type:'delete',
				data: {'uuid':uuid},
				success: function(data) { //The requested method to return success
					if (data == 'success') {
						alert("success");
						_this.initFavicate();
					} else {
						alert("error")
					}
				}
			});
		},
		canceFav:function(item){
			var uuid=item.uuid;
			var _this = this;
			var param = {'userid':item.userid,'goodsid':item.goodsid};
			$.ajax({
				url: "/canceFav",
				type:'delete',
				data: param,
				success: function(data) { //The requested method to return success
					if (data == 'success') {
						alert("success");
						_this.initGoods();
					} else {
						alert("error")
					}
				}
			});
		},
		addFavicate:function(item){
			var _this = this;
			var goodsid=item.goodsid;
			var param={userid:_this.userid,goodsid:goodsid};
			$.ajax({
				url: "/addFavicate",
				type:'post',
				data: param,
				success: function(data) { //The requested method to return success
					if (data == 'success') {
						alert("success");
						_this.initGoods();
					} else {
						alert("error")
					}
				}
			});
		},
		initFavicate:function()
		{
			var _this = this;
			var param={userid:_this.userid};
			$.ajax({
				type: "post",
				data: param,
				url: "/findFavicate",
				success: function(data) { //The requested method to return success
					_this.favinfo = JSON.parse(data);
				}
			});
		},
		updateGoods:function(item)
		{
			var _this = this;
			_this.newGoods=item;
			_this.menu=2;
		},
		updateGoodsForm: function() {
		
			var newFile = $("#newImage").val();
			var _this = this;
			if (_this.newGoods.name == "" || _this.newGoods.desc == "" || _this.newGoods.price == "" || newFile == "") {
				alert("All information cannot be empty");
				return
			}
			var _this = this;
			var options = {
				//target: '#output',          //Put the content returned by the server into the element with id output
				//beforeSubmit: showRequest,  //Callback function before submission
				//url: url,                 //The default is the action of the form, if declared, it will be overwritten
				//clearForm: true,          //After successful submission, clear the values of all form elements
				//resetForm: true,          //After successful submission, reset the values of all form elements
				//timeout: 3000,            //Limit the request time, when the request is greater than 3 seconds, the request will be jumped out
				url: "/updateGoods",
				type: 'put',
				success: function(res) {
					if (res == "success") {
						alert('success');
						_this.menu=1;
						_this.initGoods();
					}
				}
			}
			$('#fileForm').ajaxSubmit(options);
		},
		
		menuChange:function(val)
		{
			var _this = this;
			_this.menu=val;
			if(val==1)
			{
				_this.initGoods()
			}else if(val==3)
			{
				_this.initFavicate()
			}else
			{
				_this.newGoods={
					name: '',
					desc: '',
					price: '',
					goodsid:''
				}
			}
			
		}
	}
});
