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
			validate: [
				{
					validator: function (value) {
						// Require phone for needy users
						if (this.role === "needy" && !value) {
							return false;
						}
						return true;
					},
					message: "Phone number is required for needy users.",
				},
				{
					validator: function (value) {
						if (!value) return true; // skip if no value (only required for needy)

						// Regex example: 10 digits, may start with optional +91 or 0
						const phoneRegex = /^(\+91|0)?[6-9]\d{9}$/;
						return phoneRegex.test(value);
					},
					message: "Phone number format is invalid.",
				},
			],
		},
		address: {
			type: String,
			required: true,
		},
		emailId: {
			type: String,
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

// For donor email
userSchema.index(
	{ emailId: 1 },
	{
		unique: true,
		partialFilterExpression: { emailId: { $type: "string" } },
	}
);

// For needy phone
userSchema.index(
	{ phone: 1 },
	{
		unique: true,
		partialFilterExpression: {
			role: "needy",
			phone: { $type: "string" },
		},
	}
);
const User = mongoose.model("User", userSchema);
module.exports = User;
