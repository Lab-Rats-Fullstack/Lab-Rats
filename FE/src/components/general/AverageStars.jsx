// inspiration https://blog.petefowler.dev/how-to-make-a-star-rating-display-in-react-thats-better-than-the-one-on-yelpcom
// https://www.studytonight.com/css-howtos/how-to-create-a-simple-star-rating-look-with-css#:~:text=Creating%20star%2Dlook%20with%20the,display%3A%20inline%2Dblock%20property.

export default function AverageStars({ starAverage }) {
  const fullStars = Math.floor(starAverage);

  const starArr = [];
  for (let i = 0; i < fullStars; i++) {
    starArr.push(1);
  }
  if (starAverage < 5) {
    const partialStar = starAverage - fullStars;
    starArr.push(partialStar);

    const emptyStars = 5 - starArr.length;

    for (let i = 0; i < emptyStars; i++) {
      starArr.push(0);
    }
  }

  return (
    <div className="starContainer">
      {starArr.map((val, i) => {
        return (
          <div
            key={i}
            className="star"
            style={{
              background: `linear-gradient(90deg, #ee7536
      ${val * 100}%, #928d51 ${val * 100}%)`,
            }}
          >
            ★
          </div>
        );
      })}
      <div className="average">{Math.round(starAverage * 10) / 10}</div>
    </div>
  );
}
