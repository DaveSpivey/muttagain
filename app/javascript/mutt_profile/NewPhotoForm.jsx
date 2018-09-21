import React, { Component } from 'react';
import { bind } from 'bind-decorator';

export default class NewPhotoModal extends Component {

  formAction = "";

  constructor(props) {
    super(props);
    
    this.formAction = `/mutts/${this.props.muttId}/photos`;
  }

  @bind
  submitPhoto(e) {
  	e.preventDefault();
    const form = e.nativeEvent.target;
    const fileInput = form.querySelector('input[type="file"]');
    const profileInput = form.querySelector('input[type="checkbox"]');
    
    if (fileInput.files.length) {
      const requestData = new FormData();
      requestData.append('image', fileInput.files[0]);
      requestData.append('mutt_id', this.props.muttId);
      requestData.append('profile', profileInput.checked);

      fetch(this.formAction, {
        method: form.method,
        body: requestData
      })
      .then((response) => response.json())
      .then((data) => {
        this.props.addNewPhoto(data);
      })
      .catch((error) => {
        console.error(error)
      });
    }
  }

  render() {
    const { muttName, muttId } = this.props;

    return (
      <div>
        <p className="modal-header">Add a photo for { muttName }</p>
        <form id="new-photo-form"
              className="form"
              encType="multipart/form-data"
              method="POST"
              action={ this.formAction }
              onSubmit={ this.submitPhoto }
  	    >
          <input name="image" type="file" />
          <input name="mutt_id" type="hidden" value={ muttId } />
          <div>
            <input name="profile" type="checkbox" value="profile" defaultChecked />
            <label htmlFor="profile">Set as profile image</label>
          </div>
          <input type="submit" className="button mutton" value="Upload" />
        </form>
      </div>
    );
  }
}
