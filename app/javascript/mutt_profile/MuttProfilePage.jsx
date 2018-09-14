import React, { Component } from 'react';
import { bind } from 'bind-decorator';
import Modal from '../ui/Modal';
import NewPhotoForm from './NewPhotoForm.jsx';
import EditPhotoForm from './EditPhotoForm.jsx';

export default class MuttProfilePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      muttName: "",
      photos: [],
      currentEditingPhoto: null,
      photoActionMessage: null,
      newPhotoModalActive: false,
      editPhotoModalActive: false
    };
  }

  componentWillMount() {
  	if (this.props.photos) {
    	this.setState({ muttName: this.props.mutt.name, photos: this.props.photos });
	  }
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.photoActionMessage !== null) {
      this.setState({ photoActionMessage: null });
    }
  }

  @bind
  openNewPhotoModal() {
    this.setState({ newPhotoModalActive: true });
  }

  @bind
  openEditPhotoModal(index) {
    return () => {
      this.setState({ editPhotoModalActive: true, currentEditingPhoto: index });
    }
  }

  @bind
  closeModal() {
    this.setState({ newPhotoModalActive: false, editPhotoModalActive: false, currentEditingPhoto: null });
  }

  @bind
  getProfilePhoto() {
  	const { photos } = this.state;
  	if (photos.length) {
  		return photos.find(photo => photo.profile === true) || photos[0];
  	}
  	return;
  }

  @bind
  updatePhotos(photos) {
    if (photos) {
      this.setState({ photos: photos });
    }
    this.closeModal();
  }

  @bind
  getPhotoContainer() {
  	const { photos } = this.state;
  	const allPhotos = photos.map((photo, idx) => {
  		return (
  			<div key={ idx } className="photo-image selectable-photo">
  				<img src={ photo.smallUrl } onClick={ this.openEditPhotoModal(idx) } />
  			</div>
  		);
  	});

  	return <div className="photo-container">{ allPhotos }</div>;
  }

  @bind
  getGuessContainer() {
    const { guesses } = this.props;

    const sortedGuesses = Object.keys(guesses).map((guessName) => {
      const currentGuess = guesses[guessName];
      return {
        name: guessName,
        link: currentGuess.link,
        pic: currentGuess.pic,
        frequency: currentGuess.frequency
      }
    }).sort((a, b) => {
      return b.frequency - a.frequency
    });

    const guessItems = sortedGuesses.map((guess) => {
      let breedDetail;
      if (guess.pic && guess.pic != "") {
        breedDetail = (
          <a href={ guess.link } target="_blank" className="link-group">
            <div className="stock-pic">
              <img src={ guess.pic } rel="stock photo for breed"/> 
            </div>
            <div className="breed-name"><span>{ guess.name }</span></div>
          </a>
        );
      } else {
        breedDetail = (
          <div className="link-group">
            <div className="stock-pic">
              <svg className="paw-icon" viewBox="0 0 640 640">
                <use xlinkHref="../images/paw-icon.svg#paw" />
              </svg>
            </div>
            <div className="breed-name"><span>{ guess.name }</span></div>
          </div>
        );
      }

      const frequency = guess.frequency === 1 ? "1 guess" : `${guess.frequency} guesses`;
      return (
        <div key={ guess.name } className="guess-item">
          { breedDetail }
          <div className="guess-frequency"><span className="frequency-text">{ frequency }</span></div>
        </div>
      );
    });

    return (
      <div className="guess-display">
        { guessItems }
      </div>
    );
  }

  @bind
  addNewPhoto(photos) {
    let actionMessage;
    if (photos) {
      actionMessage = "Photo uploaded successfully";
      this.setState({ photos: photos, photoActionMessage: actionMessage });
      this.closeModal();
    } else {
      actionMessage = "Uh oh, something went wrong uploading your photo";
      console.warn('Error adding new photo, response:', photo);
      this.setState({ photoActionMessage: actionMessage });
    }
  }

  render() {
  	const { mutt, guesses } = this.props;
  	const {
      muttName,
      photos,
      photoActionMessage,
      currentEditingPhoto,
      newPhotoModalActive,
      editPhotoModalActive
    } = this.state;

  	let photoHeader = <div>No photos yet for this mutt</div>;
  	const profilePhoto = this.getProfilePhoto();

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

    const photoSection = photos.length ? (
      <section className="photo-section">
        <h4>{ muttName }'s photos</h4>
        { this.getPhotoContainer() }
      </section>
    ) : undefined;

    const guessSection = Object.keys(guesses).length ? (
      <section className="guess-section">
        <h4>Users thought { muttName } was:</h4>
        { this.getGuessContainer() }
      </section>
    ) : undefined;

    const editForm = currentEditingPhoto !== null && currentEditingPhoto !== undefined
        ? <EditPhotoForm mutt={ this.props.mutt } photo={ photos[currentEditingPhoto] } updatePhotos={ this.updatePhotos } />
        : undefined;

  	return (
  		<div className="mutt-profile">
  			<h1>{ muttName }'s page</h1>
        <div className="profile-header">
    			{ photoHeader }
          <button className="button tiny mutton edit-button" onClick={ this.openNewPhotoModal }>
            Add a Photo
          </button>
        </div>
        { message }
        <div className="row mutt-details">
          { photoSection }
          { guessSection }
        </div>

        <Modal isActive={ editPhotoModalActive } closeModal={ this.closeModal }>
          { editForm }
        </Modal>

        <Modal isActive={ newPhotoModalActive } closeModal={ this.closeModal }>
          <NewPhotoForm muttName={ muttName }
                        muttId={ mutt.id }
                        addNewPhoto={ this.addNewPhoto } />
        </Modal>
  		</div>
	  );
  }
}
