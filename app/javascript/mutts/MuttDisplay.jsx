import React from 'react';
import Select from 'react-select-plus';
import Slideshow from './Slideshow.jsx';
import GuessSelect from './GuessSelect.jsx';
import TopGuessDisplay from './TopGuessDisplay.jsx';

export default class MuttDisplay extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentSlide: 0,
      currentGuess: null,
      mostRecentGuess: null
    };

    this.handleFlip = this.handleFlip.bind(this);
    this.handleGuess = this.handleGuess.bind(this);
    this.getCurrentGuess = this.getCurrentGuess.bind(this);
    this.getMostRecentGuess = this.getMostRecentGuess.bind(this);
    this.findMutt = this.findMutt.bind(this);
  }

  handleFlip(index) {
    this.setState({ currentSlide: index, currentGuess: null })
  }

  getCurrentGuess(selection) {
    this.setState({ currentGuess: selection })
  }

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

  findMutt(value) {
    const slideIndex = this.props.slides.findIndex((slide) => {
      return slide.muttName == value.label
    });
    this.setState({ currentSlide: slideIndex });
  }

  handleGuess() {
    const { currentSlide, currentGuess } = this.state;
    const { breeds, slides } = this.props;
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

  displayGuessSuccess(guessedBreed, guessesLeft) {
    this.setState({ mostRecentGuess: guessedBreed });
  }

  displayGuessFailure(data) {
    if (data.guesses_left) {
      this.setState({ mostRecentGuess: "Sorry, you've used all 3 guesses." });
    } else {
      console.log("error:", data);
      this.setState({ mostRecentGuess: "Unexpected problem: unable to guess." });
    }
  }

  render() {
    const { currentSlide } = this.state;
    const { breeds, mutts, slides } = this.props;
    const currentMutt = slides[currentSlide];

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

    if (currentMutt) {
      return (
        <div className="mutt-display-content">
          <div className="row slide-row">
            <div className="slideshow-wrapper large-9 medium-12 columns">
              <Slideshow slides={ slides }
                         currentSlide={ currentSlide }
                         handleFlip={ this.handleFlip } />
            </div>
            <div className="current-mutt-section large-3 medium-12 columns">
              <Select className="mutt-search-input"
                      options={ options }
                      { ...muttSearchConfig }
                      value={ '' }
                      onChange={ this.findMutt } />
              <TopGuessDisplay muttId={ currentMutt.muttId }
                               guesses={ currentMutt.muttGuesses } />
            </div>
          </div>
          <div className="row guess-row">
            <div className="guess-select medium-9 small-12 columns">
              <GuessSelect breeds={ breeds }
                           muttId={ currentMutt.muttId }
                           handleGuess={ this.handleGuess }
                           currentGuess={ this.state.currentGuess }
                           getCurrentGuess={ this.getCurrentGuess } />
              { mostRecentGuess }
            </div>
          </div>
        </div>
      );
    } else {
      return <div className="mutt-display-content">No mutts yet!</div>;
    }
  }
};
