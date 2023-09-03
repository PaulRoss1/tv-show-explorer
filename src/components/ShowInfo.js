export default function ShowInfo(props) {
  const { showData } = props;

  return (
    <div className="info">
      {showData ? !(Object.keys(showData).length === 0) &&
        !(showData.Error === "Series not found!") && (
          <span className="info__data">
            {`${showData.Title} `}
            <span className="info__year">{`(${showData.Year})`}</span>
            &nbsp;&nbsp;&nbsp;
            {`·`}
            &nbsp;&nbsp;&nbsp;
            {`${showData.imdbRating} `}
            <span className="info__star">★</span>
            &nbsp;&nbsp;&nbsp;
            {`·`}
            &nbsp;&nbsp;&nbsp;
            {`Seasons: ${showData.totalSeasons}`}
          </span>
        ) : null}
    </div>
  );
}
