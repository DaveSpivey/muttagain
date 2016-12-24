const React = require('react');
const ReactDOM = require('react-dom');

const init = (global, dom) => {
  const CLASS_NAME_ATTR = 'data-react-class';
  const PROPS_ATTR = 'data-react-props';

  const all = dom.querySelectorAll('[data-react-class]');

  [].forEach.call(all, (component) => { // querySelectorAll returns a NodeList not an Array
    const name = component.getAttribute(CLASS_NAME_ATTR);
    const props = component.getAttribute(PROPS_ATTR);
    const parsed = JSON.parse(props);
    const constructor = name
      .split('.')
      .reduce((obj, index) => obj[index], global);

    if (!constructor) {
      console.error('Error: Could not find React component ', name);
      return;
    }

    ReactDOM.render(React.createElement(constructor, parsed), component);
  });
};

module.exports = {
  init,
};

document.addEventListener('DOMContentLoaded', init.bind(this, window, document));