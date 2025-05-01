const express = require("express");
const Request = require("../models/request");

const requestRouter = express.Router();

requestRouter.post("/new", async (req, res) => {
	try {
		const { needType, userId, familySize, description, location, widow } =
			req.body;
		const request = new Request({
			needType,
			userId,
			familySize,
			description,
			widow,
			location,
		});
		await request.save();
		res.json({ data: request });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

module.exports = requestRouter;
