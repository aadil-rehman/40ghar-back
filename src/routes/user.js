const express = require("express");
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userAuth = require("../middlewares/auth");

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
	try {
		validateSignUpData(req);
		const { name, role, phone, emailId, location, password } = req.body;

		//Encrypt password
		const passwordHash = await bcrypt.hash(password, 10);

		const user = new User({
			name,
			role,
			password: passwordHash,
			phone,
			location,
			...(emailId ? { emailId } : {}),
		});
		await user.save();

		res.json(user);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

userRouter.post("/login", async (req, res) => {
	try {
		const { emailId, password } = req.body;

		const user = await User.findOne({ emailId: emailId });

		if (!user) {
			throw new Error("Invalid Credentials");
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
			throw new Error("Invalid credentials");
		}
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

userRouter.get("/profile", userAuth, async (req, res) => {
	try {
		const loggedInUser = req.user;

		res.json({ message: "User fetched Successfullly", data: loggedInUser });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

module.exports = userRouter;
