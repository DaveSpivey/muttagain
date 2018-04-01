import React, { Component } from 'react';

export default class PhotoViewModal extends Component {

  constructor(props) {
    super(props);

    this.closeModal = this.closeModal.bind(this);
  }

  closeModal() {
    const { photo } = this.props;
    $(`#photo-view-modal-${photo.id}`).foundation('close');
  }
  
  render() {
    const { mutt, photo } = this.props;
    return (
      <div className="reveal photo-display" id={ `photo-view-modal-${photo.id}` } data-reveal>
        <img src={ photo.largeUrl } />

        <button className="close-button"
                data-close={ `photo-view-modal-${photo.id}` }
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
