var login=new Vue({
  el: '#main',
  data: {
    username: '',
    password:''
  },
  mounted:function()
  {
      var _this = this;
  },
  methods: {
	  login:function()
	  {
		  var _this = this;
		  var username = this.username;
		  var password= this.password;
		  // alert(username+password);
		  // return
		  if(username==null||password==null)
		  {
			  alert("The username and password  cannot be empty");
			  return
		  }

		 
		  var param={'username':username,'password':password}
		  $.ajax({
				type : "post",
				url : "/login", 
				data:param,
				success : function(data) {//The requested method to return success
					if(data!='error')
					{
						sessionStorage.setItem('userid', data)
						sessionStorage.setItem('username', username);;
						location.href='/main'
					}else
					{
						alert("The username or password error")
					}
				}
			});
	  }
  }
});



