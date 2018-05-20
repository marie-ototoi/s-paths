// https://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    env: {
        es6: true,
        mocha: true
    },
    parser: "babel-eslint",
    parserOptions: {
        ecmaFeatures: {
            arrowFunctions: true,
            blockBindings: true,
            modules: true,
            jsx: true
        },
        ecmaVersion: 6
    },
    extends: [
        "standard",
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    rules: {
        "react/jsx-uses-vars": 1,
        "react/react-in-jsx-scope": 1,
        "no-unused-vars": 1,
        "no-console": process.env.NODE_ENV === 'production' ? 1 : 0,
        indent: ["error", 4]
    }
}
