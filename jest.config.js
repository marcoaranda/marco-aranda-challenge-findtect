/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/server.ts',
    '!src/infrastructure/scripts/**/*.ts'
  ],
  maxWorkers: 1,
  testTimeout: 10000,
  setupFilesAfterEnv: ['./test/setup.ts']
}; 