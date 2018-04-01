import React from 'react';

export default class TopGuessDisplay extends React.Component {

  constructor() {
    super();
    this.state = { hidden: true };

    this.getTopGuesses = this.getTopGuesses.bind(this);
    this.toggleVisibility = this.toggleVisibility.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.muttId != this.props.muttId) {
      this.setState({ hidden: true });
    }
  }

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
            <div className="stock-pic"><span style={{ marginRight: "6rem" }}></span></div>
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

  toggleVisibility() {
    this.setState({ hidden: !this.state.hidden });
  }

  render() {
    const { muttId, guesses } = this.props;
    if (this.state.hidden) {
      if (Object.keys(guesses).length) {
        return (
          <div onClick={ this.toggleVisibility } className="guess-display guess-display-hidden">
            <p className="top-guesses">Show top guesses for this mutt</p>
          </div>
        );
      } else {
        return (
          <div className="guess-display no-guesses guess-display-hidden">
            <p className="top-guesses">No guesses yet for this mutt</p>
          </div>
        );
      }
    } else {
      const guessList = this.getTopGuesses(guesses);
      return (
        <div onClick={ this.toggleVisibility } className="guess-display">
          <p className="top-guesses">Top guesses for this mutt:</p>
          <div>
            { guessList }
          </div>
        </div>
      );
    }
  }
};