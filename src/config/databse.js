const mongoose = require("mongoose");

const mongoDBConnect = async () => {
	await mongoose.connect(process.env.MONGO_URI);
};

module.exports = mongoDBConnect;
