import React from 'react';
import ReactDOM from 'react-dom';
// import Slider from 'react-slick';
import Slideshow from './Slideshow.jsx';
import GuessSelect from './GuessSelect.jsx';
import GuessDisplay from './GuessDisplay.jsx';

export default class MuttDisplay extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      slides: [{ photoUrl: '', muttName: '', muttGuesses: {} }],
      currentSlide: 0
    };

    this.handleFlip = this.handleFlip.bind(this);
    this.handleGuess = this.handleGuess.bind(this);
  }

  componentDidMount() {
    $.ajax({
      url: "/mutts",
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({ slides: data.slides });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
  }

  handleFlip(index) {
    this.setState({ currentSlide: index })
  }

  handleGuess() {
    const selector = document.getElementById("guess-select-input");
    const breedId = selector.options[selector.selectedIndex].value;
    const { slides, currentSlide } = this.state;
    const currentMutt = slides[currentSlide];
    const { breeds } = this.props;

    $.ajax({
      type: "POST",
      url: `/mutts/${ currentMutt.muttId }/guesses`,
      data: { breedId: breedId },
      success: function(data) {
        const guessedBreed = breeds.find((breed) => {
          return breed.id == data.breed_id
        })
      },
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }
    });
  }

  render() {
    const { slides, currentSlide } = this.state;
    const { breeds } = this.props;
    const currentMutt = slides[currentSlide];

    return (
      <div className="mutt-display-content">
        <div className="row slide-row">
          <div className="slideshow-wrapper large-9 medium-12 columns">
            <Slideshow slides={ slides }
                       currentSlide={ currentSlide }
                       handleFlip={ this.handleFlip } />
          </div>
          <div className="guess-display-section large-3 medium-12 columns">
            <GuessDisplay muttId={ currentMutt.muttId }
                          guesses={ currentMutt.muttGuesses } />
          </div>
        </div>
        <div className="row guess-row">
          <div className="guess-select medium-9 small-12 columns">
            <GuessSelect breeds={ breeds }
                         muttId={ currentMutt.muttId }
                         handleGuess={ this.handleGuess } />
          </div>
        </div>
      </div>
    );
  }
};
