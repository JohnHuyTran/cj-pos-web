// const esModules = ['@agm', 'ngx-bootstrap'].join('|');// ...module.exports = {//...transformIgnorePatterns: [`/node_modules/(?!${esModules})`],// ...};

module.exports = {
  testEnvironment: 'jsdom',
  // The root of your source code, typically /src
  // `<rootDir>` is a token Jest substitutes
  roots: ['<rootDir>/src'],

  // Jest transformations -- this adds support for TypeScript
  // using ts-jest
  transform: {
    // '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  coveragePathIgnorePatterns: ['/node_modules/'],
  // transformIgnorePatterns: [`node_modules/*`],
  // transformIgnorePatterns: ['node_modules/(?!(dateformat)/)'],
  // transformIgnorePatterns: ['node_modules/(?!(react-redux)/)'],
  // transformIgnorePatterns: ['node_modules/(?!(pdfjs-dist)/)'],

  // Runs special logic, adding special
  // extended assertions to Jest
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],

  // Test spec file resolution pattern
  // Matches parent folder `__tests__` and filename
  // should contain `test` or `spec`.
  // testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  // testRegex: '.*\\.(test|spec)\\.tsx?$',
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.tsx?$',

  // Module file extensions for importing
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    'react-pdf/dist/esm/entry.webpack': 'react-pdf',
  },
  collectCoverageFrom: ['src/test/*.{js,jsx,ts,tsx,mjs}'],
};
