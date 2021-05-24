<template>
  <b-container fluid>
    <!-- Page content -->
        <div class="form_wrapper">
            <div class="form_box">
                <img src="~/assets/img/hi-cnu.png" alt="logo">
                <form ref="form" @submit.prevent="onSubmit">
                    <b-form-input id="login-id" type="text" v-model="user_id" placeholder="ID" required></b-form-input>
                    <b-form-input id="login-pwd" type="password" v-model="user_pwd" placeholder="PASSWORD" required></b-form-input>
                    <b-form-checkbox id="login-check" type="checkbox" v-model="id_saved" size="lg">아이디 기억하기</b-form-checkbox>
                    <b-button type="submit" size="lg">로그인</b-button>
                </form>
            </div>
        </div>
  </b-container>
</template>

<script>
export default {
	name: "login",
	data() {
		return {
			user_id: "",
			user_pwd: "",
			id_saved: false
		};
	},
	computed: {
		errorAlert(){
			return this.$store.state.main.popup;
		}
	},
	watch: {
		errorAlert(msg){
			if(msg === null) {return;}
			this.onOpenErrorBox(msg);
		}
	},
	created() {
		const session = this.$cookies.get("4_session");
		if(session) {
			this.redirect();
			return ;
		}

		const remember_id = this.$cookies.get("4_rememberid");
		this.id_saved = Boolean(remember_id);
		if(this.id_saved){
			this.user_id = remember_id;
		}
	},
	mounted() {
	},
	methods: {
		validEmail(email) {
			const regExr = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return regExr.test(email);
		},
		onSubmit() {
			this.$cookies.set("4_rememberid", this.user_id);
			this.$store.dispatch("users/logIn", {
				user_id: this.user_id,
				user_pwd: this.user_pwd
			});
		},
		redirect() {
			this.$router.push("/main/wait");
		},
		onOpenErrorBox(msg) {
			const text = this.$createElement("div", { domProps: { innerHTML: msg } });
			this.$bvModal.msgBoxOk(text, {
				size: "sm",
				buttonSize: "sm",
				okOnly: true,
				okVariant: "success",
				okTitle: "확인",
				hideHeaderClose: true,
				centered: true
			}).then(value => {
				this.$store.commit("main/setPopup", null);
			}).catch(err => {
				// An error occurred
			});
		}
	}
};
</script>

<style lang="scss">
.custom-control {
    text-align: right;
    font-size: setViewport('vw', 20);
    font-weight: 500;
    color: #00583d;
}
label[for="login-check"] {
    font-size: setViewport('vw', 20);
    height: setViewport('vw', 34);
    //height: setViewport('vh', 34);
    line-height: setViewport('vw', 34);
    //line-height: setViewport('vh', 34);
    font-weight: 500;
    color: #00583d;
    &::before, &::after {
        left: setViewport('vw', -44) !important;
        width: setViewport('vw', 34) !important;
        height: setViewport('vw', 34) !important;
        //height: setViewport('vh', 34) !important;
    }
}
</style>
<style lang="scss" scoped>
[class*="container"] {
    display: flex;
    height: 100vh;
    background: url('~/assets/img/bg-signin.png');
    background-size: cover;
}
.form_wrapper {
    // width: setViewport('vw', 540);
    // height: setViewport('vh', 610);
    margin: auto;
    border-radius: setRem(21);
    box-shadow: 0 setRem(10) setRem(40) 0 rgba(0, 0, 0, 0.3);
    background-color: #ffffff;
    .form_box {
        // width: 100%;
        // height: 100%;
        margin: setViewport('vh', 65) setViewport('vw', 55) setViewport('vh', 55) setViewport('vw', 54);

        img {
            width: 100%;
            display: block;
            margin: 0 auto setViewport('vh', 61);
        }
    }
    #login-id, 
    #login-pwd {
        width: 100%;
        height: setViewport('vh', 64);
        padding: setViewport('vh', 19) setViewport('vw', 10);
        margin-bottom: setViewport('vh', 18);
        border: 0;
        border-bottom: setRem(1) solid #e0e0e0;
        border-radius: 0;
        font-size: setViewport('vw', 24);
        font-weight: 500;
        color: #1c1c1c;
    }
    #login-pwd {
        margin-bottom: setViewport('vh', 32);
    }
    button {
        width: setViewport('vw', 430);
        height: setViewport('vh', 72);
        margin: setViewport('vh', 86) 0 0 setViewport('vw', 1);
        border-radius: setRem(36);
        font-size: setViewport('vw', 30);
        font-weight: 500;
        border-color: unset;
        background-color: #1c92eb;
        &:hover, &:focus, &:active {
            background-color: #00479d !important;
            border-color: unset;
            box-shadow: none !important;
        }
    }
}

</style>