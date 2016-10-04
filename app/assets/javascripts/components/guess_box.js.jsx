var GuessBox = React.createClass({
  propTypes: {

  },

  getDefaultProps: function() {
    return {
      data: { breeds: this.props.breeds, muttId: this.props.muttId }
    };
  },

  render: function() {
    return (
      <div>
        <h4>{ 'Guess a breed for this mutt' }</h4>
        <form>
          <select>
            { breeds.map(function(breed) {
              return <option key={breed.id}
                value={breed.name}>{breed.name}</option>;
            }) }
          </select>
        </form>
      </div>
      );
  }
});