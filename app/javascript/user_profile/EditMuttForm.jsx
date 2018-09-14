import React, { Component } from 'react';
import { bind } from 'bind-decorator';

const FormState = {
  INITIAL: "initial",
  EDIT_CONFIRM: "edit-confirm",
  DELETE_CONFIRM: "delete-confirm"
};

export default class EditMuttForm extends Component {

  constructor(props) {
    super(props);
    this.state = { value: "", formState: FormState.INITIAL };
  }

  @bind
  changeName() {
    this.setState({ value: this.newName.value });
  }

  @bind
  editMutt() {
    this.setState({ formState: FormState.EDIT_CONFIRM });
  }

  @bind
  deleteMutt() {
    this.setState({ formState: FormState.DELETE_CONFIRM });
  }

  @bind
  cancelOperation() {
    this.setState({ formState: FormState.initial });
  }

  render() {
    const { muttName, muttId, handleDelete, editMuttName } = this.props;
    const { formState, value } = this.state;
    let form;

    switch(formState) {
      case FormState.EDIT_CONFIRM:
        form = (
          <EditConfirm muttName={ muttName }
                       newName={ value }
                       muttId={ muttId }
                       editMuttName={ editMuttName }
                       cancel={ this.cancelOperation } />
        );
        break;

      case FormState.DELETE_CONFIRM:
        form = (
          <DeleteConfirm muttName={ muttName }
                         muttId={ muttId }
                         handleDelete={ handleDelete }
                         cancel={ this.cancelOperation } />
        );
        break;

      default:
        form = (
          <div>
            <p className="modal-header">{ `Edit profile for ${muttName}` }</p>
            <div className="button-multi">
              <input type="text"
                     placeholder="New name"
                     onChange={ this.changeName }
                     ref={(input) => { this.newName = input }} />

              <button className="button tiny mutton edit-button" onClick={ this.editMutt }>
                Change name
              </button>
              <button className="button tiny mutton delete-button" onClick={ this.deleteMutt }>
                Delete Mutt
              </button>
            </div>
          </div>
        );
    }

    return form;
  }
}

class EditConfirm extends Component {

  @bind
  submitNameChange(e) {
    e.preventDefault();
    const { muttId, newName, editMuttName, cancel } = this.props;
    const form = e.nativeEvent.target;
    const requestAction = `../mutts/${muttId}`;
    const requestData = { muttName: form.children[0].value }

    fetch(requestAction, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "PUT",
      body: JSON.stringify(requestData)
    })
    .then((response) => response.json())
    .then((data) => {
      editMuttName(muttId, newName);
    })
    .catch((error) => {
      console.error(error)
    })
  }

  render() {
    const { muttName, newName, muttId, cancel } = this.props;
    return (
      <div>
        <p className="modal-header">{ `Change this mutt's name from ${muttName} to ${newName}?` }</p>
        <form id={ `edit-${muttId}` }
              className="form form-edit"
              method="PUT"
              action={ `mutts/${muttId}` }
              onSubmit={ this.submitNameChange }
        >
          <input type="hidden" name="muttName" value={ newName } />
          <input type="hidden" name="muttId" value={ muttId } />

          <div className="button-multi">
            <input type="submit" className="button tiny mutton" value="Change name" />
            <button className="button tiny mutton" onClick={ cancel } style={{ display: "inline-block", marginLeft: "0.5rem" }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }
}

class DeleteConfirm extends Component {

  @bind
  submitDelete(e) {
    e.preventDefault();
    const { muttId, newName, handleDelete, closeModal, cancel } = this.props;
    const form = e.nativeEvent.target;
    const requestAction = `../mutts/${muttId}`;

    fetch(requestAction, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "DELETE"
    })
    .then((response) => response.json())
    .then((data) => {
      handleDelete(data);
    })
    .catch((error) => {
      console.error(error)
    })
  }

  render() {
    const { muttName, muttId, cancel } = this.props;
    return (
      <div>
        <p className="modal-header">{ `Delete profile for ${muttName}?` }</p>
        <p>This will permanently remove all this mutt's data and images</p>
        <div className="button-multi">
          <a href={ `/mutts/${muttId}/destroy` }
             id={ `${muttId}-delete-button` }
             className="button tiny mutton delete-button"
             onClick={ this.submitDelete }
          >
            Delete
          </a>
          <a href="#" className="button tiny mutton" onClick={ cancel }>
            Cancel
          </a>
        </div>
      </div>
    );
  }
}
