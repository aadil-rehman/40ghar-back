const express = require("express");
const User = require("../models/user");

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
	const { name, role, phone } = req.body;

	try {
		const user = new User({ name, role, phone });
		await user.save();

		res.json(user);
	} catch (err) {
		res.status(400).json({ error: err });
	}
});

module.exports = userRouter;
