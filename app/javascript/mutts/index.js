import React from 'react';
import ReactDOM from 'react-dom';
import MuttDisplay from './MuttDisplay.jsx';

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('mutt-display');
  const data = JSON.parse(node.getAttribute('data'));

  ReactDOM.render(
    <MuttDisplay mutts={ data.mutts } breeds={ data.breeds } />,
    node
  );
});
