const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ["donor", "needy", "admin"],
			required: true,
		},
		phone: {
			type: String,
			required: true,
		},
		location: {
			type: { type: String, enum: ["Point"], default: "Point" },
			coordinates: {
				type: [Number], //[longitude, latitude]
				required: true,
			},
		},
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
