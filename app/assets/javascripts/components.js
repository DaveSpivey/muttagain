require( 'babel-polyfill' );

// Manually add components to window and global
// so that react_ujs and react-server can find them and render them.
window.MuttDisplay = global.MuttDisplay = require("./components/muttDisplay.jsx").default