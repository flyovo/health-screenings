<template>
    <div class="nav">
        <nuxt-link class="logo" to="" replace>
            <img src="~/assets/img/logo-4cgate.png" alt="logo">
        </nuxt-link>
        <nav>
            <a class="user_info" href="" @click="onLogOut">
                <span>
                    <div class="user_name">{{ $store.state.users.me.USER_NM }}</div>
                    <div class="user_auth">{{ setAdmin }}</div>
                </span>
            </a>
            <nuxt-link v-for="(nav, key) in $store.state.navList" :key="key" :to="`/main/${nav.key}`" @click.native="$store.commit('setNavTitle', nav.title)"> 
                {{ nav.title }} 
            </nuxt-link>
        </nav>
    </div>
</template>

<script>
export default {
	name: "NavBar",
	middleware: "anonymous",
	computed: {
		setAdmin() {
			return Boolean(this.$store.state.users.me.ADMIN) ? "Administator" : "";
		}
	},
	methods: {
		onLogOut() {
			this.$cookies.remove("4_session");
			this.$store.dispatch("users/logOut");
		}
	}
};
</script>
<style lang="scss" scoped>
.nav {
    height: 100%;
    background-color: #00479d;
    .logo {
        width: 100%;
        height: setViewport('vh', 110);
        line-height: setViewport('vh', 110);
        background-color: #ffffff;
        text-align: center;
        padding: 0 1.56vw;
        img {
            width: 60%;
        }
    }
    nav {
        width: 100%;
        height: calc(100% - #{setViewport('vh', 110)});
        a {
            text-decoration: none;
            &:not(.user_info) {
                display: inline-block;
                width: 100%;
                height: setViewport('vh', 99);
                line-height: setViewport('vh', 99);
                padding: 0 setRem(29);
                background-color: #00479d;
                font-size: setViewport('vw', 27);
                font-weight: 500;
                letter-spacing: setViewport('vw', -0.68);
                text-align: left;
                color: #ffffff;
                border-top: 1px solid rgba(255, 255, 255, 0.2);
                
                &.hover, &.active, &[class*=link-active] {
                    background-color: #1c92eb;
                }
            }
            &.user_info {
                display: flex;
                background: url('~/assets/img/ico-logout.svg') no-repeat 92% 50%;
                background-size: setViewport('vw', 34);
                padding: setViewport('vh', 20) setViewport('vw', 28) setViewport('vh', 22) setViewport('vw', 21);
                span {
                    .user_name {
                        font-size: setViewport('vw', 36);
                        font-weight: bold;
                        letter-spacing: setViewport('vw', -0.9);
                        text-align: left;
                        color: #ffffff;
                        margin-bottom: setRem(6);
                    }
                    .user_auth {
                        font-size: setViewport('vw', 18);
                        font-weight: normal;
                        font-stretch: normal;
                        font-style: normal;
                        line-height: normal;
                        letter-spacing: normal;
                        text-align: left;
                        opacity: 0.7;
                        color: #ffffff;
                    }
                }
            }
        }
    }
}
</style>