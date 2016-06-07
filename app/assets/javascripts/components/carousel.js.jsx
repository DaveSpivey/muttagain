var Carousel = React.createClass({
  propTypes: {

  },

  render: function() {
    return (
      <div>
        <img src={ this.props.photo } />
      </div>
      );
  }
});