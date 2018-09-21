import React from 'react';
import PropTypes from 'prop-types';
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentSlide != this.props.currentSlide) {
      this.slider.slickGoTo(nextProps.currentSlide);
    }
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
          <Slider { ...this.slideshowSettings }
                  ref={ (slider) => { this.slider = slider }} >
            { slideshow }
          </Slider>
          <h4 className="mutt-name">{ currentMutt.muttName }</h4>
        </a>
      </div>
    );
  }
}

const NextArrow = (props) => {
  return (
    <div className={ props.className }
         onClick={ props.onClick }
         style={ props.style }>
      <img src="../images/nextArrow.png" />
    </div>
  );
}

const PrevArrow = (props) => {
  return (
    <div className={ props.className }
         onClick={ props.onClick }
         style={ props.style }>
      <img src="../images/prevArrow.png" />
    </div>
  );
}

Slideshow.propTypes = {
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
  ),
  currentSlide: PropTypes.number,
  handleFlip: PropTypes.func
};

