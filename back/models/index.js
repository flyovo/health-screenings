const Sequelize = require("sequelize");
const config = {
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	dialect: "mysql",
	timezone: "+09:00"
};

const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.UserInfo = require("./gj_user_info")(sequelize, Sequelize);
db.DetailPatList = require("./gj_detail_pat_list")(sequelize, Sequelize);
db.PatList = require("./gj_pat_list")(sequelize, Sequelize);
db.RoomSet = require("./gj_room_set")(sequelize, Sequelize);
db.RoomPatList = require("./gj_room_pat_list")(sequelize, Sequelize);

Object.keys(db).forEach(modelName => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;