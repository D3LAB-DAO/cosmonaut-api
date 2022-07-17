/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testTimeout: 10000,
    moduleNameMapper: {
        '^@d3lab/(.*)$': '<rootDir>/src/$1',
    }
};