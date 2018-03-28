import React, { Component } from 'react';

export default class MuttProfilePage extends Component {

  constructor(props) {
    super(props);
    this.state = { photos: [] };
    console.log("constructor > props:", this.props);

    this.getProfilePhoto = this.getProfilePhoto.bind(this);
  }

  componentWillMount() {
  	if (this.props.photos) {
    	this.setState({ photos: this.props.photos });
	}
  }

  componentDidMount() {
    $(document).foundation();
  }

  getProfilePhoto() {
  	const { photos } = this.state;
  	if (photos.length) {
  		return photos.find(photo => photo.profile === true) || photos[0];
  	}
  	return;
  }

  getPhotoContainer() {
  	const { photos } = this.state;
  	const allPhotos = photos.map((photo, idx) => {
  		return (
  			<div key={ idx } className="photo-image">
  				<img src={ photo.smallUrl } />
			</div>
		);
  	});
  	console.log("allPhotos", allPhotos);

  	return <div className="photo-container">{ allPhotos }</div>;
  }

  render() {
  	const { mutt } = this.props;
  	const { photos } = this.state;
  	let photoHeader = <div>No photos yet for this mutt</div>;
  	const profilePhoto = this.getProfilePhoto();
  	const photoContainer = this.getPhotoContainer();

  	if (profilePhoto) {
  		photoHeader = (
  			<div className="profile-photo">
  				<img src={ profilePhoto.mediumUrl } />
  			</div>
		);
  	}

  	return (
  		<div className="mutt-profile">
  			<h1>{ this.props.mutt.name }'s page</h1>
  			{ photoHeader }
  			<h3>{ mutt.name }'s photos</h3>
  			{ photoContainer }
  		</div>
	);
  }
}