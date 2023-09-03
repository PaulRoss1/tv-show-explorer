export interface Episode {
    title: string,
    released: string,
    imdbRating: string,
    id: string,
    season: number,
    episode: number
}

export interface ExtraInfo {
    image: string,
    runtime: string,
    released: string,
    plot: string,
}

export interface SearchedShow {
    Title: string
    Season: string
    totalSeasons: string
    Episodes: SearchedEpisode[]
    Response: string
}

export interface SearchedEpisode {
    Title: string
    Released: string
    Episode: string
    imdbRating: string
    imdbID: string
}

export interface ShowData {
    Title: string
    Year: string
    Rated: string
    Released: string
    Runtime: string
    Genre: string
    Director: string
    Writer: string
    Actors: string
    Plot: string
    Language: string
    Country: string
    Awards: string
    Poster: string
    Ratings: Rating[]
    Metascore: string
    imdbRating: string
    imdbVotes: string
    imdbID: string
    Type: string
    totalSeasons: string
    Response: string
}

export interface Rating {
    Source: string
    Value: string
}