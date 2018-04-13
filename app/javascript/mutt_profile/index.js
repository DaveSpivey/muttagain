import React from 'react';
import ReactDOM from 'react-dom';
import MuttProfilePage from './MuttProfilePage.jsx';
import PublicMuttPage from './PublicMuttPage.jsx';

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('mutt-profile-page');
  const data = JSON.parse(node.getAttribute('data'));

  if (data.user && data.user.id === data.mutt.owner_id) {
  	ReactDOM.render(
      <MuttProfilePage user={ data.user }
	   	           	     mutt={ data.mutt }
	   	           	     guesses={ data.guesses } 
		           	       photos={ data.photos } />,
    node
  );
  } else {
  	ReactDOM.render(
      <PublicMuttPage mutt={ data.mutt }
	   	           	    guesses={ data.guesses }  
		           	      photos={ data.photos } />,
    node
  );
  }
});
