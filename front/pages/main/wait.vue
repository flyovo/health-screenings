<template>
	<div class="content-wrapper">
		<div class='content-left'>
			<vue-table :items="list_room" :fields="fields_room" :busy="isBusy" :head="'main'" :tableRef="'waitTable'" @onRowClick="onClick" />
		</div>
		<div class="content-right">
			<div class="info">
				<div class="info_empty" v-if="room_no === null">왼쪽 리스트에서 검사실을 선택해주세요.</div>
				<div v-else>
					<span class='info_title'> 현재 검사중인 환자 </span>
					<span class='info_no'>{{ call_pat === undefined ? "" : call_pat.PAT_NO }}</span>
					<span class='info_name'>{{ call_pat === undefined ? "" : call_pat.PAT_NM }}</span>
				</div>
			</div>
			<div class="info-content">
				<div class="info-title">대기환자 목록</div>
				<div class="info-table">
					<vue-table :items="list_wait_pat" :fields="fields_patient" :busy="isBusy" :head="'sub'" :popUpType="'toReceipt'" />
				</div>
			</div>
			<div class="info-content">
				<div class="info-title">접수환자 목록</div>
				<div class="info-table">
					<vue-table :items="list_receipt_pat" :fields="fields_patient" :busy="isBusy" :head="'sub'" :popUpType="'toWait'"/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import VueTable from "~/components/VueTable.vue";

