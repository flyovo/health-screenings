const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const cookie = require("cookie-parser");
const morgan = require("morgan");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const db = require("./models");
const passportConfig = require("./passport");
const userRouter = require("./routes/user");
const roomRouter = require("./routes/room");
const patRouter = require("./routes/patient");
const app = express();

db.sequelize.sync();
passportConfig();

if (process.env.NODE_ENV == "production") {
	app.use(morgan("combined"));
} else {
	app.use(morgan("dev"));
}

// 프론트의 환경 설정
app.use(cors({ //다른 서버간 쿠키 각각 저장하기 위함
	origin: `http://${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}`,
	credentials: true
}));

app.use("/", express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookie("cookie-secret"));
app.use(session({
	name: "4_session",
	resave: false,
	saveUninitialized: false,
	secret: "cookie-secret",
	cookie: {
		httpOnly: true,
		secure: false
	}
}));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
	res.status(200).send("hi back");
});

app.use("/user", userRouter);
app.use("/room", roomRouter);
app.use("/patient", patRouter);

// socket.io --------------------------------------------------------------
let http = require("http");
let server = http.createServer(app);
server.listen((process.env.PORT || 3085), function () {
	console.log(`Server is listening on port ${process.env.PORT}`);
});

let socketIo = require("socket.io")(server, {
	cors: {
		origin: "*"
	},
	path: "/socket.io",
	serveClient: `http://${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}`,
	// below are engine.IO options
	cookie: false
});

app.set("socketIo", socketIo);

socketIo.on("connection", socket => {
	console.log("------- new client(frontend) connected!! ");
});