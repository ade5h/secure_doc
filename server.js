const express = require("express");
const document = require("./models/document");
require("dotenv").config();

const app = express();
// Connect DB
async function makeDBConnection() {
	const connectDB = require("./config/db");
	await connectDB();
}
makeDBConnection();

const server = require("http").createServer(app);
const io = require("socket.io")(server);

const path = require("path");
app.use(express.static(path.join(__dirname, "static")));

// Routes

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/static/home.html");
});

app.get("/error", (req, res) => {
	res.sendFile(__dirname + "/static/error.html");
});

app.get("/:id", (req, res) => {
	res.sendFile(__dirname + "/static/document.html");
});

io.on("connection", (socket) => {
	socket.on("get-document", async (id) => {
		const doc = await findOrCreateDocument(id);
		socket.join(id);
		socket.emit("load-document", doc.data);

		socket.on("send-changes", (delta) => {
			socket.broadcast.to(id).emit("receive-changes", delta);
		});

		socket.on("save-document", async (data) => {
			await document.findByIdAndUpdate(id, { data });
		});
	});

	console.log("Connected");
});

const PORT = process.env.PORT || 4200;

server.listen(PORT);

// DB Controller
const defaultValue = "";

async function findOrCreateDocument(id) {
	if (id == null) {
		console.log("Id is null");
		return;
	}

	const doc = await document.findById(id);

	if (doc) return doc;

	return await document.create({ _id: id, data: defaultValue });
}
