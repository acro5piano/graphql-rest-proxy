module.exports = {
  testRegex: '.*\\.test\\.tsx?$',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@app(.*)$': '<rootDir>/src$1',
  },
  collectCoverage: false,
  coverageDirectory: './coverage/',
  collectCoverageFrom: ['<rootDir>/src/*.ts'],
  automock: false,
  testEnvironment: 'jsdom',
  testURL: 'http://localhost/',
  globals: {
    'ts-jest': {
      diagnostics: {
        warnOnly: true,
      },
    },
  },
}
