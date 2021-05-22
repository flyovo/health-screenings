const express = require("express");
const db = require("../models");
const { Op } = require("sequelize");
const router = express.Router();
const http = require("http");

const queryStatus = {
	wait: 1,
	arrive: [2, 5],
	call: 3
};
// 외부 서버 API 받아오기 
function extAPICall(json){
	return new Promise(function (resolve, reject) {
		const host = process.env.EXTERNAL_HOST;
		const port = process.env.EXTERNAL_PORT;
		const queryString = Object.keys(json).map(key => key + "=" + json[key]).join("&");
		const extAPI = `http://${host}:${port}/GJMW/view/URLData/getURLData.jsp?${queryString}`;
		
		function handleResponse(response) {
			let serverData = "";
			let result;
			response.on("data", function (chunk) {
				serverData += chunk;
			});
			response.on("end", function (){
				if(serverData.trim() === ""){
					// 예외 : 응답 없는 경우 
					resolve();
				}else{
					result = JSON.parse(serverData);
					resolve(result);
				}
			});
		}
		http.get(extAPI, function (res) {
			return handleResponse(res);
		}).on("error", error => {
			reject({ error: error.message });
		});
	}).catch(error => {
		return error;
	});
};

// 환자클릭 : 접수(화면 아래) -> 대기(화면 위)
router.post("/status/1", (req, res, next) => {
	// 1. 선검사
	const extParam = {
		Type: "cnuh_gj_fchk",
		ROOMCODE: req.body.ID_CODE, 
		PATNO: req.body.PAT_NO
	}; 
	extAPICall(extParam).then(async http_result => {
		let result = {
			continue: true
		};
		if(http_result.hasOwnProperty("error")){
			// 선검사 확인하는 서버에 문제 발생 시 대비 
			return res.status(500).send({ reason: http_result.error });
		}else if(req.body.FCHK_VALUE !== undefined){
			// 프론트에서 도착 확인 진행도록 요청함. PASS
		}else if(http_result.FCHK_VALUE.toString() !== "0"){
			// 선검사 항목 존재 ERROR
			result.continue = false;
			result.room = http_result.FCHK_NM;
		}
		return await result;
	}).then(result => {
		if(result.continue) {
			return new Promise((resolve, reject) => {
				const PARAM_ROOM = Number(req.body.MULTIROOM_POOL) !== 0 ? "SHOW_ROOM_NO" : "ROOM_NO";
				db.sequelize.transaction().then(async transaction => {
					// 2. 중복 도착확인 확인
					await db.RoomPatList.findAll({
						attributes: [ "ROOM_NO", "SHOW_ROOM_NO", "STATUS" ],
						where: {
							PAT_NO: req.body.PAT_NO,
							STATUS: { 
								[Op.or]: [ queryStatus.arrive[0], queryStatus.arrive[1], queryStatus.call ]
							}
						},
						raw: true,
						transaction: transaction
					}).then(result => {
						if(result.length > 0){ 
							let checkOverlap = result[0];
							// 2-1. 조회값이 있을 경우
							// 검사실 이름 조회 
							db.RoomSet.findAll({
								attributes: [ "ROOM_NM", "ROOM_NO", "ID_CODE", "MULTIROOM", "MULTIROOM_pool" ],
								where: {
									ROOM_NO: result[0][PARAM_ROOM]
								},
								raw: true,
								transaction: transaction
							}).then(result => {
								// 다른 검사실 도착인되어 있으면 예/아니오 선택버튼 팝업 
								transaction.rollback();
								let msg = `등록번호 '${req.body.PAT_NO}'은<br/>이미 '${result[0].ROOM_NM}'에<br/>도착확인되어 있습니다.` + 
											`<br/><br/>'${req.body.ROOM_NM}'에 도착확인하시겠습니까?`;
								reject(res.status(422).send({
									reason: msg, 
									existArrive: {
										STATUS: checkOverlap.STATUS,
										ROOM_NO: checkOverlap.ROOM_NO,
										SHOW_ROOM_NO: checkOverlap.SHOW_ROOM_NO,
										ID_CODE: result[0].ID_CODE,
										MULTIROOM: result[0].MULTIROOM,
										MULTIROOM_POOL: result[0].MULTIROOM_pool 
									} 
								}));
								//return ;
							});
						}else{ 
							// 2-2. 조회값이 없을 경우 도착확인 처리
							// 상태 변경 1)
							db.DetailPatList.update(
								{ Status: queryStatus.arrive[0] },
								{
									where: {
										PT_NO: req.body.PAT_NO,
										Room_No: req.body.ROOM_NO
									},
									transaction: transaction
								}
							).then(result => {
								// 상태 변경 2)
								if(result.length > 0){ // 결과값이 하나라도 있을 때
									//* Disp 순서 가져오기
									const PARAM_ROOM = Number(req.body.MULTIROOM_POOL) !== 0 ? "SHOW_ROOM_NO" : "ROOM_NO";
									const query = ` SELECT IFNULL(MAX(${db.RoomPatList.name}.DISP_SEQ), 0) AS DISP_SEQ ` + 
														` FROM ${db.RoomPatList.name} ` + 
														` WHERE ${db.RoomPatList.name}.${PARAM_ROOM} = :room_no `;
									db.sequelize.query(query, {
										model: db.RoomPatList,
										replacements: { room_no: req.body.ROOM_NO },
										raw: true,
										transaction: transaction
									}).then(result => {
										db.RoomPatList.update(
											{ 
												SHOW_ROOM_NO: req.body.SHOW_ROOM_NO,
												STATUS: queryStatus.arrive[0],
												ARRIVE_TIME: db.sequelize.fn("NOW"),
												DISP_SEQ: result[0].DISP_SEQ + 1
											},
											{
												where: {
													PAT_NO: req.body.PAT_NO,
													Room_No: req.body.ROOM_NO
												},
												transaction: transaction
											}
										).then(result => {
											// 상태 변경 3)
											db.DetailPatList.update(
												{ Status: queryStatus.arrive[0] },
												{
													where: {
														PT_NO: req.body.PAT_NO,
														Room_No: req.body.ROOM_NO
													},
													transaction: transaction
												}
											).then(() => {
												//tablet에서 업데이트 했음을 남김 ("M")
												const regex = new RegExp("(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)");
												const [ip4] = (req.headers["X-Forwarded-For"] || req.headers["x-forwarded-for"] || req.connection.remoteAddress).match(regex);
												let dev = {
													DEV: "M",
													IP: ip4,
													ROOMNO: req.body.ROOM_NO
												};
												db.RoomPatList.update(
													{ ARRIVE_DEV: JSON.stringify(dev) },
													{
														where: {
															PAT_NO: req.body.PAT_NO,
															ROOM_NO: req.body.ROOM_NO
														},
														transaction: transaction
													}
												).then(() => {
													// 3. History 로그 Insert
													transaction.commit();
														
													// 외부 API SNED = 환자상태 변경
													let extParam = {
														Type: "Status_Chg",
														ROOM_NO: req.body.ROOM_NO,
														SHOW_ROOM_NO: req.body.ROOM_NO
													};
													extAPICall(extParam).then(() => {
														resolve(res.status(200).send({ reason: "SUCCESS" }));
													});
													//return ;
												}).catch(() => {
													transaction.rollback();
													reject();
												});
											});
										});
									}).catch(err => {
										transaction.rollback();
										reject();
										next(err);
									});
								}else{
									transaction.rollback();
									reject(res.status(422).send({ reason: "DATA_NOT_FOUND" }));
									//return ;
								} // if-else
							}).catch(err => {
								transaction.rollback();
								reject();
								next(err);
							});
						} // if-else
					});
				});
			}).catch(err => {
				console.error(err);
				next(err);
			});
		}else{
			return res.status(428).send({ reason: `${result.room} 검사를 아직 받지 않았습니다.<br />도착확인 처리하시겠습니까?` });
		}
	});

});

