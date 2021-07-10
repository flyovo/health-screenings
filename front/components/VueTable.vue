<template>
	<div class="table-container">
		<b-table sticky-header outlined
				:items="items"
				:fields="fields"
				:head-class="head"
				:ref="tableRef"
				:selectable='useClickEvent'
				:select-mode="'single'"
				:busy="isBusy"
				@row-clicked="onRowClicked"
				>
			<!-- <template #cell(ARRIVE)="data">
				{{ Number(data.item.MULTIROOM_Pool) === 0 ? data.item.ARRIVE1 : data.item.ARRIVE2 }}
			</template> -->
			<template #cell(VIP_CHK)="data">
				{{ data.item.VIP_CHK === 'V' ? 'VIP' : " " }}
			</template>
			<template #cell(PAT_INFO)="data">
				{{ setDateFormat(data.item.BIRTHDAY) }}/{{ data.item.SEX === "M" ? "남" : "여" }}
			</template>
			<template #cell(Status)="data">
				<span :class="'text-' + data.item.Status">{{ setStatue(data.item.Status) }}</span>
			</template>
			<template #cell(RECEIPT_TIME)="data">
				{{ setTimeFormat(data.item.RECEIPT_TIME) }}
			</template>
			<template #cell(ARRIVE_TIME)="data">
				{{ setTimeFormat(data.item.ARRIVE_TIME) }}
			</template>
			<template #table-busy>
				<div class="text-center my-2">
					<b-spinner class="align-middle"></b-spinner>
					<strong>Loading...</strong>
				</div>
			</template>
		</b-table>
	</div>
</template>

<script>
export default {
	name: "VueTable",
	props: {
		items: {
			type: Array,
			default: []
		},
		fields: {
			type: Array,
			default: []
		},
		isBusy: {
			type: Boolean,
			default: false
		},
		head: {
			type: String,
			default: "main"
		},
		tableRef: {
			type: String,
			default: "selectableTable"
		},
		useClickEvent: {
			type: Boolean,
			default: true
		},
		popUpType: {
			type: String,
			default: "toReceipt"
		},
		selectRow: {
			type: Number,
			default: null
		}
	},
	updated(){
		if(this.selectRow !== null){
			this.scrollToRow(this.selectRow);
		}
	},
	methods: {
		setStatue(status){
			let text = "";
			switch(status) {
				case 0: text = "미도착"; break;
				case 1: text = "도착"; break;
				case 2: text = "완료"; break;
				case 9: text = "삭제"; break;
				default: text = ""; break;
			}
			return text;
		},
		numFormat(value) {
			value = Number(value).toString();
			if (Number(value) < 10 && value.length === 1) {
				value = "0" + value.toString();
			}
			return value;
		},
		setTimeFormat(date){
			if(date === null) {return "";}
			const set_date = new Date(new Date(date).getTime());
			const hours = this.numFormat(set_date.getHours());
			const minutues = this.numFormat(set_date.getMinutes());
			return `${hours}:${minutues}`;
		},
		setDateFormat(text){
			const year = text.substring(0, 4);
			const month = text.substring(4, 6);
			const day = text.substring(6, 8);
			return `${year}-${month}-${day}`;
		},
		onRowClicked(item, index) {
			if(index < 0) {return;};
			if(this.head === "sub"){
				this.openPopUp(item);
				return;
			}
			if(!this.useClickEvent) {return;};

			this.$emit("onRowClick", item, index);
		},
		openPopUp(item) {
			let text = "대기 취소하시겠습니까?";
			if(this.popUpType === "toWait"){
				text = "대기 하시겠습니까?";
			}
			this.$bvModal.msgBoxConfirm(text, {
				size: "md",
				buttonSize: "md",
				okVariant: "success",
				cancelTitle: "아니오",
				okTitle: "예",
				hideHeaderClose: true,
				footerClass: "flex-row-reverse",
				centered: true
			}).then(value => {
				if(value) {
					this.$store.commit("main/setPatNo", item.PAT_NO);
					this.$store.dispatch("main/changePatState", {
						STATUS: item.STATUS
					});
				}
			}).catch(err => {
				// An error occurred
			});
		},
		scrollToRow(index){
			this.$refs[this.tableRef].selectRow(index);
			const tbody = this.$refs[this.tableRef].$el.querySelector("tbody");
			const row = tbody.querySelectorAll("tr")[index];
			if(row) {
				row.scrollIntoView(false);
			}
		}
	}  
};
</script>
<style lang="scss">
.table-container {
	width: 100%;
	height: 100%;
}

