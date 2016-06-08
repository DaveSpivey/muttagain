var Carousel = React.createClass({
  propTypes: {

  },

  getDefaultProps: function() {
    return {
      data: { photoUrl: '', muttName: '' }
    };
  },

  render: function() {
    return (
      <div>
        <img src={ this.props.data.photoUrl } />
        <h3>{ this.props.data.muttName }</h3>
      </div>
      );
  }
});