// 환자클릭 : 대기(화면 위) -> 접수(화면 아래)
router.post("/status/:STATUS", (req, res, next) => {
	return new Promise((resolve, reject) => {
		// 1. 도착확인 취소
		db.sequelize.transaction().then(async transaction => {
			// 상태 변경 1)
			await db.DetailPatList.update(
				{ Status: queryStatus.wait },
				{
					where: {
						PT_NO: req.body.PAT_NO,
						Room_No: req.body.ROOM_NO
					},
					transaction: transaction
				}
			).then(result => {
				// 상태 변경 2)
				const PARAM_ROOM = Number(req.body.MULTIROOM_POOL) !== 0 ? "SHOW_ROOM_NO" : "ROOM_NO";
				const query = ` UPDATE ${db.RoomPatList.name} ` + 
								` SET ${db.RoomPatList.name}.STATUS = :status ` + 
								` WHERE ${db.RoomPatList.name}.PAT_NO = :pat_no AND ${db.RoomPatList.name}.${PARAM_ROOM} = :room_no `;
				db.sequelize.query(query, {
					// model: db.RoomPatList,
					replacements: { status: queryStatus.wait, room_no: req.body[PARAM_ROOM], pat_no: req.body.PAT_NO },
					transaction: transaction
				}).then(result => {
					// 상태 변경 3)
					db.DetailPatList.update(
						{ STATUS: queryStatus.wait },
						{
							where: {
								PAT_NO: req.body.PAT_NO,
								Room_No: req.body.ROOM_NO
							},
							transaction: transaction
						}
					).then(result => {
						// 2. History 로그 Insert
						transaction.commit();
						resolve();

						// SHOW_ROOM_NO를 가져오기 위한 쿼리
						db.RoomPatList.findAll({
							attributes: [ "ROOM_NO", "SHOW_ROOM_NO" ],
							where: {
								PAT_NO: req.body.PAT_NO,
								ROOM_NO: req.body.ROOM_NO
							},
							raw: true
						}).then(result => {
							// 외부 API SNED = 환자상태 변경
							let extParam = {
								Type: "Status_Chg",
								ROOM_NO: req.body.ROOM_NO,
								SHOW_ROOM_NO: result.SHOW_ROOM_NO
							};
							extAPICall(extParam);
						}).catch(err => {
							reject();
							transaction.rollback();
							return res.status(500).send({ reason: "FAILE" });
						});
						
						return res.status(200).send({ reason: "SUCCESS" });
					}).catch(err => {
						reject();
						transaction.rollback();
						return res.status(500).send({ reason: "FAILE" });
					});
				}).catch(err => {
					reject();
					transaction.rollback();
					return res.status(500).send({ reason: "FAILE" });
				});
			}).catch(err => {
				reject();
				transaction.rollback();
				return res.status(500).send({ reason: "FAILE" });
			});
		}).catch(err => {
			reject();
			transaction.rollback();
			return res.status(500).send({ reason: "FAILE" });
		});
		//res.json(result);
	//}
	}).catch(err => {
		console.error(err);
		next(err);
	});
});

