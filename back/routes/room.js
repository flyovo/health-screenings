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
router.get("/list", async (req, res, next) => {
	try {
		const query = ` SELECT r2.ROOM_NO AS ROOM_NO, r2.ROOM_NM AS ROOM_NM, ${db.RoomSet.name}.ROOM_NO AS OVERLAP_NO, ${db.RoomSet.name}.ID_CODE, ${db.RoomSet.name}.MULTIROOM, ${db.RoomSet.name}.MULTIROOM_Pool, ` +
								" IFNULL(w.total, 0) AS WAIT , IFNULL(a1.total, 0) AS ARRIVE1, IFNULL(a2.total, 0) AS ARRIVE2 " +
						` FROM ${db.RoomSet.name} ` + 
							` INNER JOIN ${db.RoomSet.name} AS r2 ON ${db.RoomSet.name}.ID_CODE = r2.ID_CODE ` + 
							` LEFT OUTER JOIN (SELECT ROOM_NO, COUNT(${db.RoomPatList.name}.ROOM_NO) as total FROM ${db.RoomPatList.name} WHERE ${db.RoomPatList.name}.STATUS = :status1 GROUP BY ${db.RoomPatList.name}.ROOM_NO ) AS w ON gj_room_set.ROOM_NO = w.ROOM_NO ` + 
							` LEFT OUTER JOIN (SELECT ROOM_NO, COUNT(${db.RoomPatList.name}.ROOM_NO) as total FROM ${db.RoomPatList.name} WHERE ${db.RoomPatList.name}.STATUS = :status2 OR ${db.RoomPatList.name}.STATUS = :status3 OR ${db.RoomPatList.name}.STATUS = :status4 GROUP BY ${db.RoomPatList.name}.ROOM_NO) AS a1 ON ${db.RoomSet.name}.ROOM_NO = a1.ROOM_NO ` + 
							` LEFT OUTER JOIN (SELECT SHOW_ROOM_NO, COUNT(${db.RoomPatList.name}.SHOW_ROOM_NO) as total FROM ${db.RoomPatList.name} WHERE ${db.RoomPatList.name}.STATUS = :status2 OR ${db.RoomPatList.name}.STATUS = :status3 OR ${db.RoomPatList.name}.STATUS = :status4 GROUP BY ${db.RoomPatList.name}.SHOW_ROOM_NO) AS a2 ON ${db.RoomSet.name}.ROOM_NO = a2.SHOW_ROOM_NO ` + 
						` WHERE ${db.RoomSet.name}.ID_CODE != :code ` + 
						" GROUP BY r2.ROOM_NO " + 
						" ORDER BY r2.ROOM_NO ";
		let result = await db.sequelize.query(query, {
			model: db.RoomSet,
			replacements: { 
				status1: queryStatus.wait, 
				status2: queryStatus.call, 
				status3: queryStatus.arrive[0], 
				status4: queryStatus.arrive[1], 
				code: "EMPTY" 
			},
			raw: true
		});
		res.json(result);
	} catch(err) {
		console.error(err);
		next(err);
	};
});

//router.get("/:ROOM_NO/wait/count", async (req, res, next) => {
//	try {
//		const result1 = await db.RoomPatList.count({
//			where: {
//				ROOM_NO: req.params.ROOM_NO,
//				STATUS: "1"
//			}
//		});
//		const result = {
//			COUNT: result1
//		};
//		res.json(result);
//	} catch (err) {
//		console.error(err);
//		next(err);
//	}
//});

//router.get("/:ROOM_NO/arrive/count", async (req, res, next) => {
//	const PARAM_ROOM = Number(req.query.pool) !== 0 ? "ROOM_NO" : "SHOW_ROOM_NO";
//	let queryWhere = {};
//	queryWhere[PARAM_ROOM] = req.params.ROOM_NO;
//	queryWhere.STATUS = { [Op.or]: ["2", "3", "5"] };
//	try {
//		const result1 = await db.RoomPatList.count({
//			where: queryWhere
//		});
//		const result = {
//		//	ROOM_NM: result2[0].ROOM_NM,
//			COUNT: result1
//		};
//		res.json(result);
//	} catch (err) {
//		console.error(err);
//		next(err);
//	}
//});

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
		const query = ` SELECT @rownum:=@rownum+1 AS NO, ${db.RoomPatList.name}.ORDER_DATE, ${db.RoomPatList.name}.VIP_CHK, ` + 
							` ${db.RoomPatList.name}.ROOM_NO, ${db.RoomPatList.name}.SHOW_ROOM_NO, ${db.RoomPatList.name}.STATUS, ` + 
							` ${db.RoomPatList.name}.PAT_NO, ${db.RoomPatList.name}.PAT_NM, ${db.RoomPatList.name}.AGE, ${db.RoomPatList.name}.SEX, ${db.PatList.name}.BIRTHDAY, ` + 
							` ${db.RoomPatList.name}.RECEIPT_TIME, ${db.RoomPatList.name}.ARRIVE_TIME, ${db.RoomPatList.name}.DISP_SEQ ` + 
						` FROM (SELECT @rownum:=0) AS TEMP, ${db.RoomPatList.name} ` +
							` JOIN ${db.PatList.name} on ${db.RoomPatList.name}.PAT_NO = ${db.PatList.name}.Pat_No ` +
						` WHERE ${db.RoomPatList.name}.${PARAM_ROOM} = :room_no AND (${db.RoomPatList.name}.STATUS = :status1 OR ${db.RoomPatList.name}.STATUS = :status2) ` + 
						` ORDER BY ${db.RoomPatList.name}.DISP_SEQ `;
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
		const query = ` SELECT @rownum:=@rownum+1 AS NO, ${db.RoomPatList.name}.ORDER_DATE, ${db.RoomPatList.name}.VIP_CHK, ` + 
							` ${db.RoomPatList.name}.ROOM_NO, ${db.RoomPatList.name}.SHOW_ROOM_NO, ${db.RoomPatList.name}.STATUS, ` + 
							` ${db.RoomPatList.name}.PAT_NO, ${db.RoomPatList.name}.PAT_NM, ${db.RoomPatList.name}.AGE, ${db.RoomPatList.name}.SEX, ` + 
							` ${db.RoomPatList.name}.RECEIPT_TIME, ${db.RoomPatList.name}.ARRIVE_TIME, ${db.PatList.name}.BIRTHDAY ` +
						` FROM (SELECT @rownum:=0) AS TEMP, ${db.RoomPatList.name} ` +
							` JOIN ${db.PatList.name} on ${db.RoomPatList.name}.PAT_NO = ${db.PatList.name}.Pat_No ` +
						` WHERE ${db.RoomPatList.name}.${PARAM_ROOM} = :room_no AND ${db.RoomPatList.name}.STATUS = :status ` +
						` ORDER BY ${db.RoomPatList.name}.RECEIPT_TIME `;
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
