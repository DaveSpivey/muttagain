import React, { Component } from 'react';
import NewPhotoModal from './NewPhotoModal.jsx';

export default class MuttProfilePage extends Component {

  constructor(props) {
    super(props);
    this.state = { muttName: "", photos: [], photoActionMessage: null };

    this.getProfilePhoto = this.getProfilePhoto.bind(this);
    this.getPhotoContainer = this.getPhotoContainer.bind(this);
    this.updatePhotos = this.updatePhotos.bind(this);
    this.addNewPhoto = this.addNewPhoto.bind(this);
  }

  componentWillMount() {
  	if (this.props.photos) {
    	this.setState({ muttName: this.props.mutt.name, photos: this.props.photos });
	  }
  }

  componentDidMount() {
    $(document).foundation();
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.photoActionMessage !== null) {
      this.setState({ photoActionMessage: null });
    }
  }

  getProfilePhoto() {
  	const { photos } = this.state;
  	if (photos.length) {
  		return photos.find(photo => photo.profile === true) || photos[0];
  	}
  	return;
  }

  updatePhotos(photos) {
    if (photos) {
      this.setState({ photos: photos });
    }
  }

  getPhotoContainer() {
  	const { photos } = this.state;
  	const allPhotos = photos.map((photo, idx) => {
  		return (
  			<div key={ idx } className="photo-image">
          <a href="#" data-open={ `photo-edit-modal-${photo.id}` } id={ `photo-${photo.id}` }>
  				  <img src={ photo.smallUrl } />
          </a>
          <PhotoEditModal mutt={ this.props.mutt } photo={ photo } updatePhotos={ this.updatePhotos } />
  			</div>
  		);
  	});

  	return <div className="photo-container">{ allPhotos }</div>;
  }

  addNewPhoto(photos) {
    let actionMessage;
    if (photos) {
      actionMessage = "Photo uploaded successfully";
      this.setState({ photos: photos, photoActionMessage: actionMessage });
    } else {
      actionMessage = "Uh oh, something went wrong uploading your photo";
      console.warn('Error adding new photo, response:', photo);
      this.setState({ photoActionMessage: actionMessage });
    }
  }

  render() {
  	const { mutt } = this.props;
  	const { muttName, photos, photoActionMessage } = this.state;
  	let photoHeader = <div>No photos yet for this mutt</div>;
  	const profilePhoto = this.getProfilePhoto();
  	const photoContainer = this.getPhotoContainer();

  	if (profilePhoto) {
  		photoHeader = (
  			<div className="profile-photo">
  				<img src={ profilePhoto.mediumUrl } />
  			</div>
		  );
  	}

    let message;
    if (photoActionMessage) {
      message = <div>{ photoActionMessage }</div>
    }

  	return (
  		<div className="mutt-profile">
  			<h1>{ muttName }'s page</h1>
  			{ photoHeader }
        <a href="#" data-open={ `new-photo-modal-${mutt.id}` }
           id={ `${mutt.id}-new-photo-button` }
           className="button tiny mutton edit-button"
        >
          Add a Photo
        </a>
        <NewPhotoModal muttName={ muttName }
                       muttId={ mutt.id }
                       addNewPhoto={ this.addNewPhoto } />
        { message }
  			<h3>{ muttName }'s photos</h3>
  			{ photoContainer }
  		</div>
	  );
  }
}

class PhotoEditModal extends Component {

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
      <div className="reveal" id={ `photo-edit-modal-${photo.id}` } data-reveal>
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
