module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2021: true
	},
	globals: {
		Atomics: "readonly",
		SharedArrayBuffer: "readonly"
	},
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
		//"prefer-const": [
		//	"error",
		//	{
		//		destructuring: "any",
		//		ignoreReadBeforeAssign: false
		//	}
		//],
		"no-lonely-if": "error",
		"comma-dangle": ["error", "never"],
		"generator-star-spacing": "off",
		curly: ["error", "all"],
		"require-await": "error",
		"dot-notation": "error",
		"no-useless-rename": "error"
	},
	ignorePatterns: ["node_modules/"]
};