require( 'babel-polyfill' );

// Manually add components to window and global
// so that react_ujs and react-server can find them and render them.
window.MuttDisplay = global.MuttDisplay = require("./components/MuttDisplay.jsx").default
window.ProfilePage = global.ProfilePage = require("./components/ProfilePage.jsx").default