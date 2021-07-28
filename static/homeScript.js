$(document).ready(() => {
	$("#submitBtn").click(() => {
		var path = $("#path").val();

		var url = "http://localhost:4200/" + path;

		window.location.replace(url);
	});
});
