var Carousel = React.createClass({
  propTypes: {

  },

  render: function() {
    // console.log(this.props.data)
    if(this.props.data != null) {
      return (
        <div>
          <img src={ this.props.data.photoUrl } />
          <h3>{ this.props.data.muttName }</h3>
        </div>
        );
    } else {
      return (
        <div></div>
        );
    }
  }
});