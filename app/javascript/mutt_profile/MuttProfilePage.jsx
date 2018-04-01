import React, { Component } from 'react';
import NewPhotoModal from './NewPhotoModal.jsx';
import PhotoEditModal from './PhotoEditModal.jsx';

export default class MuttProfilePage extends Component {

  constructor(props) {
    super(props);
    this.state = { muttName: "", photos: [], photoActionMessage: null };

    this.getProfilePhoto = this.getProfilePhoto.bind(this);
    this.getPhotoContainer = this.getPhotoContainer.bind(this);
    this.getGuessContainer = this.getGuessContainer.bind(this);
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
            <div className="stock-pic"><span style={{ marginRight: "6rem" }}></span></div>
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
        <div className="profile-header">
    			{ photoHeader }
          <a href="#" data-open={ `new-photo-modal-${mutt.id}` }
             id={ `${mutt.id}-new-photo-button` }
             className="button tiny mutton edit-button"
          >
            Add a Photo
          </a>
        </div>
        <NewPhotoModal muttName={ muttName }
                       muttId={ mutt.id }
                       addNewPhoto={ this.addNewPhoto } />
        { message }
        <div className="row mutt-details">
          <section className="photo-section large-8 medium-12 columns">
    			  <h4>{ muttName }'s photos</h4>
    			  { this.getPhotoContainer() }
          </section>
          <section className="guess-section large-4 medium-12 columns">
            <h4>Users thought { muttName } was:</h4>
            { this.getGuessContainer() }
          </section>
        </div>
  		</div>
	  );
  }
}
