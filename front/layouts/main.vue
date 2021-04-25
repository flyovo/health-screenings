<template>
  <b-container fluid>
    <b-row>
      <div class="nav-wrapper">
        <nav-bar />
      </div>
      <div class="main-wrapper">
        <div class="main">
          <header> {{ $store.state.navTitle }} </header>
          <Nuxt />
        </div>
      </div>
    </b-row>
  </b-container>
</template>

<script>
import NavBar from "~/components/NavBar.vue";
export default {
	components: {
		NavBar
	},
	created() {
		if(this.$store.state.navTitle === ""){
			this.$store.commit("setNavTitle", this.$store.state.navList[0].title);
		}
	}
};
</script>

<style lang="scss">
[class*="container"] {
  display: flex;
  height: 100vh;
  padding-right: 0;
  padding-left: 0;
}
.row {
  width: 100vw;
  margin-right: 0;
  margin-left: 0;

  .nav-wrapper {
    width: setViewport('vw', 378);
  }
  .main-wrapper {
    width: calc(100% - #{setViewport('vw', 378)}); //setViewport('vw', 1542);
    background-color: #f7f7f7;
    padding-right: 0;
    padding-left: 0;
    .main {
      width: 100%;
      height: 100%;
      padding: 0 setRem(30) setRem(30);
      display: flex;
      flex-flow: column;
      header {
        height: setViewport('vh', 110);
        font-size: setViewport('vw', 48);
        font-weight: bold;
        letter-spacing: setViewport('vw', -1.2);
        line-height: setViewport('vh', 110);
        text-align: left;
        color: #00479d;
      }
    }
  }
}
[class*=col]{
  padding-right: 0;
  padding-left: 0;
}
</style>
