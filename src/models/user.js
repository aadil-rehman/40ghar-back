const mongoose = require("mongoose");
const validator = require("validator");

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
		password: {
			type: String,
			// required: true,
		},
		phone: {
			type: String,
			validate: {
				validator: function (value) {
					if (this.role === "needy" && !value) {
						return false;
					}
					return true;
				},
				message: "Phone number is required for needy users.",
			},
		},
		address: {
			type: String,
			required: true,
		},
		emailId: {
			type: String,
			unique: true,
			lowercase: true,
			trim: true,
			validate: {
				validator: function (value) {
					if (this.role === "donor" && !validator.isEmail(value)) {
						return false;
					}
					return true;
				},
				message: "Invalid Email address for donor.",
			},
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
