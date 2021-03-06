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
                firstname = {this.props.firstname}
                posts = {this.props.posts}
                friends = {this.props.friends}
                />
                <FriendsContainer
                potentialFollows={this.props.potentialFollows} 
                handleChangeFollow={this.props.handleChangeFollow}
                addFollow={this.props.addFollow}/>
                <PostForm 
                postData={this.props.postData}
                handleChangePostCategory={this.props.handleChangePostCategory}
                handleChangePostLocation={this.props.handleChangePostLocation}
                postLocationMessage={this.props.postLocationMessage} 
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

