const express = require("express");
const Request = require("../models/request");
const userAuth = require("../middlewares/auth");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post("/new", userAuth, async (req, res) => {
	try {
		const { needType, familySize, description, location, widow } = req.body;

		const loggedinUser = req.user;

		const loggedinUserRole = loggedinUser.role;

		if (loggedinUserRole !== "needy") {
			throw new Error("Only needy can raise request");
		}

		const request = new Request({
			needType,
			userId,
			familySize,
			description,
			widow,
			location,
		});
		await request.save();
		res.json({
			status: 1,
			message: "Request raised successfully",
			data: request,
		});
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

requestRouter.patch(
	"/action/:status/:requestId",
	userAuth,
	async (req, res) => {
		try {
			const { status, requestId } = req.params;

			const loggedinUser = req.user;
			const loggedinUserRole = loggedinUser.role;

			if (loggedinUserRole !== "donor") {
				throw new Error("Only donor can update status");
			}

			const request = await Request.findById(requestId);

			if (!request) {
				throw new Error("Request not found!");
			}

			request.status = status;

			await request.save();

			res.json({
				status: 1,
				message: "Request status updated successfully",
				data: request,
			});
		} catch (err) {
			res.status(400).json({ error: err.message });
		}
	}
);

requestRouter.get("/all", userAuth, async (req, res) => {
	try {
		const lat = req.query.lat;
		const lng = req.query.lng;

		if (!lat || !lng) {
			return res.status(400).json({ error: "Missing lat or lng parameters" });
		}

		const donorCoords = [Number(lng), Number(lat)];

		const requests = await Request.find({
			location: {
				$near: {
					$geometry: {
						type: "Point",
						coordinates: donorCoords,
					},
					$maxDistance: 1000,
				},
			},
		});

		res.json({ message: "Requests fetched successfully", data: requests });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

module.exports = requestRouter;
