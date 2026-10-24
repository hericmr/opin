module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { 
      presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }]], // mesmo runtime de JSX do Vite
      plugins: ['@babel/plugin-syntax-import-meta', require.resolve('./config/jest/babelPluginImportMetaEnv.js')]
    }],
  },
  // OpenLayers e dependências são publicados só como ESM: precisam passar pelo Babel
  transformIgnorePatterns: [
    '/node_modules/(?!(ol|rbush|quickselect|earcut|pbf|color-parse|color-rgba|color-name|color-space|geotiff|@petamoriken|zstddec)/)',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/index.jsx',
    '!src/reportWebVitals.js',
    '!src/setupTests.js',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}; 