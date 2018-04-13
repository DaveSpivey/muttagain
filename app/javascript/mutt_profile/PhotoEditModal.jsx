import React, { Component } from 'react';

export default class PhotoEditModal extends Component {

  constructor(props) {
    super(props);

    this.closeModal = this.closeModal.bind(this);
    this.makeEditRequest = this.makeEditRequest.bind(this);
    this.setAsProfile = this.setAsProfile.bind(this);
    this.deletePhoto = this.deletePhoto.bind(this);
  }

  closeModal() {
    const { photo } = this.props;
    $(`#photo-edit-modal-${photo.id}`).foundation('close');
  }

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
      this.closeModal();
    })
    .catch((error) => {
      console.error(error)
    })
  }

  setAsProfile() {
    this.makeEditRequest("PUT", { profile: true });
  }

  deletePhoto() {
    this.makeEditRequest("DELETE");
  }
  
  render() {
    const { mutt, photo } = this.props;
    return (
      <div className="reveal photo-display" id={ `photo-edit-modal-${photo.id}` } data-reveal>
        <img src={ photo.largeUrl } />
        <p className="lead">{ `Edit photo` }</p>

        <div className="button-multi">
          <button className="button tiny mutton edit-button" onClick={ this.setAsProfile }>
            Set as profile photo
          </button>
          <button className="button tiny mutton edit-button" onClick={ this.deletePhoto }>
            Delete this photo
          </button>
        </div>

        <button className="close-button"
                data-close={ `photo-edit-modal-${photo.id}` }
                aria-label="Close modal"
                type="button"
                onClick={ this.closeModal }
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );
  }
}
