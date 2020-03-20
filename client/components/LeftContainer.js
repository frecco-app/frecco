import React, {Component} from "react";
import PostForm from "./PostForm";
import FriendsContainer from "./FriendsContainer";
import UserDashboard from "./UserDashboard";

class LeftContainer extends React.Component {
   
    render() {
        return (
            <div id='left-container'>
                <UserDashboard
                username = {this.props.username}
                name = {this.props.name}
                // posts = {this.props.posts}
                />
                <FriendsContainer 
                potentialFollows={this.props.potentialFollows} 
                handleChangeFollow={this.props.handleChangeFollow}
                addFollow={this.props.addFollow}/>
                <PostForm 
                postData={this.props.postData}
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

