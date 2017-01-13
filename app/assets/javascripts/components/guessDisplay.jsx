import React from 'react';
import ReactDOM from 'react-dom';

export default class GuessDisplay extends React.Component {

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
      return <li key={ guess.name } className="guess-item" >
               <a href={ guess.link }>{ guess.name }</a>
               <span className="guess-frequency">{ guess.frequency }</span>
             </li>
    });
  }

  showGuesses() {
    this.setState({ hidden: false });
  }

  render() {
    const { muttId, guesses } = this.props;
    if (this.state.hidden) {
      return (<div onClick={ this.showGuesses } className="guess-display guess-display-hidden">
          <p className="top-guesses">Show top guesses for this mutt</p>
        </div>
      );
    } else {
      const guessList = this.getTopGuesses(guesses);
      return (<div className="guess-display">
          <p className="top-guesses">Top guesses for this mutt:</p>
          <ul>
            { guessList }
          </ul>
        </div>
      );
    }
  }
};