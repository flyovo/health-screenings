const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env];
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