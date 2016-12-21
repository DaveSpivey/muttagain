import React from 'react';
import ReactDOM from 'react-dom';

export default class Carousel extends React.Component {

  render() {
    const { photoUrl, muttName } = this.props;
    return (
      <div>
        <img src={ photoUrl } />
        <h3>{ muttName }</h3>
      </div>
    );
  }
};