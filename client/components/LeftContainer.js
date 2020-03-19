import React, {Component} from "react";
import PostForm from "./PostForm";
import FriendsContainer from "./FriendsContainer";
import UserDashboard from "./UserDashboard";

class LeftContainer extends React.Component {
   
    render() {
        return (
            <div id='left-container'>
                <UserDashboard />
                <FriendsContainer />
                <PostForm 
                handleChangePostCategory={this.props.handleChangePostCategory}
                handleChangePostLocation={this.props.handleChangePostLocation}
                handleChangeRecommendation={this.props.handleChangeRecommendation}
                handleChangePostRating={this.props.handleChangePostRating}
                handleChangeReview={this.props.handleChangeReview}
                handlePostForm={this.props.handlePostForm}
                categories={this.props.categories}
                locations={this.props.locations} />
            </div>
        )
    }
}

export default LeftContainer;

