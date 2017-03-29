import React, { Component } from 'react';
import ContactForm from '../components/contact-form';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { SubmissionError } from 'redux-form';
import _ from 'lodash';
import { newContact, saveContact, fetchContact, updateContact, validateContactFailed } from '../actions/contacts-actions';

class ContactsFormPage extends Component {

  state = {
    redirect: false
  }

  componentDidMount = () => {
    const { _id } = this.props.match.params;
    if(_id){
      this.props.fetchContact(_id)
    } else {
      this.props.newContact();
    }
  }

  // validate = (contact) => {
  //   const errors = {};
  //   if(!contact.name.first) {
  //     errors.first = {
  //       message: 'You need to provide First Name'
  //     }
  //   }
  //   if(!contact.phone) {
  //     errors.phone = {
  //       message: 'You need to provide a Phone number'
  //     }
  //   }
  //   if(!contact.email) {
  //     errors.email = {
  //       message: 'You need to provide an Email address'
  //     }
  //   }
  //   return errors;
  // }

  submit = (contact) => {
    // const errors = this.validate(contact);
    // if(!_.isEmpty(errors)) {
    //   this.props.validateContactFailed({errors, errorMessage:'Contact Validation Failed!'})
    //   return;
    // }

    if(!contact._id) {
      return this.props.saveContact(contact)
        .then(response => this.setState({ redirect:true }))
        .catch(err => {
           throw new SubmissionError(this.props.errors)
         })
    } else {
      return this.props.updateContact(contact)
        .then(response => this.setState({ redirect:true }))
        .catch(err => {
           throw new SubmissionError(this.props.errors)
         })
    }
  }

  render() {
    return (
      <div>
        {
          this.state.redirect ?
          <Redirect to="/" /> :
          <ContactForm contact={this.props.contact} errorMessage={this.props.errorMessage} errors={this.props.errors} loading={this.props.loading} onSubmit={this.submit} />
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    contact: state.contactStore.contact,
    errorMessage: state.contactStore.errorMessage,
    errors: state.contactStore.errors,
    loading: state.contactStore.loading
  }
}

export default connect(mapStateToProps, {newContact, saveContact, fetchContact, updateContact, validateContactFailed }) (ContactsFormPage);
