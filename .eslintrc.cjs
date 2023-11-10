/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['@remix-run/eslint-config', '@remix-run/eslint-config/node'],
  plugins: ['prettier'],
  rules: {
    quotes: [2, 'single', { avoidEscape: true }],
    'prettier/prettier': ['error', { jsxSingleQuote: false }]
  }
};
