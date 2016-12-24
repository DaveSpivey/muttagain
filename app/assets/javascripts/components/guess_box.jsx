import React from 'react';
import ReactDOM from 'react-dom';

export default class GuessBox extends React.Component {

  render() {
    const { breeds, muttId, handleGuess } = this.props;
    return (
      <div>
        <h4>{ 'Guess a breed for this mutt' }</h4>
        <form>
          <select id="guess-box" onChange={ handleGuess } >
            { breeds.map(function(breed) {
              return <option key={ breed.id }
                             value={ breed.id } >
                       { breed.name }
                     </option>;
            }) }
          </select>
        </form>
      </div>
    );
  }
};

GuessBox.defaultProps = {
  breeds: [],
  muttId: ''
}