import React, { Component } from 'react';
import { bind } from 'bind-decorator';
import Modal from '../ui/Modal';

export default class PublicMuttPage extends Component {

  constructor(props) {
    super(props);

    this.state = { currentSelectedMutt: null };
  }

  @bind
  closeModal() {
    this.setState({ modalActive: false, currentSelectedMutt: null });
  }

  @bind
  getProfilePhoto() {
  	const { photos } = this.props;
  	if (photos.length) {
  		return photos.find(photo => photo.profile === true) || photos[0];
  	}
  	return;
  }

  @bind
  showPicDetail(index) {
    return () => {
      this.setState({ currentSelectedMutt: index });
    }
  }

  @bind
  getPhotoContainer() {
  	const { photos } = this.props;
  	const allPhotos = photos.map((photo, idx) => {
  		return (
        <div key={ idx } className="photo-image selectable-photo">
            <img src={ photo.smallUrl } onClick={ this.showPicDetail(idx) } />
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

  render() {
  	const { mutt, photos, guesses } = this.props;
    const { currentSelectedMutt } = this.state;

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
      <section className="photo-section">
        <h4>{ mutt.name }'s photos</h4>
        { this.getPhotoContainer() }
      </section>
    ) : undefined;

    const guessSection = Object.keys(guesses).length ? (
      <section className="guess-section">
        <h4>Users thought { mutt.name } was:</h4>
        { this.getGuessContainer() }
      </section>
    ) : undefined;

    const photoDetail = currentSelectedMutt !== null && photos[currentSelectedMutt] ? (
      <div style={{ width: "100%", textAlign: "center" }}>
        <img src={ photos[currentSelectedMutt].largeUrl } />
      </div>
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

        <Modal isActive={ currentSelectedMutt !== null } closeModal={ this.closeModal }>
          { photoDetail }
        </Modal>
  		</div>
	  );
  }
}
