import React, { Component } from 'react';
import { bind } from 'bind-decorator';

export default class NewMuttForm extends Component {

  formAction = "/mutts";

  constructor(props) {
    super(props);
    this.state = { value: "" };
  }

  @bind
  updateEntry() {
    this.setState({ value: this.name.value });
  }

  @bind
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
      this.props.addNewMutt(data);
    })
    .catch((error) => {
      console.error(error)
    })
  }

  render() {
    return (
      <div>
        <p className="modal-header">Who's this mutt?</p>
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

          <input type="submit"
                 value="Submit"
                 className="button mutton" />
        </form>
      </div>
    );
  }
}
