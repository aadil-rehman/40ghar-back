const twilio = require("twilio");
const Otp = require("../models/otp");

const client = twilio(
	process.env.TWILIO_ACCOUNT_SID,
	process.env.TWILIO_AUTH_TOKEN
);

const sendOtp = async (phone) => {
	try {
		const otp = Math.floor(100000 + Math.random() * 900000).toString();

		const expiry = new Date(Date.now() + 5 * 60 * 1000); //2 minutes

		await Otp.findOneAndUpdate(
			{ phone },
			{ otp, expiresAt: expiry },
			{ upsert: true, new: true, setDefaultsOnInsert: true }
		);

		await client.messages.create({
			body: `Your verification code is: ${otp}`,
			from: process.env.TWILIO_PHONE_NUMBER,
			to: phone,
		});
	} catch (err) {
		console.error(err);
	}
};

const verifyOtp = async (phone, otp) => {
	const record = await Otp.findOne({ phone });

	// if (!record || record.expiresAt < new Date()) return false;
	if (!record) return false;
	return record.otp === otp;
};

module.exports = { sendOtp, verifyOtp };
