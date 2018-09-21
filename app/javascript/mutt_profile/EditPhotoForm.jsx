import React, { Component } from 'react';
import { bind } from 'bind-decorator';

export default class EditPhotoForm extends Component {

  @bind
  makeEditRequest(method, requestData) {
    const { mutt, photo } = this.props;
    const requestAction = `../mutts/${mutt.id}/photos/${photo.id}`;
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    let request = { headers: headers, method: method };
    if (requestData) {
      request.body = JSON.stringify(requestData);
    }

    fetch(requestAction, request)
    .then((response) => response.json())
    .then((data) => {
      this.props.updatePhotos(data);
    })
    .catch((error) => {
      console.error(error)
    })
  }

  @bind
  setAsProfile() {
    this.makeEditRequest("PUT", { profile: true });
  }

  @bind
  deletePhoto() {
    this.makeEditRequest("DELETE");
  }
  
  render() {
    const { mutt, photo } = this.props;

    const content = photo ? (
      <div>
        <img src={ photo.largeUrl } />
        <p className="modal-header">Edit photo</p>

        <div className="button-multi">
          <button className="button tiny mutton edit-button" onClick={ this.setAsProfile }>
            Set as profile photo
          </button>
          <button className="button tiny mutton edit-button" onClick={ this.deletePhoto }>
            Delete this photo
          </button>
        </div>
      </div>
    ) : undefined;

    return (
      <div className="photo-display">
        { content }
      </div>
    );
  }
}
