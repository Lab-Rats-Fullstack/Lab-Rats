import {useState} from "react";
import CommentCard from "./CommentCard";
import Pagination from '../general/Pagination';

export default function UserComments({ userData, currentUser }) {
  const { comments: commentList = [] } = userData;
  const [currentCards, setCurrentCards] = useState([]);
  return (
    <div className="commentContainer">
      <div>
                <Pagination
                Card={CommentCard}
                cardArr={commentList}
                currentCards={currentCards}
                setCurrentCards={setCurrentCards}
                cardType={"comment"}
                numberPerPage={3}
                currentUser={currentUser}
                />
            </div>
    </div>
  );
}
