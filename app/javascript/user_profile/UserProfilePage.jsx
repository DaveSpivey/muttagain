import React, { Component } from 'react';
import EditModal from './EditModal.jsx';
import NewMuttModal from './NewMuttModal.jsx';
import NewPhotoModal from './NewPhotoModal.jsx';

export default class UserProfilePage extends Component {

  constructor(props) {
    super(props);
    this.state = { mutts: [], photos: [], photoActionMessage: null };

    this.editMuttName = this.editMuttName.bind(this);
    this.addNewMutt = this.addNewMutt.bind(this);
    this.addNewPhoto = this.addNewPhoto.bind(this);
  }

  componentWillMount() {
    this.setState({ mutts: this.props.mutts });
  }

  componentDidMount() {
    $(document).foundation();
    this.getMuttPhotos();
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.photoActionMessage !== null) {
      this.setState({ photoActionMessage: null });
    }
  }

  getMuttPhotos() {
    this.state.mutts.forEach(mutt => {
      
      fetch(`/mutts/${ mutt.id }/photos`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'GET'
      })
      .then((response) => response.json())
      .then((data) => {
        const photo = data.find(pic => pic.profile === true) || data[0];
        if (photo) {
          let profilePhotos = this.state.photos;
          profilePhotos.push(photo);
          this.setState({ photos: profilePhotos });
        }
      })
      .catch((error) => {
        console.error(error)
      })
    });
  }

  addNewMutt(mutt) {
    let muttList = this.state.mutts;
    this.setState({ mutts: muttList.concat(mutt) });
  }

  addNewPhoto(photo) {
    let actionMessage;
    if (photo) {
      actionMessage = "Photo uploaded successfully";
      let photoList = this.state.photos;
      this.setState({ photos: photoList.concat(photo), photoActionMessage: actionMessage });
    } else {
      actionMessage = "Uh oh, something went wrong uploading your photo";
      console.warn('Error adding new photo, response:', photo);
      this.setState({ photoActionMessage: actionMessage });
    }
  }

  editMuttName(id, name) {
    let newMuttList = this.state.mutts;
    const mutt = newMuttList.find((mutt) => { return mutt.id === id });
    mutt.name = name;
    this.setState({ mutts: newMuttList });
  }

  handleEdit(e) {
    e.preventDefault();
    const muttId = parseInt(e.nativeEvent.target.id);
  }

  handleDelete(e) {
    e.preventDefault();
    const muttId = parseInt(e.nativeEvent.target.id);
    console.log(`This would delete mutt with id# ${muttId}`);
  }

  render() {
    const { userId, userName } = this.props;
    const { mutts, photos } = this.state;
    
    const muttProfiles = mutts.map((mutt, idx) => {
      const muttPhotos = photos.filter(photo => photo.mutt_id === mutt.id);
      const profilePhoto = muttPhotos.length 
        ? muttPhotos.find(photo => photo.profile).url || muttPhotos[0].url
        : undefined;

      return <MuttDetail key={ idx }
                         mutt={ mutt }
                         profilePhoto={ profilePhoto }
                         handleDelete={ this.handleDelete }
                         editMuttName={ this.editMuttName }
                         addNewPhoto={ this.addNewPhoto }
                         photoActionMessage={ this.state.photoActionMessage } />
    });

    return (
      <div>
        <h2>Welcome, { userName }!</h2>
        <a href="#" data-open="new-mutt-modal"
           id="new-mutt-button"
           className="button mutton"
        >
          Add New Mutt
        </a>
        <NewMuttModal userId={ userId } addNewMutt={ this.addNewMutt } />
        { muttProfiles }
      </div>
    );
  }
}

const MuttDetail = (props) => {
  const { mutt, profilePhoto, handleDelete, editMuttName, addNewPhoto, photoActionMessage } = props;
  const emptyPicMessage = "No photos yet for this mutt";

  const muttPhoto = profilePhoto ?
    <a href={ `/mutts/${mutt.id}` }>
      <img src={ profilePhoto } />
    </a>
    : <p>{ emptyPicMessage }</p>

  let message;
  if (photoActionMessage) {
    message = <div>{ photoActionMessage }</div>
  }

  return (
    <div className="muttProfile">
      <a href={ `/mutts/${mutt.id}` }>
        <p>{ mutt.name }</p>
      </a>
      { muttPhoto }
      <div className="button-multi">
        <a href="#" data-open={ `edit-modal-${mutt.id}` }
           id={ `${mutt.id}-edit-button` }
           className="button tiny mutton edit-button"
        >
          Manage Mutt
        </a>
        <a href="#" data-open={ `new-photo-modal-${mutt.id}` }
           id={ `${mutt.id}-new-photo-button` }
           className="button tiny mutton edit-button"
        >
          Add a Photo
        </a>
      </div>
      <EditModal muttName={ mutt.name }
                 muttId={ mutt.id }
                 handleDelete={ handleDelete }
                 editMuttName={ editMuttName } />
      <NewPhotoModal muttName={ mutt.name }
                     muttId={ mutt.id }
                     addNewPhoto={ addNewPhoto } />
      { message }
    </div>
  );
}