var MuttDisplay = React.createClass({
  getInitialState: function() {
    return { data: [] };
  },

  componentDidMount: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.slides = data.photos;
        this.setState({ data: data.photos[0] });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  slides: [],
  currentSlide: 0,

  handleFlip: function(e) {
    if (e.target.id == 'previous' && this.currentSlide > 0) {
      this.currentSlide --;
    } else if (e.target.id == 'next' && this.currentSlide < this.slides.length - 1) {
      this.currentSlide ++;
    };
    this.setState({ data: this.slides[this.currentSlide]})
  },

  render: function() {
    return (
      <div>
        <Carousel data={ this.state.data } />
        <a href='#' id='previous' onClick={ this.handleFlip }>Previous</a>
        <a href='#' id='next' onClick={ this.handleFlip }>Next</a>
        <div>
          <GuessBox data={{ breeds: this.breeds, muttId: this.state.muttId }} />
        </div>
      </div>
      );
  }
});