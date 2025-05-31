const validator = require("validator");

const validateSignUpData = (req) => {
	const { name, role, phone, emailId, location, password, address } = req.body;

	if (!role) {
		throw new Error("User role is required.");
	}

	const allowedRoles = ["admin", "needy", "donor"];

	const isRoleValid = allowedRoles.includes(role);

	if (!isRoleValid) {
		throw new Error("Role is not valid");
	}

	if (!name) {
		throw new Error("Name is required");
	}
	if (!address) {
		throw new Error("Address is required");
	}

	if (role === "needy" && !phone) {
		throw new Error("Phone number is required for needy users.");
	}

	if (role === "donor" && (!emailId || !password)) {
		throw new Error("Email and password are required for donors.");
	}
	if (role === "donor" && !validator.isEmail(emailId)) {
		throw new Error("Invalid email address");
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