// 수진자 진행현황 리스트
router.get("/progress/list", async (req, res, next) => {
	try {
		const result = await db.PatList.findAll({
			attributes: [ "Status", "VIP_CHK", "BIRTHDAY", "Pat_No", "Pat_Nm", "Age", "SEX" ],
			where: {
				Status: { 
					[Op.or]: [queryStatus.wait, queryStatus.arrive[0]] 
				}
			},
			order: ["Pat_Nm"]
		});
		res.json(result);
	} catch (err) {
		console.error(err);
		next(err);
	}
});

// 수진자 진행현황 - 검사실 현황
router.get("/:PAT_NO/room", async (req, res, next) => {
	try {
		const query = ` SELECT ${db.RoomPatList.name}.ROOM_NO, ${db.RoomSet.name}.ROOM_NM, ` + 
							` ${db.RoomPatList.name}.PAT_NO, ${db.RoomPatList.name}.PAT_NM, ${db.RoomPatList.name}.AGE, ` + 
							` ${db.RoomPatList.name}.SEX, ${db.RoomPatList.name}.STATUS, ` + 
							` IFNULL(${db.RoomPatList.name}.RECEIPT_TIME, 0), IFNULL(${db.RoomPatList.name}.ARRIVE_TIME, 0) ` + 
							` FROM ${db.RoomPatList.name} ` +
							` JOIN ${db.RoomSet.name} on ${db.RoomPatList.name}.ROOM_NO = ${db.RoomSet.name}.ROOM_NO ` +
							` WHERE ${db.RoomPatList.name}.PAT_NO = :pat_no ` +
							` ORDER BY ${db.RoomPatList.name}.ROOM_NO `;
		const result = await db.sequelize.query(query, {
			model: db.RoomPatList,
			replacements: { pat_no: req.params.PAT_NO }
		});
		res.json(result);
	} catch (err) {
		console.error(err);
		next(err);
	}
});

// 예약 리스트
router.get("/list", async (req, res, next) => {
	const queryWhere = req.query.status ? { Status: req.query.status } : {};
	try {
		const result = await db.PatList.findAll({
			attributes: [ "Status", "JUBSU_COME", "JUBSU_COME_TIME", "VIP_CHK", "Pat_No", "Pat_Nm", "BIRTHDAY", "Age", "SEX", "Type" ],
			where: queryWhere,
			order: ["Pat_Nm"]
		});
		res.json(result);
	} catch (err) {
		console.error(err);
		next(err);
	}
});


// 환자 상태 변경 (외부 API에서 호출함, 리턴값 없음, 프론트엔드 화면 갱신) 
router.get("/update", (req, res, next) => {
	try {
		return new Promise(resolve => {
			// websocket 이벤트로 전송
			let io = req.app.get("socketIo");
			resolve(res.json({ status: 200, data: "SUCCESS" }));
			io.emit("update", { PAT_NO: req.query.PAT_NO, ROOM_NO: req.query.ROOM_NO });
			io.on("disconnect", () => {
				//console.log("---------disconnect");
			});
		});
	} catch (err) {
		console.error(err);
		next(err);
	}
});

module.exports = router;
