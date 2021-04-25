export const namespaced = true;

export const state = () => ({
	me: null
});
  
export const mutations = {
	setMe(state, payload) {
		state.me = payload;
	}
};
  
export const actions = {
	async loadUser({ state, commit }) {
		await this.$axios.get("/user", {
			withCredentials: true,
			credentials: "include"
		}).then(res => {
			commit("setMe", res.data);
		}).catch(err => {
			console.error(err.response.data.reason);
		});
	},
	logIn({ commit }, payload) {
		this.$axios.post("/user/login", {
			user_id: payload.user_id,
			user_pwd: payload.user_pwd
		}, {
			withCredentials: true //쿠키 서로 저장 (다른 서버에)
		}).then(res => {
			commit("setMe", res.data);
			this.$router.push("/main/wait");
		}).catch(error => {
			switch(error.response.status){
				case 401: commit("main/setPopup", error.response.data.reason, { root: true });
					break;
				case 403: this.$router.push("main/wait"); 
					break;
				default: console.error("Error : ", error.response.data.reason);
					break;
			}
			
		});
	},
	logOut({ commit }) {
		this.$axios.post("/user/logout", {}, {
			withCredentials: true
		}).then(data => {
			commit("setMe", null);
		}).catch(err => {
			console.error(err);
		});
  
	}
};
  