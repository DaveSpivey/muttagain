import React, { Component } from 'react';
import NewMuttModal from './NewMuttModal.jsx';
import EditModal from './EditModal.jsx';

export default class UserProfilePage extends Component {

  constructor(props) {
    super(props);
    this.state = { mutts: [], photos: [] };

    this.editMuttName = this.editMuttName.bind(this);
    this.addNewMutt = this.addNewMutt.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentWillMount() {
    this.setState({ mutts: this.props.mutts });
  }

  componentDidMount() {
    $(document).foundation();
    this.getMuttPhotos();
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
    $(document).foundation();
  }

  editMuttName(id, name) {
    let newMuttList = this.state.mutts;
    const mutt = newMuttList.find((mutt) => { return mutt.id === id });
    mutt.name = name;
    this.setState({ mutts: newMuttList });
  }

  handleDelete(mutts) {
    this.setState({ mutts: mutts });
  }

  render() {
    const { userId, username } = this.props;
    const { mutts, photos } = this.state;
    
    const muttProfiles = mutts.length ? (
      mutts.map((mutt, idx) => {
        const muttPhotos = photos.filter(photo => photo.mutt_id === mutt.id);
        const profilePhoto = muttPhotos.length 
          ? muttPhotos.find(photo => photo.profile) || muttPhotos[0]
          : undefined;

        return <MuttDetail key={ idx }
                           mutt={ mutt }
                           profilePhoto={ profilePhoto }
                           handleDelete={ this.handleDelete }
                           editMuttName={ this.editMuttName } />
      })
    ) : <div>No mutts yet -- add a mutt to get started!</div>

    return (
      <div className="user-profile">
        <h1>Welcome, { username }!</h1>
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
  const { mutt, profilePhoto, handleDelete, editMuttName } = props;
  const emptyPicMessage = "No photos yet for this mutt";

  const muttPhoto = profilePhoto ?
    <a href={ `/mutts/${mutt.id}` }>
      <img src={ profilePhoto.url } />
    </a>
    : <p>{ emptyPicMessage }</p>

  return (
    <div className="mutt-details">
      <a href={ `/mutts/${mutt.id}` }>
        <p>{ mutt.name }</p>
      </a>
      { muttPhoto }
      <div className="button-multi">
        <a href={ `/mutts/${mutt.id}` } className="button tiny mutton">
          { `Go to ${mutt.name}'s page` }
        </a>
        <a href="#" data-open={ `edit-modal-${mutt.id}` }
           id={ `${mutt.id}-edit-button` }
           className="button tiny mutton edit-button"
        >
          Manage Mutt
        </a>
      </div>
      <EditModal muttName={ mutt.name }
                 muttId={ mutt.id }
                 handleDelete={ handleDelete }
                 editMuttName={ editMuttName } />
    </div>
  );
}