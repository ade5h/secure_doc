require("dotenv").config();

const mongoose = require("mongoose");

async function connectDB() {
	// Database connection
	try {
		await mongoose.connect(process.env.MONGO_CONNECTION_URL, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useUnifiedTopology: true,
			useFindAndModify: true,
		});

		await mongoose.connection.once("open", () => {
			console.log("Database connected.");
		});
	} catch (err) {
		console.error(err);
	}
}

module.exports = connectDB;
