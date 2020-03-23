import React, {Component} from "react";
import PostForm from "./PostForm";
import FeedContainer from "./FeedContainer";
import FilterForm from "./FilterForm";

class RightContainer extends React.Component {
   
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
                    handleLikeReview={this.props.handleLikeReview}/>
            </div>
            
        )
    }
}

export default RightContainer;