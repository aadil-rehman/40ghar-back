const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
	try {
		const { token } = req.cookies;

		if (!token) {
			return res.status(401).json({ error: "Please login" });
		}

		//validate token
		const decodedObj = jwt.verify(token, process.env.JWT_SECRET);

		const { _id } = decodedObj;

		//find user

		const user = await User.findById(_id);

		if (!user) {
			throw new Error("User not found!");
		}

		req.user = user;

		next();
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

module.exports = userAuth;
