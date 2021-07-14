
export const namespaced = true;

export const state = () => ({
	wait_selected_row: null,
	room_no: null,
	room_name: null,
	id_code: null,
	multiroom: null,
	multiroom_pool: null,
	pat_no: null,
	popup: null,
	list_room: [],
	//count_wait_pat: {},
	//count_arrive_pat: {},
	call_pat: {},
	list_wait_pat: [],
	list_receipt_pat: [],
	list_progress_pat: [],
	card_progress_room: [],
	list_reservation: []
});
  
export const mutations = {
	setWaitSelectedRow(state, payload) {
		state.wait_selected_row = payload;
	},
	setRoomNo(state, payload) {
		state.room_no = payload;
	},
	setRoomName(state, payload) {
		state.room_name = payload;
	},
	setIdCode(state, payload) {
		state.id_code = payload;
	},
	setMultiroom(state, payload) {
		state.multiroom = payload;
	},
	setMultiroomPool(state, payload) {
		state.multiroom_pool = payload;
	},
	setPatNo(state, payload) {
		state.pat_no = payload;
	},
	setListRoom(state, payload) {
		state.list_room = payload;
	},
	//setCountWaitPat(state, payload) {
	//	state.count_wait_pat = payload;
	//},
	//setCountArrivePat(state, payload) {
	//	state.count_arrive_pat = payload;
	//},
	setCallPat(state, payload) {
		state.call_pat = payload;
	},
	setListWaitPat(state, payload) {
		state.list_wait_pat = payload;
	},
	setListReceiptPat(state, payload) {
		state.list_receipt_pat = payload;
	},
	setPopup(state, payload) {
		state.popup = payload;
	},
	setListProgressPat(state, payload) {
		state.list_progress_pat = payload;
	},
	setCardProgressRoom(state, payload) {
		state.card_progress_room = payload;
	},
	setListReservation(state, payload) {
		state.list_reservation = payload;
	}
};

const getter = {
	getWaitSelectedRow(state, payload) {
		return state.wait_selected_row;
	},
	getRoomNo(state, payload) {
		return state.room_no;
	},
	getRoomName(state, payload) {
		return state.room_name;
	},
	getIdCode(state, payload) {
		return state.id_code;
	},
	getMultiroom(state, payload) {
		return state.multiroom;
	},
	getMultiroomPool(state, payload) {
		return state.multiroom_pool;
	},
	getPatNo(state, payload) {
		return state.pat_no;
	},
	getListWaitRoom(state) {
		return state.list_room;
	},
	//getCountWaitPat(state) {
	//	return state.count_wait_pat;
	//},
	//getCountArrivePat(state) {
	//	return state.count_arrive_pat;
	//},
	getCallPat(state) {
		return state.call_pat;
	},
	getListWaitPat(state) {
		return state.list_wait_pat;
	},
	getListReceiptPat(state) {
		return state.list_receipt_pat;
	},
	getPopup(state) {
		return state.popup;
	},
	getListProgressPat(state) {
		return state.list_progress_pat;
	},
	getCardProgressRoom(state) {
		return state.card_progress_room;
	},
	getListReservation(state) {
		return state.list_reservation;
	}
};

