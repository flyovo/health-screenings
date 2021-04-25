module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2021: true
	},
	extends: ["prettier", "plugin:vue/base"], // 추가
	plugins: ["prettier", "vue"], // 추가
	globals: {
		Atomics: "readonly",
		SharedArrayBuffer: "readonly"
	},
	parser: "vue-eslint-parser",
	rules: {
		"arrow-parens": ["error", "as-needed"],
		"comma-spacing": ["error", { before: false, after: true }],
		eqeqeq: "error",
		indent: ["error", "tab", { SwitchCase: 1 }],
		"linebreak-style": ["error", "unix"],
		"key-spacing": ["error", { beforeColon: false, afterColon: true }],
		"no-console": "off",
		"no-case-declarations": "error",
		"no-var": "error",
		quotes: ["error", "double"],
		"quote-props": ["error", "as-needed", { numbers: false }],
		semi: ["error", "always"],
		"space-before-function-paren": [
			"error",
			{ anonymous: "always", named: "never", asyncArrow: "always" }
		],
		"space-in-parens": ["error"],
		"space-infix-ops": ["error"],
		"object-curly-spacing": [
			"error",
			"always",
			{ arraysInObjects: true, objectsInObjects: true }
		],
		"operator-linebreak": [
			"error",
			"after",
			{ overrides: { "?": "after", ":": "after" } }
		],
		// plugin:vue/recommended 로 인한 디폴트값 변경 rule
		"no-unused-vars": [
			"off",
			{ vars: "all", args: "after-used", ignoreRestSiblings: false }
		],
		"prefer-const": [
			"error",
			{
				destructuring: "any",
				ignoreReadBeforeAssign: false
			}
		],
		"no-lonely-if": "error",
		"comma-dangle": ["error", "never"],
		"generator-star-spacing": "off",
		curly: ["error", "all"],
		"require-await": "error",
		"dot-notation": "error",
		"no-useless-rename": "error",
		// vue 확장자만 작동하는 lint
		"vue/no-parsing-error": [
			"error",
			{
				"x-invalid-end-tag": false
			}
		],
		"vue/no-multiple-template-root": "off",
		"vue/require-default-prop": "off",
		"vue/attributes-order": "off",
		"vue/html-self-closing": "off",
		"vue/prop-name-casing": "off",
		"vue/require-prop-types": "off",
		"vue/require-prop-types": "off",
		"vue/order-in-components": [
			//컴포넌트 order 순서
			"error",
			{
				order: [
					"el",
					"name",
					"parent",
					"functional",
					["delimiters", "comments"],
					["components", "directives", "filters"],
					"extends",
					"mixins",
					"inheritAttrs",
					"model",
					["props", "propsData"],
					"fetch",
					"asyncData",
					"data",
					"computed",
					"watch",
					"LIFECYCLE_HOOKS",
					"methods",
					"head",
					["template", "render"],
					"renderError"
				]
			}
		]
	},
	ignorePatterns: ["node_modules/"]
};