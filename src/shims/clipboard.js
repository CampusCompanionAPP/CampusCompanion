const ExpoClipboard = require("expo-clipboard");

const Clipboard = {
  getString: () => ExpoClipboard.getStringAsync(),
  setString: (content) => {
    ExpoClipboard.setStringAsync(content);
  },
  addListener: () => ({ remove: () => {} }),
  removeAllListeners: () => {},
};

module.exports = Clipboard;
module.exports.default = Clipboard;
module.exports.Clipboard = Clipboard;
