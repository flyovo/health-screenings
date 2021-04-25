module.exports = (sequelize, DataTypes) => {
	const RoomPatList = sequelize.define("gj_room_pat_list", {
		idx: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true
		},
		ORDER_DATE: {
			type: DataTypes.STRING(64)
		},
		DISP_SEQ: {
			type: DataTypes.INTEGER(11)
		},
		ROOM_NO: {
			type: DataTypes.INTEGER(11)
		},
		SHOW_ROOM_NO: {
			type: DataTypes.INTEGER(11)
		},
		VIP_CHK: {
			type: DataTypes.STRING(20)
		},
		PAT_NO: {
			type: DataTypes.STRING(32)
		},
		PAT_NM: {
			type: DataTypes.STRING(1024)
		},
		Age: {
			type: DataTypes.STRING(20)
		},
		Sex: {
			type: DataTypes.STRING(20)
		},
		STATUS: {
			type: DataTypes.STRING(20)
		},
		ARRIVE_DEV: {
			type: DataTypes.STRING(256)
		},
		RECEIPT_TIME: {
			type: DataTypes.DATE
		},
		ARRIVE_TIME: {
			type: DataTypes.DATE
		},
		COMPLETE_TIME: {
			type: DataTypes.DATE
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
  
	RoomPatList.associate = models => {
		RoomPatList.belongsTo(models.PatList, {
			as: "PatList", 
			foreignKey: "PAT_NO",
			targetKey: "Pat_No"
		});
		RoomPatList.belongsTo(models.RoomSet, {
			as: "RoomSet", 
			foreignKey: "ROOM_NO",
			targetKey: "ROOM_NO"
		});
	};
	  
	return RoomPatList;
};