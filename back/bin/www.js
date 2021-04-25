const app = require("../app");
const http = require("http");
const hostname = "0.0.0.0";
const port = 3085;

const server = http.createServer(app);
server.listen(port);
