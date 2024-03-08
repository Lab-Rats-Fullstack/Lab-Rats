import React from 'react';
import CommentCard from './CommentCard';

export default function UserComments ({userData, currentUser}) {
    console.log(userData);
    const {comments: commentList=[]} = userData;
    return (
        <div className="commentContainer">
            <div className = 'userComments'>
                <h2>Comments</h2>
                {commentList.map((comment)=>{
                    return (
                        <CommentCard key ={comment.id} comment = {comment} currentUser={currentUser}/>
                    )
                })}
            </div>
        </div>
    )
}