const passport = require("passport");
const mysqlPassword = require("mysql-password");
const { Strategy: LocalStrategy } = require("passport-local");
const db = require("../models");

module.exports = () => {
	passport.use(new LocalStrategy({
		usernameField: "user_id", // req.body.user_id
		passwordField: "user_pwd" // req.body.user_pwd
	}, async (user_id, user_pwd, done) => {
		try {
			const exUser = await db.UserInfo.findOne({ 
				where: { user_id } 
			});
			if (!exUser) {
				return done(null, false, { reason: "존재하지 않는 사용자입니다." });
			}
			if (mysqlPassword(user_pwd) === exUser.USER_PWD) {
				const parseUser = {
					ADMIN: exUser.ADMIN,
					USER_ID: exUser.USER_ID, 
					USER_NM: exUser.USER_NM 
				};
				return done(null, parseUser);
			} else {
				return done(null, false, { reason: "비밀번호가 틀립니다." });
			}
		} catch (err) {
			console.error(err);
			return done(err);
		}
	}));
};