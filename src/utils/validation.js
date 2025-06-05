const validator = require("validator");

const allowedRoles = ["admin", "needy", "donor"];

function isValidPhone(phone) {
	const sanitized = phone.replace(/\s+/g, "");
	const phoneRegex = /^(\+91|0)?[6-9]\d{9}$/;
	return phoneRegex.test(sanitized);
}

const validateSignUpData = (req) => {
	let { name, role, phone, emailId, location, password, address } = req.body;

	if (!role) throw new Error("User role is required.");

	if (!allowedRoles.includes(role)) {
		throw new Error("Role is not valid");
	}

	if (!name) throw new Error("Name is required");
	if (!address) throw new Error("Address is required");

	if (role === "needy") {
		if (!phone) throw new Error("Phone number is required for needy users.");
		if (!isValidPhone(phone)) throw new Error("Invalid phone number format.");
	}

	if (role === "donor") {
		if (!emailId || !password) {
			throw new Error("Email and password are required for donors.");
		}
		if (!validator.isEmail(emailId)) {
			throw new Error("Invalid email address");
		}
	}

	if (!location?.coordinates || !Array.isArray(location.coordinates)) {
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

module.exports = { validateSignUpData, isValidPhone };
