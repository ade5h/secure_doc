$(".password").hide();

$(function () {
	const path = window.location.pathname.substring(1);

	let password = localStorage.getItem(path);

	if (!password) {
		$(".password").show();
		$("#pass_button").click(() => {
			password = $("#pass_text").val();

			if (password.length >= 16) {
				$(".password").remove();
				connectToServer(password);
			}
		});
	} else {
		$(".password").remove();
		connectToServer(password);
	}
});

function connectToServer(password) {
	const TOOLBAR_OPTIONS = [
		[{ header: [1, 2, 3, 4, 5, 6, false] }],
		[{ font: [] }],
		[{ list: "ordered" }, { list: "bullet" }],
		["bold", "italic", "underline"],
		[{ color: [] }, { background: [] }],
		[{ align: [] }],
		["blockquote", "code-block"],
		["clean"],
	];

	const SAVE_INTERVAL_MS = 2000;

	const socket = io("http://localhost:8080");

	const path = window.location.pathname.substring(1);

	socket.emit("get-document", path);

	socket.on("load-document", (doc) => {
		if (doc === "") {
			localStorage.setItem(path, password);
			// load on quill
			quill.setContents(doc);
			quill.enable();

			setInterval(() => {
				// encrypt
				let encryptedContent = encrypt(password, quill.getContents());

				socket.emit("save-document", encryptedContent);
			}, SAVE_INTERVAL_MS);
		} else {
			// decrypt
			let decryptedDoc = decrypt(password, doc);

			if (!decryptedDoc) {
				var url = "http://localhost:8080/error";
				$(location).attr("href", url);
				return;
			} else {
				// store the password on local storage
				localStorage.setItem(path, password);
				// load on quill
				quill.setContents(decryptedDoc);
				quill.enable();

				setInterval(() => {
					// encrypt
					let encryptedContent = encrypt(password, quill.getContents());

					socket.emit("save-document", encryptedContent);
				}, SAVE_INTERVAL_MS);
			}
		}
	});

	var quill = new Quill("#editor-container", {
		theme: "snow",
		modules: { toolbar: TOOLBAR_OPTIONS },
	});

	quill.disable();
	quill.setText("Loading...");

	quill.on("text-change", function (delta, oldDelta, source) {
		if (source !== "user") return;

		// encrypt
		let encryptedDelta = encrypt(password, delta);

		socket.emit("send-changes", encryptedDelta);
	});

	socket.on("receive-changes", function (delta) {
		// decrypt
		let decryptedDelta = decrypt(password, delta);

		quill.updateContents(decryptedDelta);
	});
}

function encrypt(key, data) {
	// Create an encryptor
	var encryptor = window.encryptor(key);
	var encrypted = encryptor.encrypt(data);
	return encrypted;
}

function decrypt(key, data) {
	// Create a decryptor
	var encryptor = window.encryptor(key);
	var decrypted = encryptor.decrypt(data);

	return decrypted;
}
