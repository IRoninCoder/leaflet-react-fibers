/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  moduleNameMapper: {
		'\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
		'\\.(gif|ttf|eot|svg|png|jpg)$': '<rootDir>/__mocks__/fileMock.js'
	},
  testEnvironment: 'jsdom',
};