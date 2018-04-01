import React from 'react';
import ReactDOM from 'react-dom';
import UserProfilePage from './UserProfilePage.jsx';

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('user-profile-page');
  const data = JSON.parse(node.getAttribute('data'));

  ReactDOM.render(
    <UserProfilePage userId={ data.user.id } 
    			           username={ data.user.username } 
    			           breeds={ data.profile } 
    			           mutts={ data.mutts } 
    			           profilePhotos={ data.profilePhotos } />,
    node
  );
});
