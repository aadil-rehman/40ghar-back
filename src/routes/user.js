const express = require("express");
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userAuth = require("../middlewares/auth");

const userRouter = express.Router();

userRouter.post("/donor-signup", async (req, res) => {
	try {
		validateSignUpData(req);
		const { name, role, phone, emailId, location, password, address } =
			req.body;

		if (role !== "donor") {
			throw new Error("User is not allowed to signup via Email");
		}

		//Encrypt password
		const passwordHash = await bcrypt.hash(password, 10);

		const userData = {
			name,
			role,
			...(phone ? { phone } : {}),
			location,
			address,
			password: passwordHash,
			emailId,
		};

		const user = new User(userData);
		await user.save();

		res.json({
			status: 1,
			message: "User registered successfully",
			data: user,
		});
	} catch (err) {
		res.status(400).json({ status: 0, message: err.message });
	}
});

userRouter.post("/donor-login", async (req, res) => {
	try {
		const { emailId, password, role } = req.body;

		if (role !== "donor") {
			throw new Error("User is not allowed to login via Email");
		}

		const user = await User.findOne({ emailId: emailId, role });

		if (!user) {
			throw new Error("User not found");
		}

		const validatePassword = await bcrypt.compare(password, user.password);

		if (validatePassword) {
			//create jwt token
			const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
				expiresIn: "7d",
			});

			//add token to cookie
			res.cookie("token", token, {
				expires: new Date(Date.now() + 8 * 3600000),
			});
			res.json({ status: 1, message: "Login successfull!", data: user });
		} else {
			throw new Error("Invalid Credentials");
		}
	} catch (err) {
		res.status(400).json({ status: 0, message: err.message });
	}
});

userRouter.get("/profile", userAuth, async (req, res) => {
	try {
		const loggedInUser = req.user;

		res.json({
			status: 1,
			message: "User fetched Successfullly",
			data: loggedInUser,
		});
	} catch (err) {
		res.status(400).json({ status: 0, message: err.message });
	}
});

module.exports = userRouter;
