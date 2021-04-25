import Vue from "vue";
import io from "socket.io-client"; 

const serverIp = process.env.NODE_ENV === "production" ? "http://192.168.10.39:3085" : "http://localhost:3085";
const socket = io(serverIp); 

const SocketPlugin = {
	install(vue) {
		// 인스턴스 메소드 추가
		vue.prototype.$socket = socket;
	}
};

Vue.use(SocketPlugin);
