const mongoose = require("mongoose");

const mongoDBConnect = async () => {
	await mongoose.connect(process.env.MONGO_URI, {
		autoIndex: true, // create indexes from schema automatically
	});
};

module.exports = mongoDBConnect;
