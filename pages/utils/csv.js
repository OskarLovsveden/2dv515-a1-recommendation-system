import fs from 'fs'
import { parse } from 'csv'

const processFile = (path) => {

    const parser = fs
        .createReadStream('./movies_example' + path)
        .pipe(parse({
            from_line: 2,
            delimiter: ";"
        }))

    return parser
}

const getUsers = async () => {
    const users = []
    const parser = processFile('/users.csv');

    for await (const record of parser) {
        users.push({
            id: parseInt(record[0]),
            name: record[1]
        })
    }

    return users
}

const getMovies = async () => {
    const movies = []
    const parser = processFile('/movies.csv');

    for await (const record of parser) {
        movies.push({
            movieId: parseInt(record[0]),
            title: record[1],
            year: parseInt(record[2])
        })
    }

    return movies
}

const getRatings = async (userId) => {
    const ratings = []
    const parser = processFile('/ratings.csv');

    for await (const record of parser) {
        if (userId == parseInt(record[0])) {
            ratings.push({
                userId: parseInt(record[0]),
                movieId: parseInt(record[1]),
                score: parseFloat(record[2])
            })
        }
    }

    return ratings
}

export { getUsers, getMovies, getRatings }