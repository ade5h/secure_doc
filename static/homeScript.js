$(document).ready(() => {
	$("#submitBtn").click(() => {
		var path = $("#path").val();

		var url = window.location.href + path;

		window.location.replace(url);
	});
});
