module.exports = (sequelize, DataTypes) => {
	const RoomSet = sequelize.define("gj_room_set", {
		idx: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true
		},
		ROOM_NO: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		ROOM_NM: {
			type: DataTypes.STRING(64),
			allowNull: true
		},
		ROOM_NM_ENG: {
			type: DataTypes.STRING(64),
			allowNull: true
		},
		ROOM_NM_CN: {
			type: DataTypes.STRING(64),
			allowNull: true
		},
		ID_CODE: {
			type: DataTypes.STRING(20),
			allowNull: true
		},
		DEV_IP: {
			type: DataTypes.STRING(32),
			allowNull: true
		},
		MULTIROOM: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		MULTIROOM_Pool: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		PRINT_SORT: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		PopUp_Use: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		Sound_Use: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		UPDATEDATE: {
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
  
	return RoomSet;
};