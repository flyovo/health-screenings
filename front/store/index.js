export const state = () => ({
	navTitle: "",
	navList: [
		{ key: "wait", title: "검사실 대기현황" },   
		{ key: "progress", title: "수진자 진행현황" },   
		{ key: "reservation", title: "예약 List" }
	]
});

export const mutations = {
	setNavTitle(state, payload) {
		state.navTitle = payload;
	}
};

export const actions = {
	nuxtServerInit({ commit, dispatch, state }, { req }) {
		// nuxtServerInit는 모든 페이지를 서버 렌더링하기 전에 Nuxt.js에 의해 호출
		return dispatch("users/loadUser");
	}
};