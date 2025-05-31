// rebuildIndexes.js
const mongoose = require("mongoose");
const User = require("./src/models/user");
require("dotenv").config(); // load .env if you're using it

(async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		console.log("Connected to MongoDB");

		const result = await User.syncIndexes(); // <- this rebuilds the indexes from schema
		console.log("Indexes rebuilt:", result);

		await mongoose.disconnect();
		process.exit(0);
	} catch (err) {
		console.error("Error rebuilding indexes:", err);
		process.exit(1);
	}
})();
