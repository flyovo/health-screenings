const express = require("express");
const passport = require("passport");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

const router = express.Router();

router.get("/", isLoggedIn, async (req, res, next) => {
	const user = await req.user;
	res.json(user);
});
  
router.post("/login", isNotLoggedIn, (req, res, next) => {
	passport.authenticate("local", (err, user, info) => {
	  if (err) {
		  return next(err);
	  }
	  if (info) {
		  return res.status(401).send(info);
	  }
	  return req.login(user, async err => { // 세션에다 사용자 정보 저장 (어떻게? serializeUser)
			if (err) {
				console.error(err);
				return await next(err);
			}
			req.session.save(() => {
				return res.json(user);
			});
	  });
	})(req, res, next);
});

router.post("/logout", (req, res) => { // 실제 주소는 /user/logout
	if (req.isAuthenticated()) {
		req.logout();
		req.session.destroy(); // 선택사항
		return res.status(200).send("로그아웃 되었습니다.");
	}
});

module.exports = router;
