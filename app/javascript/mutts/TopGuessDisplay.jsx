import React from 'react';
import { bind } from 'bind-decorator';
import PropTypes from 'prop-types';

export default class TopGuessDisplay extends React.Component {

  detail;

  constructor() {
    super();
    this.state = { hidden: true };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.muttId != this.props.muttId) {
      this.setState({ hidden: true });
    }
  }

  @bind
  getTopGuesses(guesses) {
    const guessList = Object.keys(guesses).map((guessName) => {
      const currentGuess = guesses[guessName];
      return {
        name: guessName,
        link: currentGuess.link,
        pic: currentGuess.pic,
        frequency: currentGuess.frequency
      }
    });
    const topGuesses = guessList.sort((a, b) => {
      return b.frequency - a.frequency
    }).slice(0, 3);

    return topGuesses.map((guess) => {
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
            <div className="stock-pic">
              <svg className="paw-icon" viewBox="0 0 640 640">
                <use xlinkHref="../images/paw-icon.svg#paw" />
              </svg>
            </div>
            <div className="breed-name"><span>{ guess.name }</span></div>
          </div>
        );
      }

      const frequency = guess.frequency === 1 ? "1 guess" : `${guess.frequency} guesses`;
      return (
        <div key={ guess.name } className="guess-item">
          { breedDetail }
          <div className="guess-frequency"><span className="frequency-text">{ frequency }</span></div>
        </div>
      );
    });
  }

  @bind
  getGuessDetailHeight() {
    if (this.detail !== undefined) {
      const detailDimensions = this.detail.getBoundingClientRect();
      const paddingTop = 16;
      return detailDimensions.height + paddingTop;
    } else {
      return 0;
    }
  }

  @bind
  setGuessDetailRef(detail) {
    this.detail = detail;
  }

  @bind
  toggleVisibility() {
    this.setState({ hidden: !this.state.hidden });
  }

  render() {
    const { muttId, guesses } = this.props;
    const { hidden } = this.state;
    const hasGuesses = Object.keys(guesses).length > 0;
    let displayStyle = { height: "auto" };

    let displayClasses = ["guess-display"];
    let displayHeight = 34;

    if (hidden) {
      displayClasses.push("guess-display-hidden");
    } else {
      displayHeight += this.getGuessDetailHeight();
    }

    if (!hasGuesses) {
      displayClasses.push("no-guesses");
    }

    if (hasGuesses) {
      const actionWord = hidden ? "Show" : "Hide";
      const guessList = this.getTopGuesses(guesses);
      return (
        <div onClick={ this.toggleVisibility } className={ displayClasses.join(" ") } style={{ height: `${displayHeight}px` }}>
          <p className="top-guesses">{ `${actionWord} top guesses for this mutt`} </p>
          <div className="guess-list" ref={ this.setGuessDetailRef }>
            { guessList }
          </div>
        </div>
      );
    } else {
      return (
        <div className={ displayClasses.join(" ") }>
          <p className="top-guesses">No guesses yet for this mutt</p>
        </div>
      );
    }
  }
};

TopGuessDisplay.propTypes = {
  muttId: PropTypes.number,
  muttGuesses: PropTypes.shape({
    link: PropTypes.string,
    pic: PropTypes.string,
    frequency: PropTypes.number
  })
};
