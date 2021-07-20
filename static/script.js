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

const socket = io("http://localhost:4200");

const path = window.location.pathname.substring(1);
console.log(path);

socket.emit("get-document", path);

socket.on("load-document", (doc) => {
	quill.setContents(doc);
	quill.enable();
});

var quill = new Quill("#editor-container", {
	theme: "snow",
	modules: { toolbar: TOOLBAR_OPTIONS },
});

quill.disable();
quill.setText("Loading...");

quill.on("text-change", function (delta, oldDelta, source) {
	if (source !== "user") return;
	socket.emit("send-changes", delta);
});

socket.on("receive-changes", function (delta) {
	quill.updateContents(delta);
});

setInterval(() => {
	socket.emit("save-document", quill.getContents());
}, SAVE_INTERVAL_MS);
