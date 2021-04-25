const passport = require("passport");
const local = require("./local");
const db = require("../models");

module.exports = () => {
	passport.serializeUser((user, done) => { // Strategy 성공 시 호출됨
		return done(null, { USER_ID: user.USER_ID });  // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
	});
	passport.deserializeUser(async (USER_ID, done) => {
		try {
			const user = await db.UserInfo.findOne({ 
				attributes: ["ADMIN", "USER_ID", "USER_NM"],
				where: USER_ID 
			});
			return done(null, user); // req.user, req.isAuthenticated() === true,
		} catch (err) {
			console.error(err);
			return done(err);
		}
	});

	local(); 
};