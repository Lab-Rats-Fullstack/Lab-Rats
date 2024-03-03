import React from 'react';
import CommentCard from './CommentCard';

export default function UserInfo ({token, adminPriv, userData}) {
    // console.log(userData);
    // console.log(adminPriv);
    const {comments: commentList=[]} = userData;
    return (
        <div className="commentContainer">
            <div className = 'userComments'>
                <h2>My Comments</h2>
                {commentList.map((comment)=>{
                    return (
                        <CommentCard key ={comment.id} comment = {comment} token={token}/>
                    )
                })}
            </div>
        </div>
    )
}