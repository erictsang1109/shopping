var login = new Vue({
	el: '#main',
	data: {
		username: '',
		password: '',
		email: '',
		phone: '',
		age: ''
	},
	mounted: function() {
		var _this = this;
	},
	methods: {
		regist: function() {
			var _this = this;
			if(_this.username=='' || _this.password==''|| _this.email==''|| _this.age==''|| _this.phone=='')
			{
				alert("All information cannot be empty")
				return;
			}
			
			var param = {
				'username': _this.username,
				'password': _this.password,
				'email': _this.email,
				'age': _this.age,
				'phone': _this.phone
			}
			$.ajax({
				type: "post",
				url: "/findByUsername",
				data: param,
				success: function(data) { //The requested method to return success
					if (data == 'success') {
						$.ajax({
							type: "post",
							url: "/register",
							data: param,
							success: function(data) { //The requested method to return success
								if (data == 'success') {
									alert("Regist success,please login");
									location.href = '/login'
								} else {
									alert("Regist error");
								}
							}
						});
					}else
					{
						alert('The username is exist')
					}
				}
			});




		}
	}
});
