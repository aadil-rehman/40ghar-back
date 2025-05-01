const express = require("express");
const mongoDBConnect = require("./config/databse");
require("dotenv").config();

const app = express();
app.use(express.json());
const PORT = 3000;

const userRouter = require("./routes/user");
const requestRouter = require("./routes/request");

app.use("/", userRouter);
app.use("/request", requestRouter);

mongoDBConnect()
	.then(() => {
		console.log("Database connection established");
		app.listen(PORT, () => {
			console.log(`Server listening on ${PORT}...`);
		});
	})
	.catch(() => console.log("Database cannot be connected"));
