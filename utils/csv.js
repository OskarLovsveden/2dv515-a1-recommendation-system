import fs from 'fs'
import { parse } from 'csv'

// const data = 'data/movies_example'
const data = 'data/movies_large'
const usersCsv = '/users.csv'
const moviesCsv = '/movies.csv'
const ratingsCsv = '/ratings.csv'

const processFile = (path) => {

    const parser = fs
        .createReadStream(data + path)
        .pipe(parse({
            from_line: 2,
            delimiter: ";"
        }))

    return parser
}

const getUsers = async () => {
    const users = []
    const parser = processFile(usersCsv)

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
    const parser = processFile(moviesCsv)

    for await (const record of parser) {
        movies.push({
            id: parseInt(record[0]),
            title: record[1],
            year: parseInt(record[2])
        })
    }

    return movies
}

const getMovie = async (id) => {
    const parser = processFile(moviesCsv)

    for await (const record of parser) {
        if (id == parseInt(record[0])) {
            return {
                id: parseInt(record[0]),
                title: record[1],
                year: parseInt(record[2])
            }
        }
    }
}

const getRatings = async (userId) => {
    const ratings = []
    const parser = processFile(ratingsCsv)

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

export { getUsers, getMovies, getMovie, getRatings }