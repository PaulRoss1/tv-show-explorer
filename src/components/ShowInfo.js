export default function ShowInfo(props) {
  const { isLoading, show } = props;

  return (
    <div className="info">
      {isLoading ? (
        <div className="info__loading">Loading..</div>
      ) : (
        <>
          <span className="info__title">
            {`${show.Title} `}
            <span className="info__year">{`(${show.Year}) `}</span>
            <br />
            <span className="info__star"> ★</span>
            {` ${show.imdbRating}`}
            <br />
            {`Seasons: ${show.totalSeasons}`}
          </span>
        </>
      )}
    </div>
  );
}
