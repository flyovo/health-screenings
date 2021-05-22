require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

export default {
	// Global page headers: https://go.nuxtjs.dev/config-head
	head: {
		title: "4C gate",
		htmlAttrs: {
			lang: "ko"
		},
		meta: [
			{ charset: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ hid: "description", name: "description", content: "" }
		],
		link: [
			{ rel: "icon", type: "image/x-icon", href: "/ic_launcher.ico" }
		]
	},

	// Global CSS: https://go.nuxtjs.dev/config-css
	css: [
	],
	styleResources: {
		scss: [
			"~layouts/global.scss"
		]
	},
	
	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: [
		// Add plugins that should only run in production.
		"~/plugins/socket.client.js"
	],

	// Auto import components: https://go.nuxtjs.dev/config-components
	components: true,
		
	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
		["@nuxtjs/dotenv", { 
			filename: `.env.${process.env.NODE_ENV}` 
		}]
	],

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: [
		"bootstrap-vue/nuxt",
		"@nuxtjs/axios",
		"cookie-universal-nuxt",
		"@nuxtjs/style-resources"
	],

	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {
	},

	// 미들웨어에 접근인증을 위해 추가
	router: {
		middleware: "authenticated"
	},

	axios: { // BACK-END API IP
		browserBaseURL: `http://${process.env.API_HOST}:${process.env.API_PORT}`,
		baseURL: `http://${process.env.API_HOST}:${process.env.API_PORT}`,
		https: false
	},
	
	trailingSlash: true,

	server: {
		host: process.env.HOST || "0.0.0.0",
		port: process.env.PORT || 3000,
		timing: false
	}
};
