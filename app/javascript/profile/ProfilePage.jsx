import React, { Component } from 'react';
import EditModal from './EditModal.jsx';
import NewMuttModal from './NewMuttModal.jsx';

export default class ProfilePage extends Component {

  constructor(props) {
    super(props);
    this.state = { mutts: [] };

    this.editMuttName = this.editMuttName.bind(this);
    this.addNewMutt = this.addNewMutt.bind(this);
  }

  componentWillMount() {
    this.setState({ mutts: this.props.mutts });
  }

  componentDidMount() {
    $(document).foundation();
  }

  addNewMutt(mutt) {
    let muttList = this.state.mutts;
    this.setState({ mutts: muttList.concat(mutt) });
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
    const { userId, userName, profilePhotos } = this.props;
    const { mutts } = this.state;
    const muttProfiles = mutts.map((mutt, idx) => {
      let muttPhoto;
      profilePhotos.forEach((photo) => {
        if (photo.muttId == mutt.id) {
          muttPhoto = photo.photo;
        }
      });
      return <MuttDetail key={ idx }
                         mutt={ mutt }
                         profilePhoto={ muttPhoto }
                         handleDelete={ this.handleDelete }
                         editMuttName={ this.editMuttName } />
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
  const { mutt, profilePhoto, handleDelete, editMuttName } = props;
  const emptyPicMessage = "No photos yet for this mutt";
  let muttPhoto = profilePhoto ?
    <a href={ `/mutts/${mutt.id}` }>
      <img src={ profilePhoto } />
    </a>
    : <p>{ emptyPicMessage }</p>

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
      </div>
      <EditModal muttName={ mutt.name }
                 muttId={ mutt.id }
                 handleDelete={ handleDelete }
                 editMuttName={ editMuttName } />
    </div>
  );
}