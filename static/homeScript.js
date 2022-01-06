$(document).ready(() => {
	$("#submitBtn").click(() => {
		var path = $("#path").val();

		var url = "http://localhost:8080/" + path;

		window.location.replace(url);
	});
});
