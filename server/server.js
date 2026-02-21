const path = require('path');
require("dotenv").config({ path: path.join(__dirname, '.env') });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Start server and (optionally) MongoDB connection. If MONGO_URI is not set
// and we're in a non-production environment, start an in-memory MongoDB
// instance using mongodb-memory-server so dev flows (seed/login) work
// without requiring external credentials.
async function startServer() {
	let mongoUri = process.env.MONGO_URI;

	if (!mongoUri && process.env.NODE_ENV !== 'production') {
		try {
			console.log('No MONGO_URI found — starting in-memory MongoDB for dev');
			const { MongoMemoryServer } = require('mongodb-memory-server');
			const mongod = await MongoMemoryServer.create();
			mongoUri = mongod.getUri();
			// keep reference so we can stop it on shutdown
			app.locals._mongod = mongod;
		} catch (err) {
			console.error('Failed to start in-memory MongoDB:', err);
		}
	}

	if (mongoUri) {
		mongoose.connect(mongoUri)
			.then(() => console.log('MongoDB Connected'))
			.catch(err => console.error('MongoDB connection error:', err));
	} else {
		console.warn('Warning: MONGO_URI is not defined. Skipping MongoDB connection.');
	}

	app.use("/api/auth", require("../routes/auth"));
	app.use("/api/drive", require("../routes/drive"));
	app.use("/api/student", require("../routes/student"));
	app.use("/api/chatbot", require("../routes/chatbot"));
	// Dev utilities
	app.use("/api/dev", require("../routes/dev"));

	// Simple health-check route
	app.get("/health", (req, res) => {
		res.json({ status: "ok", mongodb: !!(mongoose.connection && mongoose.connection.readyState === 1) });
	});

	// Root route
	app.get("/", (req, res) => {
		res.send("PlacementPro Backend Running 🚀");
	});

	const server = app.listen(5000, () => console.log("Server running on port 5000"));

	// Graceful shutdown: stop in-memory mongod if present
	process.on('SIGINT', async () => {
		console.log('Shutting down...');
		server.close();
		if (app.locals._mongod) {
			await app.locals._mongod.stop();
		}
		process.exit(0);
	});
}

startServer();