import React from 'react';
import ReactDOM from 'react-dom';

export default class GuessSelect extends React.Component {

  render() {
    const { breeds, muttId, handleGuess } = this.props;
    return (
      <div>
        <h5>{ 'Guess a breed for this mutt' }</h5>
        <form>
          <select id="guess-select-input" onChange={ handleGuess } >
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

GuessSelect.defaultProps = {
  breeds: [],
  muttId: ''
}