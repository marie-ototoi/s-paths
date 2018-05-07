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
            modules: true
        },
        ecmaVersion: 6
    },
    extends: "standard",
    rules: {
        "no-unused-vars": 1,
        "no-console": process.env.NODE_ENV === 'production' ? 1 : 0,
        indent: ["error", 4]
    }
}
