import React, { Component } from 'react';
import { connect } from'react-redux';

/* -----------------    COMPONENT     ------------------ */

class PostContainer extends Component {
	constructor(props) {
		super(props);		
	}

	render() {
    const { user, stories } = this.props;
    if (!user) return <div></div>  // the user id is invalid or data isn't loaded yet
		return (
			<div className="container">
		 		THIS IS POST
			</div>
		);
	}

}

/* -----------------    CONTAINER     ------------------ */

const mapState = ({ users, stories }, ownProps) => {
  const param_id = Number(ownProps.params.id);
  return { 
    user:    _.find(users, user => user.id === param_id), 
    stories
  }
}

const mapDispatch = { addStory }

export default connect(mapState, mapDispatch)(UserDetail);
