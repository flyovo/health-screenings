export default function ({ store, redirect }) {
	if (!store.state.users.me) {
		return redirect("/login");
	//}else{
	//	return redirect("/main/wait");
	}
}