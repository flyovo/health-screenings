
const express = require("express");
const app = express();

app.get("/sse", (req, res, next) => {
	return res.json({ status: 200, data: "SUCCESS" });
});

module.exports = {
	path: "/api",
	handler: app
};    
