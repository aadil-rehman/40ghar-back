const express = require("express");
const { sendOtp, verifyOtp } = require("../utils/otpService");
const User = require("../models/user");
const { validateSignUpData, isValidPhone } = require("../utils/validation");
const jwt = require("jsonwebtoken");

const otpRouter = express.Router();

otpRouter.post("/send-otp", async (req, res) => {
	const { phone, role, loginSendOtp } = req.body;

	try {
		if (role !== "needy") {
			throw new Error("User not allowed to login via Otp");
		}

		if (!isValidPhone(phone)) {
			throw new Error("Invalid phone number format");
		}

		const user = await User.findOne({ phone, role });

		if (loginSendOtp) {
			if (!user) {
				throw new Error("User not found. Please sign up.");
			}
		} else {
			if (user) {
				throw new Error("User already exists. Please login");
			}
		}

		await sendOtp(phone);

		res.status(200).json({ status: 1, message: "OTP send successfully" });
	} catch (err) {
		res.status(400).json({ status: 0, message: err.message });
	}
});

otpRouter.post("/verify-otp-signup", async (req, res) => {
	try {
		validateSignUpData(req);
		const { name, role, phone, address, location, otp } = req.body;

		if (role !== "needy") {
			throw new Error("User not allowed to login via Otp");
		}

		const valid = await verifyOtp(phone, otp);

		if (!valid) {
			return res
				.status(400)
				.json({ status: 0, success: false, message: "Invalid OTP" });
		}

		const user = new User({ name, role, phone, address, location });

		await user.save();

		// Generate JWT
		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "7d",
		});

		// Set cookie
		res.cookie("token", token, {
			httpOnly: true,
			expires: new Date(Date.now() + 8 * 3600000), // 8 hours
		});

		res.status(200).json({
			status: 1,
			success: true,
			message: "OTP verified & User registered successfully",
			data: user,
		});
	} catch (err) {
		res.status(400).json({ status: 0, message: err.message });
	}
});

otpRouter.post("/verify-otp-login", async (req, res) => {
	const { phone, otp } = req.body;

	try {
		const valid = await verifyOtp(phone, otp);

		if (!valid) {
			return res.status(400).json({ success: false, message: "Invalid OTP" });
		}

		// Check if user exists
		const user = await User.findOne({ phone });

		if (!user) {
			throw new Error("User not found");
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
