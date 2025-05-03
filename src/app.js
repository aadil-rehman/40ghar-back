const express = require("express");
const mongoDBConnect = require("./config/databse");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);
app.use(express.json());
app.use(cookieParser());

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
