import React from 'react';
import Select from 'react-select-plus';
import 'react-select-plus/dist/react-select-plus.css';

export default class GuessSelect extends React.Component {

  confirmGuess(selection) {
    const { getCurrentGuess } = this.props;
    this.props.getCurrentGuess(selection);
  }

  render() {
    const { breeds, muttId, handleGuess, currentGuess } = this.props;
    let options = [];
    breeds.map((breed) => {
      options.push({ value: breed.id, label: breed.name })
    });
    const config = {
      menuBuffer: 8
    }
    let submitClass = currentGuess ? "button guess-submit" : "button guess-submit submit-hidden";

    return (
      <div>
        <h5>{ 'Guess a breed for this mutt' }</h5>
        <form>
          <Select className="guess-select-input"
                  options={ options }
                  { ...config }
                  value={ currentGuess }
                  onChange={ this.confirmGuess.bind(this) }
          />
        </form>
        <button className={ submitClass }
                ref={(submit) => { this.guessSubmit = submit; }}
                onClick={ handleGuess } >
          Guess
        </button>
      </div>
    );
  }
};

GuessSelect.defaultProps = {
  breeds: [],
  muttId: ''
}