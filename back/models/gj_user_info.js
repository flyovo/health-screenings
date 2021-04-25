module.exports = (sequelize, DataTypes) => {
	const UserInfo = sequelize.define("gj_user_info", {
		idx: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true
		},
		ADMIN: {
			type: DataTypes.INTEGER(11)
		},
		USER_ID: {
			type: DataTypes.STRING(32),
			allowNull: false,
			unique: true,
			primaryKey: true
		},
		USER_NM: {
			type: DataTypes.STRING(32),
			allowNull: false
		},
		USER_PWD: {
			type: DataTypes.STRING(256),
			allowNull: false
		},
		LOGIN_DATE: {
			type: DataTypes.DATE
		},
		LOGOUT_DATE: {
			type: DataTypes.DATE
		},
		LOGIN_ROOM_NO: {
			type: DataTypes.STRING(32),
			allowNull: false
		},
		LOGIN_ROOM_CNT: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		UPDATETIME: {
			type: DataTypes.DATE,
			allowNull: false
		}
	}, {
		freezeTableName: true,
		timestamps: false,
		charset: "utf8",
		collate: "utf8_general_ci"
	});
  
	//User.associate = (db) => {
	//  db.UserInfo.hasMany(db.Post);
	//  db.UserInfo.hasMany(db.Comment);
	//};
  
	return UserInfo;
};