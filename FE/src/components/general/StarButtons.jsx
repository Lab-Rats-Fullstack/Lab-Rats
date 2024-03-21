export default function StarButtons({ setReviewRating, reviewRating }) {
  const starArr = [];
  for (let i = 0; i < 5; i++) {
    starArr.push(1);
  }

  return (
    <div id="stars" name="stars">
      {starArr.map((val, i) => {
        return (
          <button
            key={i + 1}
            className="star starButton"
            type="button"
            value={i + 1}
            onClick={(e) => setReviewRating(e.target.value)}
            style={
              reviewRating >= i + 1
                ? { backgroundColor: "#ee7536", color: "#ebe9e8" }
                : null
            }
          ></button>
        );
      })}
    </div>
  );
}
