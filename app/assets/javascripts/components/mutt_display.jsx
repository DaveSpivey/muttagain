import React from 'react';
import ReactDOM from 'react-dom';
// import Carousel from './carousel.jsx';
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
    console.log('index', index);
    this.setState({ currentSlide: index })
  }

  render() {
    const { slides, currentSlide } = this.state;
    const { breeds } = this.props;
    const currentMutt = slides[currentSlide];
    console.log("currentMutt", currentMutt);
    const settings = {
      dots: true,
      afterChange: this.handleFlip
    };
    const slideshow = slides.map((slide, idx) => {
      return <div key={idx}><img src={slide.photoUrl} /></div>
    })
    console.log('currentMutt', currentMutt);

    return (
      <div>
        <div className="slideshow">
          <Slider {...settings}>
            { slideshow }
          </Slider>
        </div>
        <div>
          <GuessBox breeds={ breeds }
                    muttId={ currentMutt.muttId } />
        </div>
      </div>
    );
  }
};
// <Carousel photoUrl={ currentMutt.photoUrl }
                  // muttName={ currentMutt.muttName } />
        //           <a href='#' id='previous' onClick={ this.handleFlip }>Previous</a>
        // <a href='#' id='next' onClick={ this.handleFlip }>Next</a>