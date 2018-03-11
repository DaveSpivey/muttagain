import React, { Component } from 'react';

export default class EditModal extends Component {

  constructor(props) {
    super(props);
    this.state = { value: "" };
    this.changeName = this.changeName.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  changeName() {
    this.setState({ value: this.newName.value });
  }

  closeModal() {
    const { muttId } = this.props;
    this.setState({ value: "" });
    $(`#edit-modal-${muttId}`).foundation('close');
    $(`#edit-confirm-${muttId}`).foundation('close');
  }

  render() {
    const { muttName, muttId, handleDelete, editMuttName } = this.props;

    return (
      <div>
        <div className="reveal" id={ `edit-modal-${muttId}` } data-reveal>
          <p className="lead">{ `Edit profile for ${muttName}` }</p>
          <div className="button-multi">
            <input type="text"
                   placeholder="New name"
                   onChange={ this.changeName }
                   ref={(input) => { this.newName = input }} />
            <a href="#" data-open={ `edit-confirm-${muttId}` }
               id={ `${muttId}-edit-confirm` }
               className="button tiny mutton edit-button"
            >
              Change name
            </a>
            <EditConfirm muttName={ muttName }
                         newName={ this.state.value }
                         muttId={ muttId }
                         closeModal={ this.closeModal }
                         editMuttName={ editMuttName } />

            <a href="#" data-open={ `delete-modal-${muttId}` }
               className="button tiny mutton delete-button"
            >
              Delete Mutt
            </a>
          </div>

          <button className="close-button"
                  data-close={ `edit-modal-${muttId}` }
                  aria-label="Close modal"
                  type="button"
                  onClick={ this.closeModal }
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <DeleteConfirm muttName={ muttName }
                       muttId={ muttId }
                       handleDelete={ handleDelete }
                       closeModal={ this.closeModal } />
      </div>
    );
  }
}

class EditConfirm extends Component {

  submitNameChange(e) {
    e.preventDefault();
    const { muttId, newName, editMuttName, closeModal } = this.props;
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
      closeModal();
    })
    .catch((error) => {
      console.error(error)
    })
  }

  render() {
    const { muttName, newName, muttId, closeModal } = this.props;
    return (
      <div className="reveal edit-confirm" id={ `edit-confirm-${muttId}` } data-reveal>
        <p className="lead">{ `Change this mutt's name from ${muttName} to ${newName}?` }</p>
        <form id={ `edit-${muttId}` }
              className="form form-edit"
              method="PUT"
              action={ `mutts/${muttId}` }
              onSubmit={ this.submitNameChange.bind(this) }
        >
          <input type="hidden" name="muttName" value={ newName } />
          <input type="hidden" name="muttId" value={ muttId } />
          <input type="submit" className="button tiny mutton" value="Change name" />
        </form>
        <button className="button tiny mutton"
                data-close={ `edit-confirm-${muttId}` }
                aria-label="Close modal"
                type="button"
                onClick={ closeModal }
        >
          Cancel
        </button>
        <button className="close-button"
                data-close={ `edit-confirm-${muttId}` }
                aria-label="Close modal"
                type="button"
                onClick={ closeModal }
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );
  }
}

const DeleteConfirm = (props) => {
  const { muttName, muttId, handleDelete, closeModal } = props;
  return (
    <div className="reveal" id={ `delete-modal-${muttId}` } data-reveal>
      <p className="lead">{ `Delete profile for ${muttName}?` }</p>
      <p>This will permanently remove all this mutt's data and images</p>
      <div className="button-multi">
        <a href={ `/mutts/${muttId}/destroy` }
           id={ `${muttId}-delete-button` }
           className="button tiny mutton delete-button"
           onClick={ handleDelete }
        >
          Delete
        </a>
        <button className="button tiny mutton"
                data-close={ `delete-modal-${muttId}` }
                aria-label="Close modal"
                type="button"
                onClick={ closeModal }
        >
          Cancel
        </button>
      </div>
      <button className="close-button" data-close={ `delete-modal-${muttId}` } aria-label="Close modal" type="button">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
}
