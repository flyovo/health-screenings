<template>
	<div class="content-wrapper">
		<div class="control-wrapper">
			<button :class="{active : status === null}" @click="status=null, initList()">전체</button>
			<button :class="{active : status === 0}" @click="status=0, initList()">미도착</button>
			<button :class="{active : status === 1}" @click="status=1, initList()">검진중</button>
			<button :class="{active : status === 2}" @click="status=2, initList()">완료</button>
			<button :class="{active : status === 9}" @click="status=9, initList()">삭제</button>
		</div>
		<vue-table :items="list_reservation" :fields="fields_status" :busy="isBusy" :head="'main'" @onRowClick="onClick" />
	</div>
</template>

<script>
import VueTable from "~/components/VueTable.vue";

export default {
	name: "mainReservation",
	layout: "main",
	components: {
		VueTable
	},
	data() {
		return {
			name: "Nuxt.js",
			fields_status: [],
			isBusy: false,
			status: null
		};
	},
	computed: {
		list_reservation(){
			return this.$store.state.main.list_reservation;
		}
	},
	created() {
		this.$store.commit("setNavTitle", this.$store.state.navList[2].title);
		this.fields_status = [
			{
				key: "Pat_No",
				label: "등록번호",
				thStyle: {
					width: "20%"
				}
			},
			{
				key: "Pat_Nm",
				label: "이름",
				thStyle: {
					width: "20%"
				}
			},
			{
				key: "PAT_INFO",
				label: "생년월일/성별",
				thStyle: {
					width: "25%"
				}
			},
			{
				key: "VIP_CHK",
				label: "VIP",
				thStyle: {
					width: "15%"
				}
			},
			{
				key: "Status",
				label: "상태",
				thStyle: {
					width: "20%"
				}
			}
		];
	},
	mounted() {
		this.$store.commit("main/setWaitSelectedRow", null);
		this.initList();
	},
	methods: {
		initList(){
			this.$store.dispatch("main/listReservation",  {
				status: this.status
			});
		},
		onClick(row){
			this.$router.push({ path: "/main/progress", query: row });
		}
	}
};
</script>

<style lang="scss" scoped>
.content-wrapper {
	width: 100%;
	height: 100%;
	display: flex;
	flex-wrap: wrap;
	.control-wrapper {
		position: absolute;
		top: setRem(30);
		right: setRem(30);
		button {
			width: setViewport('vw', 152);
			height: setViewport('vh', 50);
			margin: 0 setViewport('vw', 10);
			border-radius: setRem(1);
			border-width: unset;
			border-style: unset;
			background-color: #00479d;
			font-size: setViewport('vw', 27);
			font-weight: 500;
			letter-spacing:setViewport('vw', -0.68);
			text-align: center;
			color: #ffffff;
			&.active {
				background-color: #1c92eb;
			}
		}
	}
}
</style>
