module.exports = {
    rootDir: './',
    testEnvironment: 'node',
    testMatch: [
        '**/tests/**/*.test.js'
    ],
    transform: {
        '^.+\\.js$': 'babel-jest'
    },
    verbose: true
}