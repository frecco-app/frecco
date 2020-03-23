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
                    location={this.props.location}
                    category={this.props.category}
                    minrating={this.props.minrating}
                    friends={this.props.friends}
                    handleChangeFriendsFilter={this.props.handleChangeFriendsFilter}
                 />
                <FeedContainer filteredPosts={this.props.filteredPosts} likedPosts={this.props.likedPosts}/>
            </div>
            
        )
    }
}

export default RightContainer;