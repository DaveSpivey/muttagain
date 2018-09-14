import React from 'react';
import { bind } from 'bind-decorator';
import PropTypes from 'prop-types';
import Select from 'react-select-plus';
import Slideshow from './Slideshow.jsx';
import GuessSelect from './GuessSelect.jsx';
import TopGuessDisplay from './TopGuessDisplay.jsx';

export default class MuttDisplay extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      slides: [],
      currentSlide: 0,
      currentGuess: null,
      mostRecentGuess: null
    };
  }

  componentWillMount() {
    this.setState({ slides: this.props.slides });
  }

  @bind
  updateSlides() {
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    fetch(`/mutts`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-Token': token
      },
      method: 'GET',
      credentials: 'same-origin'
    })
    .then((response) => response.json())
    .then((data) => {
      if (data && data.slides) {
        this.setState({ slides: data.slides });
      } else {
        console.warn("Could not update slides");
      }
    })
    .catch((error) => {
      console.error(error)
    })
  }

  @bind
  handleFlip(index) {
    this.setState({ currentSlide: index, currentGuess: null, mostRecentGuess: null })
  }

  @bind
  getCurrentGuess(selection) {
    this.setState({ currentGuess: selection })
  }

  @bind
  getMostRecentGuess() {
    const guessMessage = this.state.mostRecentGuess;
    if (guessMessage) {
      if (typeof guessMessage === 'string') {
        return <div className="you-guessed">{ guessMessage }</div>;
      } else {
        return (
          <div className="you-guessed">
            You guessed <a href={ guessMessage.link } target='_blank'>{ guessMessage.name }</a>
          </div>
        );
      }
    }
    return;
  }

  @bind
  findMutt(value) {
    const slideIndex = this.state.slides.findIndex((slide) => {
      return slide.muttName == value.label
    });
    this.setState({ currentSlide: slideIndex });
  }

  @bind
  getUserGuesses(guesses) {
    return guesses.map((guess) => {
      
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

      return (
        <div key={ guess.name } className="guess-item">
          { breedDetail }
          <div id={ `guess-undo-${guess.id}` } className="guess-undo" onClick={ this.undoGuess }>
            UNDO
          </div>
        </div>
      );
    });
  }

  @bind
  undoGuess(e) {
    const { slides, currentSlide } = this.state;
    const currentMutt = slides[currentSlide];
    const guessId = e.target.id.split("-")[2];
    const muttId = currentMutt.muttId;
    
    fetch(`/mutts/${muttId}/guesses/${guessId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "DELETE"
    })
    .then((response) => response.json())
    .then((data) => {
      const newSlides = slides.map((slide, idx) => {
        let newSlide = slide;
        if (idx === currentSlide) {
          const deletedGuessIndex = newSlide.userGuesses.findIndex(guess => guess.id == guessId);
          if (deletedGuessIndex !== -1) {
            newSlide.userGuesses.splice(deletedGuessIndex, 1);
          }
        }
        return newSlide;
      });

      this.setState({ slides: newSlides, mostRecentGuess: null });
    })
    .catch((error) => {
      console.error(error)
    })
  }

  @bind
  handleGuess() {
    const { slides, currentSlide, currentGuess } = this.state;
    const { breeds } = this.props;
    const currentMutt = slides[currentSlide];
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    fetch(`/mutts/${ currentMutt.muttId }/guesses`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-Token': token
      },
      method: 'POST',
      body: JSON.stringify({ breedId: currentGuess.value }),
      credentials: 'same-origin'
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.guesses_left !== undefined && data.guesses_left >= 0) {
        const guessedBreed = breeds.find((breed) => {
          return breed.id == data.guess.breed_id;
        });
        this.updateSlides();
        this.displayGuessSuccess(guessedBreed, data.guesses_left);
      } else {
        this.displayGuessFailure(data);
      }

      this.setState({ currentGuess: null });
    })
    .catch((error) => {
      console.error(error)
    })
  }

  @bind
  displayGuessSuccess(guessedBreed, guessesLeft) {
    this.setState({ mostRecentGuess: guessedBreed });
  }

  @bind
  displayGuessFailure(data) {
    if (data.guesses_left) {
      this.setState({ mostRecentGuess: "Sorry, you've used all 3 guesses." });
    } else {
      console.log("error:", data);
      this.setState({ mostRecentGuess: "Unexpected problem: unable to guess." });
    }
  }

  render() {
    const { slides, currentSlide } = this.state;
    const { breeds, mutts } = this.props;
    const currentMutt = slides[currentSlide];
    const { userGuesses } = currentMutt;

    let options = [];
    mutts.forEach((mutt) => {
      const muttSlide = slides.findIndex(slide => slide.muttId === mutt.id);
      if (muttSlide >= 0) {
        options.push({ value: slides[muttSlide].muttId, label: mutt.name })
      }
    });
    let muttSearchConfig = {
      placeholder: "Find a mutt by name..."
    };

    const mostRecentGuess = this.getMostRecentGuess();

    let sectionCount, userGuessDisplay;
    if (userGuesses.length) {
      sectionCount = "three";
      userGuessDisplay = (
        <div className="user-guesses">
          <h5>Your guesses:</h5>
          { this.getUserGuesses(userGuesses) }
        </div>
      );
    } else {
      sectionCount = "two";
    }

    if (currentMutt) {
      return (
        <div className="mutt-display-content">
          <div className="search-row">
            <Select className="mutt-search-input"
                    options={ options }
                    { ...muttSearchConfig }
                    value=""
                    onChange={ this.findMutt } />
          </div>
          <div className="slide-row">
            <div className="slideshow-wrapper">
              <Slideshow slides={ slides }
                         currentSlide={ currentSlide }
                         handleFlip={ this.handleFlip } />
            </div>
          </div>
          <div className="guess-row">
            <div className={ `guess-select ${sectionCount}-section` }>
              <GuessSelect breeds={ breeds }
                           muttId={ currentMutt.muttId }
                           handleGuess={ this.handleGuess }
                           currentGuess={ this.state.currentGuess }
                           getCurrentGuess={ this.getCurrentGuess } />
              { mostRecentGuess }
            </div>
            { userGuessDisplay }
            <div className="current-mutt-section all-guesses">
              <TopGuessDisplay muttId={ currentMutt.muttId }
                               guesses={ currentMutt.muttGuesses } />
            </div>
          </div>
        </div>
      );
    } else {
      return <div className="mutt-display-content">No mutts yet!</div>;
    }
  }
};

MuttDisplay.propTypes = {
  mutts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    })
  ),
  breeds: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    })
  ),
  slides: PropTypes.arrayOf(
    PropTypes.shape({ 
      photoId: PropTypes.number, 
      photoUrl: PropTypes.string, 
      muttId: PropTypes.number, 
      muttName: PropTypes.string, 
      muttGuesses: PropTypes.shape({
        link: PropTypes.string,
        pic: PropTypes.string,
        frequency: PropTypes.number
      }),
      userGuesses: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          name: PropTypes.string,
          link: PropTypes.string,
          pic: PropTypes.string
        })
      )
    })
  )
};
