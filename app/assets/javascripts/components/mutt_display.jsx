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

  render() {
    const { slides, currentSlide } = this.state;
    const { breeds } = this.props;
    const currentMutt = slides[currentSlide];
    const slideshow = slides.map((slide, idx) => {
      return <div key={idx}><img src={slide.photoUrl} /></div>
    })
    console.log('currentMutt', currentMutt);
    const settings = {
      dots: false,
      afterChange: this.handleFlip
    };

    return (
      <div>
        <div className="row">
          <div className="slideshow small-8 small-offset-2 columns">
            <Slider {...settings}>
              { slideshow }
            </Slider>
            <h3 className="mutt-name">{ currentMutt.muttName }</h3>
          </div>
        </div>
        <div className="row">
          <div className="small-3 small-offset-9 columns">
            <GuessBox breeds={ breeds }
                      muttId={ currentMutt.muttId } />
          </div>
        </div>
      </div>
    );
  }
};
