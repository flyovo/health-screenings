const serverIp = process.env.NODE_ENV === "production" ? "http://192.168.10.39:3085" : "http://localhost:3085";
export default {
	// Global page headers: https://go.nuxtjs.dev/config-head
	head: {
		title: "세종충남대학교병원",
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
		// { src: "~/plugins/socket.client.js" },
		// Add plugins that should only run in production.
		...(process.env.NODE_ENV === "production" ? 
			[ { src: "~/plugins/socket.client.js" } ] : 
			[ { src: "~/plugins/socket.dev.client.js" } ]
		)
	],

	// Auto import components: https://go.nuxtjs.dev/config-components
	components: true,

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
	],

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: [
		// https://go.nuxtjs.dev/bootstrap
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

	//serverMiddleware: [
	//	{ path: "/api", handler: "~/api/index.js" }
	//],

	axios: { // BACK-END API IP
		browserBaseURL: serverIp,
		baseURL: serverIp,
		https: false
	},
	
	trailingSlash: true,

	server: {
		host: "0.0.0.0",
		port: process.env.PORT || 3000,
		timing: false
	}
};
