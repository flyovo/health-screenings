import Vue from "vue";
import io from "socket.io-client"; 

const socket = io(`http://${process.env.API_HOST}:${process.env.API_PORT}`); 
const SocketPlugin = {
	install(vue) {
		// 인스턴스 메소드 추가
		vue.prototype.$socket = socket;
	}
};

Vue.use(SocketPlugin);
