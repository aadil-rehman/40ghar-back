const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
	{
		needType: {
			type: String,
			enum: ["ration", "medicine", "cloths", "others"],
			required: true,
		},
		needyUserId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		donorUserId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		familySize: {
			type: Number,
			required: true,
			min: [1, "Family size must be at least 1"],
			max: [20, "Family size must not exceed 20"],
		},
		description: {
			type: String,
			required: true,
		},
		widow: {
			// Prioritize widow requests first
			type: Boolean,
			default: false,
		},
		address: {
			type: String,
			required: true,
		},
		urgencyScore: Number,
		status: {
			type: String,
			enum: ["pending", "in_progress", "fulfilled", "flagged"],
			default: "pending",
		},
		location: {
			type: { type: String, enum: ["Point"], default: "Point" },
			coordinates: {
				type: [Number],
				required: true,
			},
		},
		fuzzyOffset: [Number], //[latOffset, lngOffset] if adding noise to hide actual location
	},
	{ timestamps: true }
);

requestSchema.index({ location: "2dsphere" });

const Request = mongoose.model("Request", requestSchema);

module.exports = Request;
