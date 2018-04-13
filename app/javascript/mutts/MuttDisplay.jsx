import React from 'react';
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

    this.updateSlides = this.updateSlides.bind(this);
    this.handleFlip = this.handleFlip.bind(this);
    this.handleGuess = this.handleGuess.bind(this);
    this.getCurrentGuess = this.getCurrentGuess.bind(this);
    this.getMostRecentGuess = this.getMostRecentGuess.bind(this);
    this.getUserGuesses = this.getUserGuesses.bind(this);
    this.undoGuess = this.undoGuess.bind(this);
    this.findMutt = this.findMutt.bind(this);
  }

  componentWillMount() {
    this.setState({ slides: this.props.slides });
  }

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

  handleFlip(index) {
    this.setState({ currentSlide: index, currentGuess: null, mostRecentGuess: null })
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
    const slideIndex = this.state.slides.findIndex((slide) => {
      return slide.muttName == value.label
    });
    this.setState({ currentSlide: slideIndex });
  }

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
            <div className="stock-pic"><span style={{ marginRight: "6rem" }}></span></div>
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
          newSlide.userGuesses = data;
        }
        return newSlide;
      });

      this.setState({ slides: newSlides, mostRecentGuess: null });
    })
    .catch((error) => {
      console.error(error)
    })
  }

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

    let selectColumns, userGuessDisplay;
    if (userGuesses.length) {
      selectColumns = 4;
      userGuessDisplay = (
        <div className="user-guesses large-4 medium-12 columns">
          <h5>Your guesses:</h5>
          { this.getUserGuesses(userGuesses) }
        </div>
      );
    } else {
      selectColumns = 8;
    }

    if (currentMutt) {
      return (
        <div className="mutt-display-content">
          <div className="row search-row">
            <Select className="mutt-search-input large-5 medium-12 columns"
                    options={ options }
                    { ...muttSearchConfig }
                    value={ '' }
                    onChange={ this.findMutt } />
          </div>
          <div className="row slide-row">
            <div className="slideshow-wrapper">
              <Slideshow slides={ slides }
                         currentSlide={ currentSlide }
                         handleFlip={ this.handleFlip } />
            </div>
          </div>
          <div className="row guess-row">
            <div className={ `guess-select large-${selectColumns} medium-12 columns` }>
              <GuessSelect breeds={ breeds }
                           muttId={ currentMutt.muttId }
                           handleGuess={ this.handleGuess }
                           currentGuess={ this.state.currentGuess }
                           getCurrentGuess={ this.getCurrentGuess } />
              { mostRecentGuess }
            </div>
            { userGuessDisplay }
            <div className="current-mutt-section all-guesses large-4 medium-12 columns">
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
