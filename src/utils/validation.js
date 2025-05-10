const validator = require("validator");

const validateSignUpData = (req) => {
	const { name, role, phone, emailId, location, password, address } = req.body;

	if (!name) {
		throw new Error("Name is required");
	} else if (!phone) {
		throw new Error("Phone is required");
	} else if (!password) {
		throw new Error("Password is required");
	} else if (!address) {
		throw new Error("Address is required");
	} else if (emailId && !validator.isEmail(emailId)) {
		throw new Error("Invalid email address");
	}
	const allowedRoles = ["admin", "needy", "donor"];

	const isRoleValid = allowedRoles.includes(role);

	if (!isRoleValid) {
		throw new Error("Role is not valid");
	}

	if (
		!location ||
		!location.coordinates ||
		!Array.isArray(location.coordinates)
	) {
		throw new Error("Location with coordinates is required");
	}

	if (
		location.coordinates.length !== 2 ||
		typeof location.coordinates[0] !== "number" ||
		typeof location.coordinates[1] !== "number"
	) {
		throw new Error("Coordinates must be [longitude, latitude] as numbers");
	}
};

module.exports = { validateSignUpData };
