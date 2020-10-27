var login=new Vue({
  el: '#main',
  data: {
    username: '',
    password:'',
	phone:'',
  },
  mounted:function()
  {
      var _this = this;
  },
  methods: {
	  updateInfo:function()
	  {
		  var _this = this;
		  var username = this.username;
		  var password= this.password;
		  var phone= this.phone;
		  // alert(username+password);
		  // return
		  if(username==''||password==''||phone=='')
		  {
			  alert("All information cannot be empty")
			  return;
			  return
		  }
		var param={'username':username,'phone':phone,'password':password}
		 $.ajax({
		 	type: "post",
		 	url: "/findByUserBynamePhone",
		 	data: param,
		 	success: function(data) { //The requested method to return success
		 		if (data == 'success') {
		 			$.ajax({
		 				type: "put",
		 				url: "/updateUser",
		 				data: param,
		 				success: function(data) { //The requested method to return success
		 					if (data == 'success') {
								alert("Update success,please login");
								location.href = '/login'
		 					} else {
		 						alert(" error");
		 					}
		 				}
		 			});
		 		}else
		 		{
		 			alert("The username or phone error")
		 		}
		 	}
		 });
		 
	  }
  }
});



