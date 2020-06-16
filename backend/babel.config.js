module.exports = (api) => {
  api.cache(true);

  const presets = [
    [
      '@babel/preset-env',
      {
        targets: {node: '10'},
        loose: true
      }
    ]
  ];

  const plugins = [
    ['@babel/plugin-proposal-decorators', {legacy: true}],
    ['@babel/plugin-proposal-class-properties', {loose: true}]
  ];

  return {presets, plugins};
};
