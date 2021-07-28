const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
	_id: String,
	data: String,
});

module.exports = mongoose.model("Document", documentSchema);
