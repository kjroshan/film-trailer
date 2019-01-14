module.exports = {
    moduleFileExtensions: ['js', 'jsx', 'json'],
    transform: {
      '^.+\\.(js|jsx)?$': 'babel-jest'
    },
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1'
    },
    testMatch: [
        '<rootDir>/src/(tests/**/*.test.(js|jsx|ts|tsx))'
    ],
    collectCoverage: true,
	collectCoverageFrom: [
        '<rootDir>/src/**/*.js',
        '!<rootDir>/src/index.js'
    ],
    transformIgnorePatterns: ['<rootDir>/node_modules/']
  };