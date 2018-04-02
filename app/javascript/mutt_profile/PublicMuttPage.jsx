import React, { Component } from 'react';
import PhotoViewModal from './PhotoViewModal.jsx';

export default class PublicMuttPage extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    $(document).foundation();
  }

  getProfilePhoto() {
  	const { photos } = this.props;
  	if (photos.length) {
  		return photos.find(photo => photo.profile === true) || photos[0];
  	}
  	return;
  }

  getPhotoContainer() {
  	const { photos } = this.props;
  	const allPhotos = photos.map((photo, idx) => {
  		return (
        <div key={ idx } className="photo-image">
          <a href="#" data-open={ `photo-view-modal-${photo.id}` } id={ `photo-${photo.id}` }>
            <img src={ photo.smallUrl } />
          </a>
          <PhotoViewModal mutt={ this.props.mutt } photo={ photo } />
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

  render() {
  	const { mutt, photos, guesses } = this.props;
  	let photoHeader = <div>No photos yet for this mutt</div>;
  	const profilePhoto = this.getProfilePhoto();

  	if (profilePhoto) {
  		photoHeader = (
  			<div className="profile-photo">
  				<img src={ profilePhoto.mediumUrl } />
  			</div>
		  );
  	}

    const photoSection = photos.length ? (
      <section className="photo-section large-8 medium-12 columns">
        <h4>{ mutt.name }'s photos</h4>
        { this.getPhotoContainer() }
      </section>
    ) : undefined;

    const guessSection = guesses.length ? (
      <section className="guess-section large-4 medium-12 columns">
        <h4>Users thought { mutt.name } was:</h4>
        { this.getGuessContainer() }
      </section>
    ) : undefined;

  	return (
  		<div className="mutt-profile">
  			<h1>{ mutt.name }</h1>
        <div className="profile-header">
  			 { photoHeader }
        </div>
        <div className="row mutt-details">
          { photoSection }
          { guessSection }
        </div>
  		</div>
	  );
  }
}
