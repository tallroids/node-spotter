$(".button-collapse").sideNav();
$('.parallax').parallax();

function scroll() {
  window.scrollTo(0, 200);
}

function login() {
	var username = $("#username").val();
	var password = $("#password").val();

	var params = {
		username: username,
		password: password
	};

	$.post("/login", params, function(result) {
		if (result.success) {
          localStorage.setItem('userId', result.id)
          window.location = '/home'
        } else {
          $("#message").text("Error logging in.");
		}
	});
}
