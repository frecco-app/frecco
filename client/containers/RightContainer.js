import React, { Component } from 'react';
import FeedContainer from '../components/FeedContainer';
import FilterForm from '../components/FilterForm';

class RightContainer extends Component {
	render() {
		return (
			<div id='right-container'>
					<FilterForm 
							filterPosts={this.props.filterPosts}
							handleChangeCategory={this.props.handleChangeCategory}
							handleChangeLocation={this.props.handleChangeLocation}
							handleChangeRating={this.props.handleChangeRating}
							locations={this.props.locations}
							categories={this.props.categories}
							minrating={this.props.minrating}
							friends={this.props.friends}
							handleChangeFriendsFilter={this.props.handleChangeFriendsFilter}
							postFilter={this.props.postFilter}
							/>
					<FeedContainer 
							filteredPosts={this.props.filteredPosts}
							likedPosts={this.props.likedPosts}
							handleLikeReview={this.props.handleLikeReview}
							numberLikes={this.props.numberLikes}
							handleDeleteReview={this.props.handleDeleteReview}
							current_username = {this.props.current_username}/>
			</div>
		);
	}
}

export default RightContainer;
