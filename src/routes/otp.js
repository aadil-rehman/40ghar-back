const express = require("express");
const { sendOtp, verifyOtp } = require("../utils/otpService");
const User = require("../models/user");

const otpRouter = express.Router();

otpRouter.post("/send-otp", async (req, res) => {
	const { phone } = req.body;

	try {
		await sendOtp(phone);

		res.status(200).json({ status: 1, message: "OTP send successfully" });
	} catch (err) {
		res.status(400).json({ status: 0, message: err.message });
	}
});

otpRouter.post("/verify-otp", async (req, res) => {
	const { phone, otp } = req.body;

	try {
		const valid = verifyOtp(phone, otp);

		if (!valid) {
			return res.status(400).json({ success: false, message: "Invalid OTP" });
		}

		// Check if user already exists
		let user = await User.findOne({ phone });

		// If user doesn't exist, create a basic user (or ask for more info on frontend)
		if (!user) {
			user = new User({
				phone,
				role: "needy", // default or from req.body
				name: "Anonymous", // or ask later
			});
			await user.save();
		}

		// Generate JWT
		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "7d",
		});

		// Set cookie
		res.cookie("token", token, {
			httpOnly: true,
			expires: new Date(Date.now() + 8 * 3600000), // 8 hours
		});

		res
			.status(200)
			.json({ status: 1, success: true, message: "OTP verified", data: user });
	} catch (err) {
		res.status(400).json({ status: 0, message: err.message });
	}
});

module.exports = otpRouter;