export default {
	name: "mainWait",
	layout: "main",
	components: {
		VueTable
	},
	data() {
		return {
			name: "Nuxt.js",
			isBusy: false,
			fields_room: [],
			fields_patient: []
		};
	},
	computed: {
		list_room(){
			return this.$store.state.main.list_room;
		},
		call_pat(){
			return this.$store.state.main.call_pat;
		},
		room_no(){
			return this.$store.state.main.room_no;
		},
		list_wait_pat(){
			return this.$store.state.main.list_wait_pat;
		},
		list_receipt_pat(){
			return this.$store.state.main.list_receipt_pat;
		},
		errorAlert(){
			return this.$store.state.main.popup;
		}
	},
	watch: {
		errorAlert(popup){
			if(popup === null) {return;}

			switch(popup.error){
				case 422: 
				case 428: this.onOpenConfirmBox(popup);
					break;
				default: this.onOpenErrorBox(popup);
					break;
			}
		}
	},
	created() {
		this.init();

		this.fields_room = [
			{
				key: "ROOM_NM",
				label: "검사실",
				thStyle: {
					width: "55%"
				}
			},
			{
				key: "WAIT",
				label: "예정",
				thStyle: {
					width: "20%"
				}
			},
			{
				key: "ARRIVE",
				label: "대기자",
				thStyle: {
					width: "25%"
				}
			}
		];
		this.fields_patient = [
			{
				key: "NO",
				label: "No.",
				thStyle: {
					width: "8%"
				}
			},
			{
				key: "VIP_CHK",
				label: "VIP",
				thStyle: {
					width: "10%"
				}
			},
			{
				key: "PAT_NO",
				label: "등록번호",
				thStyle: {
					width: "15%"
				}
			},
			{
				key: "PAT_NM",
				label: "이름",
				thStyle: {
					width: "17%"
				}
			},
			{
				key: "PAT_INFO",
				label: "생년월일/성별",
				thStyle: {
					width: "20%"
				}
			},
			{
				key: "RECEIPT_TIME",
				label: "접수시간",
				thStyle: {
					width: "15%"
				}
			},
			{
				key: "ARRIVE_TIME",
				label: "도착시간",
				thStyle: {
					width: "15%"
				}
			}
		];
	},
	mounted() {
		this.$store.dispatch("main/listWaitRoom");

		// socket.io connect
		this.$socket.connect();
		// receive from server websocket - "update"
		this.$socket.on("update", data => { 
			//console.log(data); // updated patient information
			this.$store.dispatch("main/listWaitRoom");
			this.$store.dispatch("main/callPat");
			this.$store.dispatch("main/listWaitPat");
			this.$store.dispatch("main/listReceiptPat");
		});
	},
	beforeDestroy() {
		//this.$socket.disconnect();
		this.$socket.removeListener("update");
	},
	methods: {
		init() {
			this.$store.commit("main/setRoomNo", null);
			this.$store.commit("main/setRoomName", null);
			this.$store.commit("main/setIdCode", null);
			this.$store.commit("main/setMultiroom", null);
			this.$store.commit("main/setMultiroomPool", null);
			this.$store.commit("main/setPatNo", null);
			this.$store.commit("main/setCallPat", {});
			this.$store.commit("main/setListWaitPat", []);
			this.$store.commit("main/setListReceiptPat", []);
		},
		onClick(row, index) {
			this.$store.commit("main/setWaitSelectedRow", index);
			this.$store.commit("main/setRoomNo", row.ROOM_NO);
			this.$store.commit("main/setRoomName", row.ROOM_NM);
			this.$store.commit("main/setIdCode", row.ID_CODE);
			this.$store.commit("main/setMultiroom", row.MULTIROOM);
			this.$store.commit("main/setMultiroomPool", row.MULTIROOM_Pool);
			this.$store.dispatch("main/callPat");
			this.$store.dispatch("main/listWaitPat");
			this.$store.dispatch("main/listReceiptPat");
		},
		onOpenErrorBox(popup) {
			const text = this.$createElement("div", { domProps: { innerHTML: popup.msg } });
			this.$bvModal.msgBoxOk(text, {
				size: "sm",
				buttonSize: "sm",
				okOnly: true,
				okVariant: "success",
				okTitle: "확인",
				hideHeaderClose: true,
				centered: true
			}).then(value => {
				this.$store.commit("main/setPopup", null);
			}).catch(err => {
				// An error occurred
			});
		},
		onOpenConfirmBox(popup) {
			const text = this.$createElement("div", { domProps: { innerHTML: popup.msg } });
			this.$bvModal.msgBoxConfirm(text, {
				size: "sm",
				buttonSize: "sm",
				okVariant: "success",
				cancelTitle: "아니오",
				okTitle: "예",
				hideHeaderClose: true,
				footerClass: "flex-row-reverse",
				centered: true
			}).then(value => {
				if(value){
					this.$store.commit("main/setPopup", null);

					if(popup.error === 422){
						this.$store.dispatch("main/forceChangePatState", popup.existArrive).then(result => {
							if(result){
								this.$store.dispatch("main/changePatState", {
									FCHK_VALUE: 0,
									STATUS: popup.status
								});
							}else{
								console.error("Err : in forceChangePatState");
							}
						});
					}else{
						this.$store.dispatch("main/changePatState", {
							FCHK_VALUE: 0,
							STATUS: popup.status
						});
					}
				}
			}).catch(err => {
				// An error occurred
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.content-wrapper {
	width: 100%;
	height: calc(100% - #{setViewport('vh', 110)});
	display: flex;

	.content-left {
		width: setViewport('vw', 546);
		height: 100%;
		margin-right: setViewport('vw', 30);
	}
	.content-right {
		width: setViewport('vw', 906);
		height: 100%;
		.info {
			display: flex;
			height: setViewport('vh', 91);
			line-height: setViewport('vh', 91);
			margin: 0;
			padding: 0 setViewport('vw', 54);
			border-radius: setRem(18);
			box-shadow: 0px setRem(10) setRem(20) 0 rgba(28, 146, 235, 0.3);
			background-color: #00479d;
			> div {
				width: 100%;
				height: 100%;
				letter-spacing: -1px;
				color: #fefeff;
				&.info_empty {
					text-align: center;
					font-size: setViewport('vw', 40);
					font-weight: 500;
				}
				&:not(.info_empty) {
					display: flex;
					flex-wrap: wrap;
					flex-direction: column;
					font-size: setViewport('vw', 45);
					letter-spacing: setViewport('vw', -1.13);
					[class*=_title] {
						font-weight: bold;
					}
					//[class*=_wait] {
					//	margin-left: setViewport('vw', 145);
					//	margin-right: setViewport('vw', 87);
					//}
					//[class*=_count] {
					//	font-weight: bold;
					//	letter-spacing: normal;
					//	text-align: right;
					//}
					[class*=_no] {
						font-weight: bold;
						letter-spacing: normal;
						text-align: right;
					}
					[class*=_name] {
						font-weight: bold;
						letter-spacing: normal;
						text-align: right;
					}

				}
			}
		}
		.info-content {
			height: calc((100% - #{setViewport('vh', 91)}) / 2);
			.info-title {
				display: inline-block;
				width: 100%;
				height: setViewport('vh', 78);
				line-height: setViewport('vh', 78);
				font-size: setViewport('vw', 33);
				font-weight: bold;
				letter-spacing: setViewport('vw', -0.83);
				text-align: left;
				color: #414d6b;
				&:before {
					content: '';
					display: inline-block;
					width: setViewport('vw', 6);
					height: setViewport('vh', 36);
					margin-right: setViewport('vw', 14);
					background-color: #414d6b;
					vertical-align: sub;
				}
			}
			.info-table {
				height: calc(100% - #{setViewport('vh', 78)});
			}
		}
	}
}
</style>
