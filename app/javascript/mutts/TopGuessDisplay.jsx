import React from 'react';

export default class TopGuessDisplay extends React.Component {

  constructor() {
    super();
    this.state = { hidden: true };

    this.getTopGuesses = this.getTopGuesses.bind(this);
    this.showGuesses = this.showGuesses.bind(this);
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
        frequency: currentGuess.frequency
      }
    });
    let topGuesses = guessList.sort((a, b) => {
      return b.frequency - a.frequency
    }).slice(0, 3);

    return topGuesses.map((guess) => {
      return (
        <li key={ guess.name } className="top-guess-item" >
          <a href={ guess.link } target="_blank">{ guess.name }</a>
          <span className="guess-frequency">{ guess.frequency }</span>
        </li>
       );
    });
  }

  showGuesses() {
    this.setState({ hidden: false });
  }

  render() {
    const { muttId, guesses } = this.props;
    if (this.state.hidden) {
      if (Object.keys(guesses).length) {
        return (
          <div onClick={ this.showGuesses } className="top-guess-display top-guess-display-hidden">
            <p className="top-guesses">Show top guesses for this mutt</p>
          </div>
        );
      } else {
        return (
          <div className="top-guess-display no-guesses top-guess-display-hidden">
            <p className="top-guesses">No guesses yet for this mutt</p>
          </div>
        );
      }
    } else {
      const guessList = this.getTopGuesses(guesses);
      return (
        <div className="top-guess-display">
          <p className="top-guesses">Top guesses for this mutt:</p>
          <ul>
            { guessList }
          </ul>
        </div>
      );
    }
  }
};