module.exports = {
  ignores: ["node_modules/"], // Ignore node_modules

  languageOptions: {
    ecmaVersion: "latest", // Use the latest ECMAScript version
    sourceType: "module", // Treat code as ES Modules
  },

  linterOptions: {
    reportUnusedDisableDirectives: true, // Warn if ESLint disable comments are unused
  },

  rules: {
    // "no-console": "warn", // Warn when console.log is used
    // semi: ["error", "always"], // Enforce semicolons
    // "quotes": ["error"], // Enforce double quotes
  },
};