export const actions = {
	listWaitRoom({ commit }) {
		return new Promise((resolve, reject) => {
			this.$axios.get("/room/list", {
				withCredentials: true
			}).then(res => {
				commit("setListRoom", res.data);
				resolve();
			}).catch(error => {
				console.error(error.response.data.reason);
			});
		});
	},
	callPat({ commit, state }) {
		const roomNum = parseInt(state.multiroom_pool) !== 0 ? parseInt(state.multiroom) : parseInt(state.room_no);
		// const roomNum = state.room_no;
		this.$axios.get(`/room/${roomNum}/call?multiroom=${state.multiroom}&pool=${state.multiroom_pool}`, {
			withCredentials: true
		}).then(res => {
			commit("setCallPat", res.data[0]);
		}).catch(error => {
			console.error(error.response.data.reason);
		});
	},
	listWaitPat({ commit, state }) {
		return new Promise((resolve, reject) => {
			const roomNum = parseInt(state.multiroom_pool) !== 0 ? parseInt(state.multiroom) : parseInt(state.room_no);
			// const roomNum = state.room_no;
			this.$axios.get(`/room/${roomNum}/wait?multiroom=${state.multiroom}&pool=${state.multiroom_pool}`, {
				withCredentials: true
			}).then(res => {
				commit("setListWaitPat", res.data);
				resolve();
			}).catch(error => {
				console.error(error.response.data.reason);
			});
		});
	},
	listReceiptPat({ commit, state }) {
		return new Promise((resolve, reject) => {
			const roomNum = parseInt(state.multiroom_pool) !== 0 ? parseInt(state.multiroom) : parseInt(state.room_no);
			// const roomNum = state.room_no;
			this.$axios.get(`/room/${roomNum}/receipt?multiroom=${state.multiroom}&pool=${state.multiroom_pool}`, {
				withCredentials: true
			}).then(res => {
				commit("setListReceiptPat", res.data);
				resolve();
			}).catch(error => {
				console.error(error.response.data.reason);
			});
		});
	},
	changePatState({ commit, dispatch, state }, payload) {
		const roomNum = parseInt(state.multiroom_pool) !== 0 ? parseInt(state.multiroom) : parseInt(state.room_no);
		this.$axios.post(`/patient/status/${payload.STATUS}`, {
			ROOM_NM: state.room_name,
			ROOM_NO: roomNum,
			SHOW_ROOM_NO: state.room_no,
			ID_CODE: state.id_code,
			PAT_NO: state.pat_no,
			MULTIROOM: state.multiroom,
			MULTIROOM_POOL: state.multiroom_pool,
			FCHK_VALUE: payload.FCHK_VALUE
		}, {
			withCredentials: true
		}).then(res => {
			dispatch("updatePatStatus");
		}).catch(error => {
			if(error.response.status === 422 || error.response.status === 428){
				const setPopup = { 
					error: error.response.status,
					msg: error.response.data.reason,
					status: payload.STATUS
				};
				if(error.response.data.existArrive){
					setPopup.existArrive = error.response.data.existArrive;
				} 
				commit("setPopup", setPopup);
			}else{
				console.error(error.response.data.reason);
			}
		});
	},
	forceChangePatState({ commit, state }, payload) {
		const roomNum = parseInt(payload.MULTIROOM) !== 0 ? parseInt(payload.MULTIROOM) : parseInt(payload.ROOM_NO);
		return new Promise ((resolve, reject) => {
			this.$axios.post(`/patient/status/${payload.STATUS}`, {
				ROOM_NO: roomNum,
				SHOW_ROOM_NO: payload.SHOW_ROOM_NO,
				ID_CODE: payload.ID_CODE,
				PAT_NO: state.pat_no,
				MULTIROOM: state.multiroom,
				MULTIROOM_POOL: payload.MULTIROOM_POOL
			// FCHK_VALUE: payload.FCHK_VALUE
			}, {
				withCredentials: true
			}).then(res => {
				resolve(res.data.reason === "SUCCESS");
			}).catch(error => {
				if(error.response.status === 422 || error.response.status === 428){
					commit("setPopup", { 
						error: error.response.status,
						msg: error.response.data.reason,
						status: payload.STATUS
					}); 
					reject();
				}else{
					console.error(error.response.data.reason);
				}
			});
		});
	},
	listProgressPat({ commit }, payload) {
		return new Promise((resolve, reject) => {
			this.$axios.get("/patient/progress/list", {
				withCredentials: true
			}).then(res => {
				commit("setListProgressPat", res.data);
				resolve();
			//commit("setListProgressPat", [			
			//{
			//	STATUS: 3,
			//	VIP_CHK: "V",
			//	PAT_NO: "12345678",
			//	PAT_NM: "홍길동",
			//	BIRTHDAY: "19900101",
			//	SEX: "M",
			//	ETC1: "REM1",
			//	ETC2: "REM2",
			//	ETC3: "REM3"
			//},
			//]);
			}).catch(error => {
				console.error(error.response.data.reason);
			});
		});
	},
	cardProgressRoom({ commit, state }, payload) {
		this.$axios.get(`/patient/${state.pat_no}/room`, {
			withCredentials: true
		}).then(res => {
			commit("setCardProgressRoom", res.data);
		//[{
		//	ROOM_NO: 1,
		//	ROOM_NM: "채혈실",
		//	PAT_NO: "12345678",
		//	PAT_NM: "홍길동",
		//	AGE: 28,
		//	SEX: "M",
		//	STATUS: 2,
		//	RECEIPT_TIME: "",
		//	ARRIVE_TIME: ""
		//}]
		}).catch(error => {
			console.error(error.response.data.reason);
		});
	},
	listReservation({ commit }, payload) {
		const queryString = payload.status === null ? "" : `status=${payload.status}`;
		this.$axios.get(`/patient/list?${queryString}`, {
			withCredentials: true
		}).then(res => {
			commit("setListReservation", res.data);
		//[{
		//	STATUS: 0,
		//	JUBSU_COME: 0,
		//	JUBSU_COME_TIME: "2021-03-30",
		//	VIP_CHK: "V",
		//	PAT_NO: "12345678",
		//	PAT_NM: "홍길동",
		//	BIRTHDAY: "19900101",
		//	SEX: "M"	
		//}]
		}).catch(error => {
			console.error(error.response.data.reason);
		});
	},
	updatePatStatus({ commit, dispatch, state  }, payload) {
		const query = new URLSearchParams();
		query.append("PAT_NO", state.pat_no);
		query.append("ROOM_NO", state.room_no);
		this.$axios.get(`/patient/update?${query}`, {
			withCredentials: true
		}).then(res => {
			// console.log("front update");
		});
	}
};

