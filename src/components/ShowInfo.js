export default function ShowInfo(props) {
  const { show } = props;

  return (
    <div className="info">
      {!(Object.keys(show).length === 0) &&
        !(show.Error == "Series not found!") && (
          <span className="info__data">
            {`${show.Title} `}
            <span className="info__year">{`(${show.Year})`}</span>
            &nbsp;&nbsp;&nbsp;
            {`·`}
            &nbsp;&nbsp;&nbsp;
            {`${show.imdbRating} `}
            <span className="info__star">★</span>
            &nbsp;&nbsp;&nbsp;
            {`·`}
            &nbsp;&nbsp;&nbsp;
            {`Seasons: ${show.totalSeasons}`}
          </span>
        )}
    </div>
  );
}
