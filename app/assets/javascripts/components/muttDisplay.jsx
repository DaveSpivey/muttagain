import React from 'react';
import Select from 'react-select-plus';
import Slideshow from './Slideshow.jsx';
import GuessSelect from './GuessSelect.jsx';
import TopGuessDisplay from './TopGuessDisplay.jsx';

export default class MuttDisplay extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      slides: [{ photoUrl: '', muttId: null, muttName: '', muttGuesses: {} }],
      currentSlide: 0,
      currentGuess: null
    };

    this.handleFlip = this.handleFlip.bind(this);
    this.handleGuess = this.handleGuess.bind(this);
    this.getCurrentGuess = this.getCurrentGuess.bind(this);
    this.findMutt = this.findMutt.bind(this);
  }

  componentDidMount() {
    fetch('mutts', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })
    .then((response) => response.json())
    .then((data) => {
      this.setState({ slides: data.slides })
    })
    .catch((error) => {
      console.error(error)
    })
  }

  handleFlip(index) {
    this.setState({ currentSlide: index, currentGuess: null })
  }

  getCurrentGuess(selection) {
    this.setState({ currentGuess: selection })
  }

  findMutt(value) {
    const slideIndex = this.state.slides.findIndex((slide) => {
      return slide.muttName == value.label
    });
    this.setState({ currentSlide: slideIndex });
  }

  handleGuess() {
    const { slides, currentSlide, currentGuess } = this.state;
    const { breeds } = this.props;
    const currentMutt = slides[currentSlide];

    fetch(`/mutts/${ currentMutt.muttId }/guesses`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ breedId: currentGuess.value })
    })
    .then((response) => response.json())
    .then((data) => {
      const guessedBreed = breeds.find((breed) => {
        return breed.id == data.breed_id
      });
      this.setState({ currentGuess: null });
      this.displayGuessSuccess(guessedBreed);
    })
    .catch((error) => {
      console.error(error)
    })
  }

  displayGuessSuccess(guessedBreed) {
    // TODO - actually display this
    console.log("YOU GUESSED ", guessedBreed);
  }

  render() {
    const { slides, currentSlide } = this.state;
    const { breeds, mutts } = this.props;
    const currentMutt = slides[currentSlide];
    let options = [];
    slides.map((slide) => {
      if (slide.photoUrl) {
        options.push({ value: slide.muttId, label: slide.muttName })
      }
    });
    let muttSearchConfig = {
      placeholder: "Find a mutt by name..."
    };

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
          </div>
        </div>
      </div>
    );
  }
};
