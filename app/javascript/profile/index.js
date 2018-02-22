import React from 'react';
import ReactDOM from 'react-dom';
import ProfilePage from './ProfilePage.jsx';

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('profile-page');
  const data = JSON.parse(node.getAttribute('data'));

  ReactDOM.render(
    <ProfilePage userId={ data.user.id } userName={ data.user.name } breeds={ data.profile } mutts={ data.mutts } profilePhotos={ data.profilePhotos } />,
    node
  );
});
