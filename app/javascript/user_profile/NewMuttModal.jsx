import React, { Component } from 'react';

export default class NewMuttModal extends Component {

  formAction = "/mutts";

  constructor(props) {
    super(props);
    this.state = { value: "" };
    this.updateEntry = this.updateEntry.bind(this);
    this.submitMutt = this.submitMutt.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  updateEntry() {
    this.setState({ value: this.name.value });
  }

  closeModal() {
    this.setState({ value: "" });
    $('#new-mutt-modal').foundation('close');
  }

  submitMutt(e) {
  	e.preventDefault();
    const form = e.nativeEvent.target;
    const requestData = { name: form.children[0].value, owner_id: this.props.userId }

    fetch(this.formAction, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: form.method,
      body: JSON.stringify(requestData)
    })
    .then((response) => response.json())
    .then((data) => {
	  console.log("data:", data);
      this.props.addNewMutt(data);
      closeModal();
    })
    .catch((error) => {
      console.error(error)
    })
  }

  render() {
    return (
      <div>
        <div className="reveal" id="new-mutt-modal" data-reveal>
          <p className="lead">Who's this mutt?</p>
          <form id="new-mutt-form"
                className="form"
                method="POST"
                action={ this.formAction }
                onSubmit={ this.submitMutt }
    	  >
            <input type="text"
                   placeholder="Mutt's name"
                   onChange={ this.updateEntry }
                   ref={(input) => { this.name = input }} />

          </form>

          <button className="close-button"
                  data-close="new-mutt-modal"
                  aria-label="Close modal"
                  type="button"
                  onClick={ this.closeModal }
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </div>
    );
  }
}
