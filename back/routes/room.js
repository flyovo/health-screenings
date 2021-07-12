const express = require("express");
const db = require("../models");
const { Op } = require("sequelize");
const router = express.Router();

const queryStatus = {
	wait: 1,
	arrive: [2, 5],
	call: 3
};

// 검사실 리스트 조회
router.get("/list", (req, res, next) => {
	db.RoomSet.findAll({
		attributes: [ "ROOM_NO", "ROOM_NM", "ID_CODE", "MULTIROOM", "MULTIROOM_Pool" ],
		where: {
			ID_CODE: { 
				[Op.ne]: "EMPTY"
			}
		},
		order: [ "ROOM_NO" ],
		raw: true
	}).then(async room_list => {
		let where_value;
		for await (const room of room_list){
			if(room.MULTIROOM_Pool === 0) {
				where_value = room.ROOM_NO;
			}else{
				where_value = room.MULTIROOM;
			}

			await db.RoomPatList.count({ 
				where: { 
					ROOM_NO: where_value, 
					Status: queryStatus.wait
				},
				raw: true
			}).then(c => {
				room.WAIT = c;
			});

			await db.RoomPatList.count({ 
				where: { 
					ROOM_NO: where_value,
					Status: { 
						[Op.or]: [queryStatus.call, queryStatus.arrive[0], queryStatus.arrive[1]]
					}
				},
				raw: true
			}).then(c => {
				room.ARRIVE = c;
			});
		}
		return room_list;
	}).then(result => {
		res.json(result);
	}).catch(err => {
		console.error(err);
		next(err);
	});
});

// 검사실 클릭 : 호출환자 정보 조회
router.get("/:ROOM_NO/call", async (req, res, next) => {
	//const PARAM_ROOM = Number(req.query.pool) !== 0 ? "ROOM_NO" : "SHOW_ROOM_NO";
	const PARAM_ROOM = "SHOW_ROOM_NO";
	try {
		const query = ` SELECT ${db.RoomPatList.name}.ROOM_NO, ${db.RoomPatList.name}.SHOW_ROOM_NO, ${db.RoomPatList.name}.STATUS, ` + 
							` ${db.RoomPatList.name}.PAT_NO, ${db.RoomPatList.name}.PAT_NM, ${db.RoomPatList.name}.AGE, ${db.RoomPatList.name}.SEX, ` + 
							` IFNULL(${db.RoomPatList.name}.RECEIPT_TIME, 0) AS RECEIPT_TIME, IFNULL(${db.RoomPatList.name}.ARRIVE_TIME, 0) AS ARRIVE_TIME ` + 
						` FROM ${db.RoomPatList.name} ` +
						` WHERE ${db.RoomPatList.name}.${PARAM_ROOM} = :room_no AND ${db.RoomPatList.name}.STATUS = :status `;
		const result = await db.sequelize.query(query, {
			model: db.RoomPatList,
			replacements: { room_no: req.params.ROOM_NO, status: queryStatus.call },
			raw: true
		});
		res.json(result);
	} catch (err) {
		console.error(err);
		next(err);
	}
});

// 검사실 클릭 : 대기환자 목록 조회
router.get("/:ROOM_NO/wait", async (req, res, next) => {
	const PARAM_ROOM = Number(req.query.pool) !== 0 ? "ROOM_NO" : "SHOW_ROOM_NO";
	try {
		const query = " SELECT * " +
					  " FROM ( " + 
					  	" SELECT @rownum:=@rownum+1 AS NO, A.* " + 
						" FROM ( " + 
							` SELECT ${db.RoomPatList.name}.ORDER_DATE, ${db.RoomPatList.name}.VIP_CHK, ` + 
							` ${db.RoomPatList.name}.ROOM_NO, ${db.RoomPatList.name}.SHOW_ROOM_NO, ${db.RoomPatList.name}.STATUS, ` + 
							` ${db.RoomPatList.name}.PAT_NO, ${db.RoomPatList.name}.PAT_NM, ${db.RoomPatList.name}.AGE, ${db.RoomPatList.name}.SEX, ${db.PatList.name}.BIRTHDAY, ` + 
							` ${db.RoomPatList.name}.RECEIPT_TIME, ${db.RoomPatList.name}.ARRIVE_TIME, ${db.RoomPatList.name}.DISP_SEQ ` + 
							` FROM ${db.RoomPatList.name} ` + 
							` JOIN ${db.PatList.name} on ${db.RoomPatList.name}.PAT_NO = ${db.PatList.name}.Pat_No ` + 
							" JOIN (SELECT @rownum:=0) AS R " + 
							` WHERE ${db.RoomPatList.name}.${PARAM_ROOM} = :room_no AND (${db.RoomPatList.name}.STATUS = :status1 OR ${db.RoomPatList.name}.STATUS = :status2) ` + 
						" ) AS A " + 
						" ORDER BY A.DISP_SEQ " + 
					" ) AS B ";
		const result = await db.sequelize.query(query, {
			model: db.RoomPatList,
			replacements: { room_no: req.params.ROOM_NO, status1: queryStatus.arrive[0], status2: queryStatus.arrive[1] }
		});
		res.json(result);
	} catch (err) {
		console.error(err);
		next(err);
	}
});

// 검사실 클릭 : 접수환자 목록 조회
router.get("/:ROOM_NO/receipt", async (req, res, next) => {
	//const PARAM_ROOM = Number(req.query.pool) !== 0 ? "ROOM_NO" : "SHOW_ROOM_NO";
	const PARAM_ROOM = "ROOM_NO";
	try {
		const query = " SELECT * " +
					" FROM ( " + 
						" SELECT @rownum:=@rownum+1 AS NO, A.* " + 
						" FROM ( " + 
							` SELECT ${db.RoomPatList.name}.ORDER_DATE, ${db.RoomPatList.name}.VIP_CHK, ` + 
							` ${db.RoomPatList.name}.ROOM_NO, ${db.RoomPatList.name}.SHOW_ROOM_NO, ${db.RoomPatList.name}.STATUS, ` + 
							` ${db.RoomPatList.name}.PAT_NO, ${db.RoomPatList.name}.PAT_NM, ${db.RoomPatList.name}.AGE, ${db.RoomPatList.name}.SEX, ` + 
							` ${db.RoomPatList.name}.RECEIPT_TIME, ${db.RoomPatList.name}.ARRIVE_TIME, ${db.PatList.name}.BIRTHDAY ` +
							` FROM ${db.RoomPatList.name} ` +
							` JOIN ${db.PatList.name} on ${db.RoomPatList.name}.PAT_NO = ${db.PatList.name}.Pat_No ` +
							" JOIN (SELECT @rownum:=0) AS R " + 
							` WHERE ${db.RoomPatList.name}.${PARAM_ROOM} = :room_no AND ${db.RoomPatList.name}.STATUS = :status ` +
						" ) AS A " + 
						" ORDER BY A.RECEIPT_TIME " + 
					" ) AS B ";
		const result = await db.sequelize.query(query, {
			model: db.RoomPatList,
			replacements: { room_no: req.params.ROOM_NO, status: queryStatus.wait }
		});
		res.json(result);
	} catch (err) {
		console.error(err);
		next(err);
	}
});

module.exports = router;
