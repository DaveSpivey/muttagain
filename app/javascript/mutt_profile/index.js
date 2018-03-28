import React from 'react';
import ReactDOM from 'react-dom';
import MuttProfilePage from './MuttProfilePage.jsx';

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('mutt-profile-page');
  const data = JSON.parse(node.getAttribute('data'));

  ReactDOM.render(
    <MuttProfilePage user={ data.user }
		           	 mutt={ data.mutt } 
		           	 photos={ data.photos } />,
    node
  );
});
