import React from 'react';
import ReactDOM from 'react-dom';
import Carousel from './carousel.jsx';
import GuessBox from './guess_box.jsx';

export default class MuttDisplay extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      slides: [{ photoUrl: '', muttName: '' }],
      currentSlide: 0
    };

    this.handleFlip = this.handleFlip.bind(this);
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

  handleFlip(e) {
    let slideIndex = this.state.currentSlide;
    if (e.target.id == 'previous' && slideIndex > 0) {
      slideIndex --;
    } else if (e.target.id == 'next' && slideIndex < this.state.slides.length - 1) {
      slideIndex ++;
    };
    this.setState({ currentSlide: slideIndex })
  }

  render() {
    const { slides, currentSlide } = this.state;
    const { breeds } = this.props;
    const currentMutt = slides[currentSlide];
    console.log("currentMutt", currentMutt);
    return (
      <div>
        <Carousel photoUrl={ currentMutt.photoUrl }
                  muttName={ currentMutt.muttName } />
        <a href='#' id='previous' onClick={ this.handleFlip }>Previous</a>
        <a href='#' id='next' onClick={ this.handleFlip }>Next</a>
        <div>
          <GuessBox breeds={ breeds }
                    muttId={ currentMutt.muttId } />
        </div>
      </div>
    );
  }
};