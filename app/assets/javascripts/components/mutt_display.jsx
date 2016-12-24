import React from 'react';
import ReactDOM from 'react-dom';
import Slider from 'react-slick';
import GuessBox from './guess_box.jsx';

export default class MuttDisplay extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      slides: [{ photoUrl: '', muttName: '' }],
      currentSlide: 0
    };

    this.handleFlip = this.handleFlip.bind(this);
    this.handleGuess = this.handleGuess.bind(this);
    this.slideshowSettings = {
      dots: false,
      afterChange: this.handleFlip
    };
  }

  componentDidMount() {
    $.ajax({
      url: "/mutts",
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({ slides: data.photos });
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
    const box = document.getElementById("guess-box");
    const breedId = box.options[box.selectedIndex].value;
    const { slides, currentSlide } = this.state;
    const currentMutt = slides[currentSlide];
    const { breeds } = this.props;

    $.ajax({
      type: "POST",
      url: "/mutts/" + currentMutt.muttId + "/guesses",
      data: { breedId: breedId },
      success: function(data) {
        console.log("data", data);
        const guessedBreed = breeds.filter((breed) => {
          return breed.id == data.breed_id
        })
        console.log("guessedBreed", guessedBreed);
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

    const slideshow = slides.map((slide, idx) => {
      return <div key={idx}><img src={slide.photoUrl} /></div>
    });

    return (
      <div>
        <div className="row">
          <div className="slideshow small-8 small-offset-2 columns">
            <Slider { ...this.slideshowSettings }>
              { slideshow }
            </Slider>
            <h3 className="mutt-name">{ currentMutt.muttName }</h3>
          </div>
        </div>
        <div className="row">
          <div className="small-3 small-offset-9 columns">
            <GuessBox breeds={ breeds }
                      muttId={ currentMutt.muttId }
                      handleGuess={ this.handleGuess } />
          </div>
        </div>
      </div>
    );
  }
};
