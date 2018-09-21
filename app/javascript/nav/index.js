import React from 'react';
import ReactDOM from 'react-dom';
import NavBar from './NavBar.jsx';

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('nav-bar');
  const data = JSON.parse(node.getAttribute('data'));

  	ReactDOM.render(
      <NavBar loggedIn={ data.loggedIn } 
              currentUser={ data.currentUser } />,
    node
  );
});