.b-table-sticky-header {
    width: 100%;
    min-height: 100%;
    margin-bottom: 0;
	border: setRem(1) solid #e5e5e5;

	[head-class = 'main'] th {
		color: #414d6b !important;
	}
	[head-class = 'sub'] th {
		color: #2a2c2f !important;
	}
	.border {
		border: none !important
	}
	table {
		height: 100%;
		thead {
			tr {
				th {
					height: setViewport('vh', 73);
					top: setRem(-1);
					padding: 0;
					text-align: center;
					vertical-align: middle;
					font-size: setViewport('vw', 27);
					font-weight: bold;
					letter-spacing: setViewport('vw', -0.68);
					background-color: #ededed !important;
					border-top: 0;
					border-bottom: solid setRem(1) #e5e5e5;
					&.not-visible > div {
						color: #ededed;
					}
				}
			}
		}
		tbody {
			display: table-footer-group;
    		width: 100%;
			tr {
				height: setViewport('vh', 80);
				&.b-table-row-selected,
				&.b-table-row-selected td {
					background-color: #e7f4fe !important;
				}
				&:focus {
					outline: none;
				}
				td {
					padding: 0;
					text-align: center;
    				vertical-align: middle;
					font-size: setViewport('vw', 27);
					font-weight: 500;
					letter-spacing: setViewport('vw', -0.68);
					color: #2a2c2f;
					background-color: #ffffff;
					border-top: none !important;
					border-bottom: setRem(1) solid #e5e5e5 !important;
					&.td-25 {
						width: 25%;
					}
				}
			}
		}
		span[class*="text-"] {
			font-size: setViewport('vw', 27);
			font-weight: bold;
			letter-spacing: setViewport('vw', -0.68);
			text-align: center;
			&[class*="0"] { //미도착
				color: #ec2a57;
			}
			&[class*="1"] { //도착
				color: #019d95;
			}
			&[class*="2"] { //검진중
				color: #fe861c;
			}
			&[class*="3"] { //완료
				color: #1972e1;
			}
			&[class*="9"] { //삭제
				color: #1972e1;
			}
		}
		//button {
		//	width: 10.375rem;
		//	height: 3.25rem;
		//	border-radius: 1.625rem;
		//	font-size: 1.56rem;
		//	font-weight: bold;
		//	letter-spacing: -0.63px;
		//	text-align: center;
		//	&:focus, &:hover, &:active, &:active:focus {
		//		box-shadow: none !important;
		//	}
		//	&.button-0 {
		//		border: solid 3px #1c92eb;
		//		background-color: #ffffff;
		//		color: #1c92eb;
		//		&:hover, &:active {
		//			border: solid 3px #1c92eb !important;
		//			background-color: #1c92eb !important;
		//			color: #ffffff !important;
		//		}
		//	}
		//	&.button-3 {
		//		border: solid 3px #ff6600;
		//		background-color: #ffffff;
		//		color: #ff6600;
		//		&:hover, &:active {
		//			border: solid 3px #ff6600 !important;
		//			background-color: #ff6600 !important;
		//			color: #ffffff !important;
		//		}
		//	}
		//}
	}
}

.modal-dialog {
	max-width: setViewport('vw', 540);
	.modal-content {
		border-radius: setRem(21);
		.modal-body {
			height: setViewport('vh', 442);
			display: flex;
			justify-content: center;
			flex-direction: column;
			text-align: center;
			font-size: setViewport('vw', 35);
			font-weight: bold;
			letter-spacing: setViewport('vw', -0.88);
			color: #414d6b;
		}
	}
	.modal-footer {
		border-top: 0;
		border-bottom-right-radius: setRem(21);
		border-bottom-left-radius: setRem(21);
		padding: setViewport('vh', 48) setViewport('vw', 39.5);
		justify-content: center;
		button {
			width: setViewport('vw', 220);
			height: setViewport('vh', 72);
			border-radius: setRem(36);
			font-size: setViewport('vw', 30);
			font-weight: 500;
			text-align: center;
			margin: 0;
			&.btn-success {
				border: solid setRem(3) #1c92eb;
				background-color: #ffffff;
				color: #1c92eb;
				box-shadow: unset;
				&:hover {
					background-color: #1c92eb;
					color: #ffffff;
				}
				&:not(:disabled):not(.disabled):active, 
				&:not(:disabled):not(.disabled).active {
					border: solid setRem(3) #1c92eb;
					background-color: #1c92eb;
					color: #ffffff;
					box-shadow: unset;
				}
			}
			&.btn-secondary  {
				border: solid setRem(3) #1c92eb;
				background-color: #1c92eb;
				color: #ffffff;
				box-shadow: unset;
				&:hover {
					border: solid setRem(3) #00479d;
					background-color: #00479d;
				}
				&:not(:disabled):not(.disabled):active, 
				&:not(:disabled):not(.disabled).active {
					border: solid setRem(3) #00479d;
					background-color: #00479d;
					box-shadow: unset;
				}
			}
		}
	}
	.flex-row-reverse {
		flex-direction: row-reverse;
		justify-content: space-between;
	}
}
</style>