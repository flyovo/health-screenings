module.exports = (sequelize, DataTypes) => {
	const DetailPatList = sequelize.define("gj_detail_pat_list", {
		idx: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true
		},
		ORDER_DATE: {
			type: DataTypes.STRING(64)
		},
		PT_NO: {
			type: DataTypes.STRING(32)
		},
		EXRM_TP_CD: {
			type: DataTypes.STRING(32)
		},
		EXRM_NM: {
			type: DataTypes.STRING(32)
		},
		ORD_CD: {
			type: DataTypes.STRING(32)
		},
		ORD_NM: {
			type: DataTypes.STRING(256)
		},
		EXM_PRGR_STS_CD: {
			type: DataTypes.STRING(32)
		},
		Room_No: {
			type: DataTypes.INTEGER(20)
		},
		Status: {
			type: DataTypes.STRING(20)
		},
		Zone: {
			type: DataTypes.INTEGER(11)
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
  
	return DetailPatList;
};