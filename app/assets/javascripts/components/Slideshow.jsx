import React from 'react';
import ReactDOM from 'react-dom';
import Slider from 'react-slick';

export default class Slideshow extends React.Component {

  constructor(props) {
    super(props);

    this.slideshowSettings = {
      dots: false,
      afterChange: this.props.handleFlip,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />
    };
  }

  render() {
    const { slides, currentSlide } = this.props;
    const currentMutt = slides[currentSlide];

    const slideshow = slides.map((slide, idx) => {
      return <div key={ idx }><img src={ slide.photoUrl } /></div>
    });

    return (
      <div className="slideshow">
        <a href={ `/mutts/${ currentMutt.muttId }` }>
          <Slider { ...this.slideshowSettings }>
            { slideshow }
          </Slider>
          <h4 className="mutt-name">{ currentMutt.muttName }</h4>
        </a>
      </div>
    );
  }
}

class NextArrow extends React.Component {
  render() {
    return (
      <div {...this.props}>
        <img src="../images/nextArrow.png" />
      </div>
    );
  }
}

class PrevArrow extends React.Component {
  render() {
    return (
      <div {...this.props}>
        <img src="../images/prevArrow.png" />
      </div>
    );
  }
}