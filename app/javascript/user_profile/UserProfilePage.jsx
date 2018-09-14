import React, { Component } from 'react';
import { bind } from 'bind-decorator';
import Modal from '../ui/Modal';
import NewMuttForm from './NewMuttForm.jsx';
import EditMuttForm from './EditMuttForm.jsx';

export default class UserProfilePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mutts: [],
      photos: [],
      currentEditingMutt: null,
      newMuttModalActive: false,
      editMuttModalActive: false
    };
  }

  componentWillMount() {
    this.setState({ mutts: this.props.mutts });
  }

  componentDidMount() {
    this.getMuttPhotos();
  }

  @bind
  openNewMuttModal() {
    this.setState({ newMuttModalActive: true });
  }

  @bind
  openEditMuttModal(index) {
    return () => {
      this.setState({ editMuttModalActive: true, currentEditingMutt: index });
    }
  }

  @bind
  closeModal() {
    this.setState({ newMuttModalActive: false, editMuttModalActive: false, currentEditingMutt: null });
  }

  @bind
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

  @bind
  addNewMutt(mutt) {
    let muttList = this.state.mutts;
    this.setState({ mutts: muttList.concat(mutt) });
    this.closeModal();
  }

  @bind
  editMuttName(id, name) {
    let newMuttList = this.state.mutts;
    const mutt = newMuttList.find((mutt) => { return mutt.id === id });
    mutt.name = name;
    this.setState({ mutts: newMuttList });
    this.closeModal();
  }

  @bind
  handleDelete(mutts) {
    this.setState({ mutts: mutts });
    this.closeModal();
  }

  render() {
    const { userId, username } = this.props;
    const {
      mutts,
      photos,
      currentEditingMutt,
      newMuttModalActive,
      editMuttModalActive
    } = this.state;
    
    const muttProfiles = mutts.length ? (
      mutts.map((mutt, idx) => {
        const muttPhotos = photos.filter(photo => photo.mutt_id === mutt.id);
        const profilePhoto = muttPhotos.length 
          ? muttPhotos.find(photo => photo.profile) || muttPhotos[0]
          : undefined;

        return <MuttDetail key={ idx }
                           mutt={ mutt }
                           profilePhoto={ profilePhoto }
                           modalActive={ this.editMuttModalActive }
                           openModal={ this.openEditMuttModal(idx) } />
      })
    ) : <div>No mutts yet -- add a mutt to get started!</div>

    const editForm = currentEditingMutt !== null && mutts[currentEditingMutt] !== undefined ? (
      <EditMuttForm muttName={ mutts[currentEditingMutt].name }
                    muttId={ mutts[currentEditingMutt].id }
                    handleDelete={ this.handleDelete }
                    editMuttName={ this.editMuttName } />
    ) : undefined;

    return (
      <div className="user-profile">
        <h1 className="welcome-header">Welcome, { username }!</h1>
        <button className="button mutton new-mutt-button" onClick={ this.openNewMuttModal }>
          Add New Mutt
        </button>
        { muttProfiles }

        <Modal isActive={ newMuttModalActive } closeModal={ this.closeModal }>
          <NewMuttForm userId={ userId } addNewMutt={ this.addNewMutt } />
        </Modal>

        <Modal isActive={ editMuttModalActive } closeModal={ this.closeModal }>
          { editForm }
        </Modal>
      </div>
    );
  }
}

const MuttDetail = (props) => {
  const { mutt, profilePhoto, openModal } = props;

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
        <a href="#" className="button tiny mutton edit-button" onClick={ openModal }>
          Manage Mutt
        </a>
      </div>
    </div>
  );
}