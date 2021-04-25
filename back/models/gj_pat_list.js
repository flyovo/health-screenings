module.exports = (sequelize, DataTypes) => {
	const PatList = sequelize.define("gj_pat_list", {
		idx: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true
		},
		RESERV_DATE: {
			type: DataTypes.STRING(64)
		},
		ORDER_DATE: {
			type: DataTypes.STRING(64)
		},
		VIP_CHK: {
			type: DataTypes.STRING(20),
			primaryKey: true
		},
		Status: {
			type: DataTypes.INTEGER(11)
		},
		JUBSU_COME: {
			type: DataTypes.INTEGER(11)
		},
		JUBSU_COME_TIME: {
			type: DataTypes.BIGINT(20)
		},
		JUBSU_COME_CALL_TIME: {
			type: DataTypes.BIGINT(20)
		},
		Chart_No: {
			type: DataTypes.STRING(20),
			allowNull: false,
			primaryKey: true
		},
		Pat_No: {
			type: DataTypes.STRING(20),
			allowNull: false
		},
		bookTime: {
			type: DataTypes.STRING(128)
		},
		Pat_Nm: {
			type: DataTypes.STRING(1024),
			allowNull: false
		},
		BIRTHDAY: {
			type: DataTypes.STRING(64)
		},
		Age: {
			type: DataTypes.INTEGER(11)
		},
		Sex: {
			type: DataTypes.STRING(8)
		},
		PhoneNo: {
			type: DataTypes.STRING(64)
		},
		Type: {
			type: DataTypes.STRING(8)
		},
		RFID_Tag: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		RETURN_RFID: {
			type: DataTypes.INTEGER(11)
		},
		Tag_Out_Time: {
			type: DataTypes.DATE
		},
		Tag_In_Time: {
			type: DataTypes.DATE
		},
		ENTP_ID: {
			type: DataTypes.STRING(64)
		},
		CTRC_ORG_NM: {
			type: DataTypes.STRING(256)
		},
		UPDATEDATE: {
			type: DataTypes.DATE,
			allowNull: false
		},
		MEMO: {
			type: DataTypes.STRING(2048)
		}
	}, {
		freezeTableName: true,
		timestamps: false,
		charset: "utf8",
		collate: "utf8_general_ci"
	});

	return PatList;
};
