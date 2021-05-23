<template>
<div :class="['card', setClass]" ref="roomCard" @click="onClick">{{ items.ROOM_NM }}</div>
</template>

<script>
export default {
	name: "RoomCard",
	props: {
		items: {
			type: Object,
			default: {}
		}
	},
	computed: {
		setClass() {
			let key = "";
			switch(this.items.STATUS) {
				case "0": 
				case "1": key = "white"; break;
				case "2": 
				case "5": key = "blue"; break;
				case "3": key = "pink"; break;
				case "4": 
				case "6": key = "gray"; break;
				default: break;
			}
			return key;
		}
	},
	mounted(){
		this.onResize();
		this.$nextTick(() => {
			window.addEventListener("resize", this.onResize);
		});
	},
	methods: {
		onResize() {
			const baseBox = 164 / 1920 * 100;
			const baseFont = 27 / 1920 * 100;
			const $el = this.$refs.roomCard;

			if($el === undefined || $el.offsetWidth === undefined) {return;}
			const realBox = $el.offsetWidth;
			const realFont = realBox / $el.innerText.length;
			if(Math.floor(baseBox / baseFont) > $el.innerText.length) {return;}
			this.$refs.roomCard.style.fontSize = `${realFont}px`;
		},
		onClick(){
			this.$emit("onItemClick", this.items);
		}
	}
};
</script>

<style lang="scss">
.card {
  width: setViewport('vw', 164);
  height: setViewport('vh', 66);
  line-height: setViewport('vh', 66);
  //padding: 0 setRem(15);
  margin: 0 setViewport('vw', 21) setViewport('vh', 11) 0;
  border-radius: setRem(10);
  font-size: setViewport('vw', 27);
  font-weight: 500;
  letter-spacing: setViewport('vw', -0.68);
  text-align: center;
  overflow: hidden;

  &.white{
    background-color: #f7fcff;
    color: #5c5c5c;
  }
  &.blue{
    background-color: #1c92eb;
    color: #ffffff;
  }
  &.pink{
    background-color: #eb1cda;
    color: #ffffff;
  }
  &.gray{
    background-color: #dedede;
    color: #5c5c5c;
  }
}
</style>
