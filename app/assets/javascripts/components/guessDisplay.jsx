import React from 'react';
import ReactDOM from 'react-dom';

export default class GuessDisplay extends React.Component {

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
               <a href={ guess.link }>{ guess.name + ", " + guess.frequency }</a>
             </li>
    });
  }

  render() {
    const { muttId, guesses } = this.props;
    const guessList = this.getTopGuesses(guesses);
    return (
      <div>
        GuessDisplay muttId: { muttId }
        <p>Top 3 guesses:</p>
        <ul>
          { guessList }
        </ul>
      </div>
    );
  }
};