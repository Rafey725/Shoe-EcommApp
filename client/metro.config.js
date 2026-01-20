const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Disable expo-cli node externals shim that creates invalid Windows paths
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
