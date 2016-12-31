import React from 'react';
import ReactDOM from 'react-dom';

export default class ProfilePage extends React.Component {

  handleEdit(e) {
    e.preventDefault();
    console.log(e.target);
  }

  handleDelete(e) {
    e.preventDefault();
    console.log(e.target);
  }

  getMuttProfiles() {
    const { mutts, profilePhotos } = this.props;
    const emptyPicMessage = "No photos yet for this mutt";
    const muttProfiles = mutts.map((mutt) => {
      let muttPhoto;
      profilePhotos.forEach((photo) => {
        if (photo.muttId == mutt.id) {
          muttPhoto = photo.photo ?
            <a href={ `/mutts/${mutt.id}` }>
              <img src={ photo.photo } />
            </a>
            : <p>{ emptyPicMessage }</p>
        }
      })
      return <div className="muttProfile" key={ `mutt${mutt.id}` }>
          <a href={ `/mutts/${mutt.id}` }>
            <p>{ mutt.name }</p>
          </a>
          { muttPhoto }
          <div className="button-multi">
            <a className="button tiny mutton edit-button"
               href={ `/mutts/${mutt.id}/edit` }
               onClick={ this.handleEdit }
            >
              Edit
            </a>
            <a className="button tiny mutton delete-button"
               href={ `/mutts/${mutt.id}/destroy` }
               onClick={ this.handleDelete }
            >
              Delete
            </a>
          </div>
        </div>
    })
    return muttProfiles;
  }

  render() {
    const { user } = this.props;
    const muttProfiles = this.getMuttProfiles();
    return (
      <div>
        <h2>Welcome, { user.name }!</h2>
        { muttProfiles }
      </div>
    )
  }
}