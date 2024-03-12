import { useState, useEffect, useInsertionEffect } from "react";
import AverageStars from "./AverageStars";
import BinderRings from "./BinderRings";
import { useParams, useNavigate, Link } from "react-router-dom";
import Loading from "./Loading";

export default function SingleRecipe({ token, admin, currentUser }) {
  const [loading, setLoading] = useState(true);
  const API_URL = `https://culinary-chronicle.onrender.com/api/`;
  const navigate = useNavigate();
  const { recipeId } = useParams();
  const [errMess, setErrMess] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [recipe, setRecipe] = useState({});
  const [userId, setUserId] = useState(null);

  const [leavingAReview, setLeavingAReview] = useState(false);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewRating, setReviewRating] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [reviewErrMess, setReviewErrMess] = useState(false);

  const [leavingAComment, setLeavingAComment] = useState(null);
  const [commentContent, setCommentContent] = useState("");
  const [commentErrMess, setCommentErrMess] = useState(null);

  const [editingAReview, setEditingAReview] = useState(null);
  const [editReviewTitle, setEditReviewTitle] = useState("");
  const [editReviewRating, setEditReviewRating] = useState("");
  const [editReviewContent, setEditReviewContent] = useState("");
  const [editReviewErrMess, setEditReviewErrMess] = useState(null);

  const [editingAComment, setEditingAComment] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [editCommentErrMess, setEditCommentErrMess] = useState(null);

  const [reviewAreYouSure, setReviewAreYouSure] = useState(null);
  const [deleteReviewErrMess, setDeleteReviewErrMess] = useState(null);

  const [commentAreYouSure, setCommentAreYouSure] = useState(null);
  const [deleteCommentErrMess, setDeleteCommentErrMess] = useState(null);

  const [recipeAreYouSure, setRecipeAreYouSure] = useState(false);
  const [deleteRecipeErrMess, setDeleteRecipeErrMess] = useState(false);

  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  useEffect(() => {
    async function handleGetRecipeById() {
      async function handleGetRecipeFetch() {
        try {
          const headers = {
            "Content-Type": "application/json",
          };
          if (token) {
            headers["Authorization"] = `Bearer ${token}`;
          }
          const response = await fetch(`${API_URL}recipes/${recipeId}`, {
            method: "GET",
            headers: headers,
          });
          const json = await response.json();
          setLoading(false);
          return json;
        } catch (error) {
          setErrMess(true);
        }
      }

      const potentialRecipe = await handleGetRecipeFetch();
      if (potentialRecipe.recipe) {
        const potentiallyAlreadyReviewed = potentialRecipe.recipe.reviews.find(
          (review) => {
            return review.userid === potentialRecipe.userId;
          }
        );

        if (potentiallyAlreadyReviewed) {
          setAlreadyReviewed(true);
        } else {
          setAlreadyReviewed(false);
        }
        setRecipe(potentialRecipe.recipe);
        setUserId(potentialRecipe.userId);
        setErrMess(false);
      } else {
        setErrMess(true);
      }
    }
    handleGetRecipeById();
  }, [refreshCounter]);

  function leavingAReviewForm() {
    if (leavingAReview) {
      return (
        <>
          <form onSubmit={handleCreateReview}>
            <label>
              Title:{" "}
              <input
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
              ></input>
            </label>
            <label>
              Rating:{" "}
              <select
                id="stars"
                value={reviewRating}
                onChange={(e) => setReviewRating(e.target.value)}
                name="stars"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </label>
            <label>
              Content:{" "}
              <input
                type="text"
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
              ></input>
            </label>
            <button>Submit</button>
          </form>
        </>
      );
    }
  }

  async function handleCreateReview(event) {
    event.preventDefault();
    async function createReviewFetch() {
      try {
        const response = await fetch(`${API_URL}reviews/${recipe.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: reviewTitle,
            rating: reviewRating,
            content: reviewContent,
          }),
        });
        const json = await response.json();
        return json;
      } catch (error) {
        setReviewErrMess(true);
        throw error;
      }
    }

    const potentialReview = await createReviewFetch();
    if (potentialReview.id) {
      setReviewErrMess(false);
      setRefreshCounter((prev) => prev + 1);
      setLeavingAReview(false);
    } else {
      setReviewErrMess(true);
    }
  }

  function leavingACommentForm(reviewId) {
    if (leavingAComment === reviewId) {
      return (
        <>
          <form onSubmit={(event) => handleCreateComment(event, reviewId)}>
            <label>
              Content:{" "}
              <input
                type="text"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
              ></input>
            </label>
            <button>Submit</button>
          </form>
        </>
      );
    }
  }

  async function handleCreateComment(event, reviewId) {
    event.preventDefault();
    async function createCommentFetch(reviewId) {
      try {
        const response = await fetch(`${API_URL}comments/${reviewId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `BEARER ${token}`,
          },
          body: JSON.stringify({
            content: commentContent,
          }),
        });
        const json = await response.json();
        return json;
      } catch (error) {
        setCommentErrMess(reviewId);
        throw error;
      }
    }

    const potentialComment = await createCommentFetch(reviewId);
    if (potentialComment.id) {
      setCommentErrMess(null);
      setRefreshCounter((prev) => prev + 1);
      setLeavingAComment(null);
    } else {
      setCommentErrMess(reviewId);
    }
  }

  function editingAReviewForm(reviewId) {
    if (editingAReview === reviewId) {
      return (
        <>
          <form onSubmit={(event) => handleEditReview(event, reviewId)}>
            <label>
              Title:{" "}
              <input
                type="text"
                value={editReviewTitle}
                onChange={(e) => setEditReviewTitle(e.target.value)}
              ></input>
            </label>
            <label>
              Rating:{" "}
              <select
                id="stars"
                value={editReviewRating}
                onChange={(e) => setEditReviewRating(e.target.value)}
                name="stars"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </label>
            <label>
              Content:{" "}
              <input
                type="text"
                value={editReviewContent}
                onChange={(e) => setEditReviewContent(e.target.value)}
              ></input>
            </label>
            <button>Submit</button>
          </form>
        </>
      );
    }
  }

  async function handleEditReview(event, reviewId) {
    event.preventDefault();
    async function editReviewFetch(reviewId) {
      try {
        const response = await fetch(`${API_URL}reviews/${reviewId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `BEARER ${token}`,
          },
          body: JSON.stringify({
            title: editReviewTitle,
            rating: editReviewRating,
            content: editReviewContent,
          }),
        });
        const json = await response.json();
        return json;
      } catch (error) {
        setEditReviewErrMess(reviewId);
        throw error;
      }
    }

    const potentialEditReview = await editReviewFetch(reviewId);
    if (potentialEditReview.id) {
      setEditReviewErrMess(null);
      setEditingAReview(null);
      setRefreshCounter((prev) => prev + 1);
    } else {
      setEditReviewErrMess(reviewId);
    }
  }

  function editingACommentForm(commentId) {
    if (editingAComment === commentId) {
      return (
        <>
          <form onSubmit={(event) => handleEditComment(event, commentId)}>
            <label>
              Content:{" "}
              <input
                type="text"
                value={editCommentContent}
                onChange={(e) => setEditCommentContent(e.target.value)}
              ></input>
            </label>
            <button>Submit</button>
          </form>
        </>
      );
    }
  }

  async function handleEditComment(event, commentId) {
    event.preventDefault();
    async function editCommentFetch(commentId) {
      try {
        const response = await fetch(`${API_URL}comments/${commentId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `BEARER ${token}`,
          },
          body: JSON.stringify({
            content: editCommentContent,
          }),
        });
        const json = await response.json();
        return json;
      } catch (error) {
        setEditCommentErrMess(commentId);
        throw error;
      }
    }

    const potentialEditComment = await editCommentFetch(commentId);
    if (potentialEditComment.id) {
      setEditCommentErrMess(null);
      setEditingAComment(null);
      setRefreshCounter((prev) => prev + 1);
    } else {
      setEditCommentErrMess(commentId);
    }
  }

  async function handleDeleteReview(reviewId) {
    async function deleteReviewFetch(reviewId) {
      try {
        const response = await fetch(`${API_URL}reviews/${reviewId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `BEARER ${token}`,
          },
        });
        const json = await response.json();
        return json;
      } catch (error) {
        setDeleteReviewErrMess(reviewId);
        throw error;
      }
    }

    const potentialDeletedReview = await deleteReviewFetch(reviewId);
    if (potentialDeletedReview) {
      setReviewAreYouSure(null);
      setDeleteReviewErrMess(null);
      setRefreshCounter((prev) => prev + 1);
    } else {
      setDeleteReviewErrMess(reviewId);
    }
  }

  async function handleDeleteComment(commentId) {
    async function deleteCommentFetch(commentId) {
      try {
        const response = await fetch(`${API_URL}comments/${commentId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `BEARER ${token}`,
          },
        });
        const json = await response.json();
        return json;
      } catch (error) {
        setDeleteCommentErrMess(commentId);
        throw error;
      }
    }

    const potentialDeletedComment = await deleteCommentFetch(commentId);
    if (potentialDeletedComment) {
      setCommentAreYouSure(null);
      setDeleteCommentErrMess(null);
      setRefreshCounter((prev) => prev + 1);
    } else {
      setDeleteCommentErrMess(commentId);
    }
  }

  async function handleDeleteRecipe(recipeId) {
    async function deleteRecipeFetch(recipeId) {
      try {
        const response = await fetch(`${API_URL}recipes/${recipeId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `BEARER ${token}`,
          },
        });
        const json = await response.json();
        return json;
      } catch (error) {
        setDeleteRecipeErrMess(true);
        throw error;
      }
    }

    const potentialDeletedRecipe = await deleteRecipeFetch(recipeId);
    if (potentialDeletedRecipe) {
      setRecipeAreYouSure(false);
      setDeleteRecipeErrMess(false);
      navigate(`/`);
    } else {
      setDeleteRecipeErrMess(true);
    }
  }

  return (
    <>
      {" "}
      {loading ? (
        <Loading />
      ) : (
        <>
          {errMess || !recipe.id ? (
            <p>There has been an error</p>
          ) : (
            <div className="singleRecipeCard">
              <div className="top">
                <h1 className="singleRecipeTitle">{recipe.title}</h1>
                <img className="recipeImg" src={recipe.imgurl} />
                {recipe.user.username === currentUser ? (
                  <Link className="singleRecipeUsername" to={`/account`}>
                    @{recipe.user.username}
                  </Link>
                ) : (
                  <Link
                    className="singleRecipeUsername"
                    to={`/users/${recipe.user.id}`}
                  >
                    @{recipe.user.username}
                  </Link>
                )}
                {recipe.esttime && <p>Estimated Time: {recipe.esttime}</p>}
                <div className="averageRating">
                  {recipe.avgRating ? (
                    <AverageStars starAverage={recipe.avgRating} />
                  ) : (
                    <p>This recipe has not yet been reviewed.</p>
                  )}
                </div>
                <div className="singleRecipeTags">
                  {recipe.tags.map((tag) => {
                    return (
                      <p key={tag.id}>
                        <em>{tag.name}</em>
                      </p>
                    );
                  })}
                </div>
                {admin && (
                  <div className="buttonContainer">
                    <button
                      onClick={() => navigate(`/recipes/${recipe.id}/edit`)}
                    >
                      Edit Recipe
                    </button>
                    {recipeAreYouSure ? (
                      <>
                        <p>Are you are you want to delete this?</p>
                        <button onClick={() => handleDeleteRecipe(recipe.id)}>
                          Yes
                        </button>
                        <button onClick={() => setRecipeAreYouSure(false)}>
                          No
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setRecipeAreYouSure(true)}>
                          Delete Recipe
                        </button>
                      </>
                    )}
                    {deleteRecipeErrMess && (
                      <p>There has been an error deleting the recipe.</p>
                    )}
                  </div>
                )}
                <h2 className="ingredientTitle">Ingredients:</h2>
                <ul className="ingredients">
                  {recipe.ingredients.map((ingredient) => {
                    return <li key={ingredient}>{ingredient}</li>;
                  })}
                </ul>
              </div>
              <BinderRings />
              <div className="bottom">
                <h2>Instructions:</h2>
                <ol>
                  {recipe.procedure.map((item) => {
                    return <li key={item}>{item}</li>;
                  })}
                </ol>
                {recipe.notes.length > 0 && (
                  <>
                    <h2>Notes:</h2>
                    <ol>
                      {recipe.notes.map((item) => {
                        return <li key={item}>{item}</li>;
                      })}
                    </ol>
                  </>
                )}
              </div>
              <div className="reviewContainer">
                {token && alreadyReviewed ? (
                  <p className="leaveAReview">
                    You have already left a review on this recipe.
                  </p>
                ) : token ? (
                  <>
                    {!leavingAReview ? (
                      <button
                        className="leaveAReview"
                        onClick={() => {
                          setLeavingAReview(true);
                          setReviewTitle("");
                          setReviewRating(1);
                          setReviewContent("");
                        }}
                      >
                        Leave a review
                      </button>
                    ) : (
                      <button
                        className="leaveAReview"
                        onClick={() => setLeavingAReview(false)}
                      >
                        Close review form{" "}
                      </button>
                    )}
                    {leavingAReviewForm()}
                  </>
                ) : (
                  <button
                    className="leaveAReview"
                    onClick={() => navigate("/login")}
                  >
                    Sign in to leave a review
                  </button>
                )}
                {reviewErrMess && (
                  <p>There has been an error submitting the review.</p>
                )}
                <h2 className="reviewTitle">Reviews:</h2>
                {!recipe.reviews.length ? (
                  <p className="noComments">No reviews to show.</p>
                ) : (
                  <>
                    {recipe.reviews.map((review) => {
                      return (
                        <div key={review.id} className="review">
                          <h3 className="titleForReview">{review.title}</h3>
                          {review.user.username === currentUser ? (
                            <Link className="reviewUser" to={`/account`}>
                              @{review.user.username}
                            </Link>
                          ) : (
                            <Link
                              className="reviewUser"
                              to={`/users/${review.user.id}`}
                            >
                              @{review.user.username}
                            </Link>
                          )}
                          <span className="reviewStars">
                            <AverageStars starAverage={review.rating} />
                          </span>
                          <p className="reviewContent">{review.content}</p>
                          {token && (
                            <>
                              {(review.userid === userId || admin) && (
                                <div className="reviewButtons">
                                  {editingAReview === review.id ? (
                                    <>
                                      <button
                                        onClick={() => setEditingAReview(null)}
                                      >
                                        Close edit review form
                                      </button>
                                      {editingAReviewForm(review.id)}
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        onClick={() => {
                                          setEditingAReview(review.id);
                                          setEditReviewTitle(review.title);
                                          setEditReviewRating(review.rating);
                                          setEditReviewContent(review.content);
                                        }}
                                      >
                                        Edit Review
                                      </button>
                                    </>
                                  )}
                                  {editReviewErrMess === review.id && (
                                    <p>
                                      There has been an error submitting the
                                      edited review.
                                    </p>
                                  )}
                                  {!(reviewAreYouSure === review.id) ? (
                                    <button
                                      onClick={() =>
                                        setReviewAreYouSure(review.id)
                                      }
                                    >
                                      Delete Review
                                    </button>
                                  ) : (
                                    <>
                                      <p>
                                        Are you sure you want to delete this?
                                      </p>
                                      <button
                                        onClick={() =>
                                          handleDeleteReview(review.id)
                                        }
                                      >
                                        Yes
                                      </button>
                                      <button
                                        onClick={() =>
                                          setReviewAreYouSure(null)
                                        }
                                      >
                                        No
                                      </button>
                                    </>
                                  )}

                                  {deleteReviewErrMess === review.id && (
                                    <p>
                                      There has been an error deleting the
                                      review.
                                    </p>
                                  )}
                                </div>
                              )}
                            </>
                          )}

                          {token ? (
                            <>
                              {!(leavingAComment === review.id) ? (
                                <button
                                  className="commentButton"
                                  onClick={() => {
                                    setLeavingAComment(review.id);
                                    setCommentContent("");
                                  }}
                                >
                                  Leave a comment
                                </button>
                              ) : (
                                <button
                                  onClick={() => setLeavingAComment(null)}
                                >
                                  Close comment form{" "}
                                </button>
                              )}
                              {leavingACommentForm(review.id)}
                            </>
                          ) : (
                            <button onClick={() => navigate("/login")}>
                              Sign in to leave a comment
                            </button>
                          )}
                          {commentErrMess === review.id && (
                            <p>
                              There has been an error submitting the comment.
                            </p>
                          )}
                          <h5 className="commentsTitle">Comments:</h5>
                          {!review.comments.length ? (
                            <p className="noComments">No comments to show.</p>
                          ) : (
                            <>
                              {review.comments.map((comment) => {
                                return (
                                  <div key={comment.id} className="comment">
                                    <p>{comment.content}</p>
                                    {comment.user.username === currentUser ? (
                                      <Link
                                        className="commentUser"
                                        to={`/account`}
                                      >
                                        @{comment.user.username}
                                      </Link>
                                    ) : (
                                      <Link
                                        className="commentUser"
                                        to={`/users/${comment.user.id}`}
                                      >
                                        @{comment.user.username}
                                      </Link>
                                    )}
                                    {token && (
                                      <>
                                        {(comment.userid === userId ||
                                          admin) && (
                                          <>
                                            {editingAComment === comment.id ? (
                                              <>
                                                <button
                                                  className="commentFormButton"
                                                  onClick={() =>
                                                    setEditingAComment(null)
                                                  }
                                                >
                                                  Close edit comment form
                                                </button>
                                                {editingACommentForm(
                                                  comment.id
                                                )}
                                              </>
                                            ) : (
                                              <>
                                                <button
                                                  className="editComment"
                                                  onClick={() => {
                                                    setEditingAComment(
                                                      comment.id
                                                    );
                                                    setEditCommentContent(
                                                      comment.content
                                                    );
                                                  }}
                                                >
                                                  Edit Comment
                                                </button>
                                              </>
                                            )}
                                            {editCommentErrMess ===
                                              comment.id && (
                                              <p>
                                                There has been an error
                                                submitting the edited comment.
                                              </p>
                                            )}
                                            {!(
                                              commentAreYouSure === comment.id
                                            ) ? (
                                              <button
                                                onClick={() =>
                                                  setCommentAreYouSure(
                                                    comment.id
                                                  )
                                                }
                                              >
                                                Delete Comment
                                              </button>
                                            ) : (
                                              <>
                                                <p>
                                                  Are you sure you want to
                                                  delete this?
                                                </p>
                                                <div className="areYouSure">
                                                  <button
                                                    onClick={() =>
                                                      handleDeleteComment(
                                                        comment.id
                                                      )
                                                    }
                                                  >
                                                    Yes
                                                  </button>
                                                  <button
                                                    onClick={() =>
                                                      setCommentAreYouSure(null)
                                                    }
                                                  >
                                                    No
                                                  </button>
                                                </div>
                                              </>
                                            )}
                                            {deleteCommentErrMess ===
                                              comment.id && (
                                              <p>
                                                There has been an error deleting
                                                the comment.
                                              </p>
                                            )}
                                          </>
                                        )}
                                      </>
                                    )}
                                  </div>
                                );
                              })}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
