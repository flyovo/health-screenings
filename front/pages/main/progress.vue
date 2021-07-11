<template>
	<div class="content-wrapper">
		<div class="content-top">
			<div class="header-wrapper">
				<div class="title">검진중 수진자</div>
			</div>
			<div class="content">
				<div class="table-wrapper">
					<vue-table 
						:items="list_progress_pat" 
						:fields="fields_progress" 
						:busy="isBusy" 
						:head="'main'" 
						@onRowClick="onRowClick" 
						:selectRow="selectRow"/>
				</div>
			</div>
		</div>
		<div class="content-bottom">
			<div class="header-wrapper">
				<div class="title">{{ select_pat.Pat_Nm ? select_pat.Pat_Nm : '수진자 이름' }}<span>{{ setVIPText(select_pat.VIP_CHK) }}</span></div>
				<div class="status">도착확인 현황</div>
			</div>
			<div class="content">
				<div class="card-wrapper">
					<room-card v-for="item in card_progress_room" :key="`${item.PAT_NO}-${item.ROOM_NO}`" :items="item" @onItemClick="onCardClick"></room-card>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import VueTable from "~/components/VueTable.vue";
import RoomCard from "~/components/RoomCard.vue";

export default {
	name: "mainProgress",
	layout: "main",
	components: {
		VueTable,
		RoomCard
	},
	data() {
		return {
			name: "Nuxt.js",
			isBusy: false,
			fields_progress: [],
			selectRow: 0,
			select_pat: {},
			pat_name: "",
			pat_vip: ""
		};
	},
	computed: {
		list_progress_pat(){
			return this.$store.state.main.list_progress_pat;
		},
		card_progress_room(){
			return this.$store.state.main.card_progress_room;
		}
	},
	watch: {
		"$route"(to, from){
			if(!this.$route.query.Pat_No){
				this.init();
			}else{
				this.setSelectedData(this.$route.query);
			}
		}
	},
	created() {
		this.$store.commit("setNavTitle", this.$store.state.navList[1].title);

		this.init();

		this.fields_progress = [
			{
				key: "Pat_No",
				label: "등록번호",
				class: "td-25"
			},
			{
				key: "Pat_Nm",
				label: "이름",
				class: "td-25"
			},
			{
				key: "PAT_INFO",
				label: "생년월일/성별",
				class: "td-25"
			},
			{
				key: "VIP_CHK",
				label: "VIP",
				class: "td-25"
			}
		];
	},
	mounted(){
		this.$store.dispatch("main/listProgressPat").then(() => {
			if(this.$route.query.Pat_No){
				const selectCheck = row => row.Pat_No === this.$route.query.Pat_No;
				const index = this.$store.state.main.list_progress_pat.findIndex(selectCheck);
				this.selectRow =  index < 0 ? null : index; 
				this.setSelectedData(this.$route.query);
			}else{
				this.selectRow = 0;
				this.onRowClick(this.$store.state.main.list_progress_pat[0], 0);
			}
		});
	},
	methods: {
		init() {
			this.$store.commit("main/setWaitSelectedRow", null);
			this.$store.commit("main/setRoomNo", null);
			this.$store.commit("main/setPatNo", null);
			this.$store.commit("main/setListProgressPat", []);
			this.$store.commit("main/setCardProgressRoom", []);
			this.selectRow = null;
			this.select_pat = {};
		},
		onRowClick(row) {
			this.$router.push({ path: this.$route.path, query: row });
		},
		onCardClick(row) {
			this.$router.push({ path: "/main/wait", query: row });
		},
		setSelectedData(row){
			this.$store.commit("main/setPatNo", row.Pat_No);
			this.select_pat = row;
			this.$store.dispatch("main/cardProgressRoom");
		},
		setVIPText(value) {
			let text = "";
			switch(value) {
				case "N": text = ""; break;
				case "V": text = "(VIP)"; break;
				default: break;
			}
			return text;
		}
	}
};
</script>

<style lang="scss" scoped>
.content-wrapper {
	width: 100%;
	height: calc(100% - #{setViewport('vh', 110)});
	display: flex;
	flex-wrap: wrap;
	.header-wrapper {
		height: setViewport('vh', 75);
		line-height: setViewport('vh', 75);
		.title {
			font-size: setViewport('vw', 33);
			font-weight: bold;
			letter-spacing: setViewport('vw', -0.83);
			color: #414d6b;
			span {
				font-weight: 500;
			}
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
	}
	.content-top {
		width: 100%;
		height: 50%;
		.content {
			height: calc(100% - #{setViewport('vh', 75)});
			.table-wrapper {
				height: calc(100% - #{setViewport('vh', 75)});
			}
		}
	}
	.content-bottom {
		width: 100%;
		height: 50%;
		.header-wrapper {
			display: flex;
			& > div {
				width: 50%;
			}
			.status {
				font-size: setViewport('vw', 30);
				font-weight: 500;
				letter-spacing: setViewport('vw', -0.75);
				text-align: right;
				color: #414d6b;
				.num_current {
					color: #1c92eb;
				}
			}
		}
		.content {
			height: calc(100% - #{setViewport('vh', 75)});
			overflow-y: auto;
			.card-wrapper {
				display: flex;
				flex-flow: wrap;
			}
		}
	}
}
</style>
