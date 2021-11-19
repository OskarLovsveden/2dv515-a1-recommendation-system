import { euclidean, pearson } from 'utils/similarity'
import { getMovie, getRatings, getUsers } from 'utils/csv'

export default async function userHandler(req, res) {
    const {
        body: { userId, similarity, limit },
        method,
    } = req

    console.log(limit ? limit : 500)

    switch (method) {
        case 'POST':
            try {
                const recommendations = await findRecommendedMovies(userId, similarity)
                const data = recommendations.slice(0, limit ? limit : recommendations.length)
                res.status(200).json(data)
            } catch (error) {
                res.status(500).json({ error: 'failed to load data' })
            }
            break
        default:
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}

const findRecommendedMovies = async (userId, similarity) => {
    const moviesSeen = await getRatings(userId)
    const userSims = await getUserSimilarity(userId, similarity)
    const recommendations = await calculateRecommendations(moviesSeen, userSims)

    const result = []

    for (const rec of recommendations) {
        result.push({
            name: (await getMovie(rec.movieId)).title,
            id: rec.movieId,
            score: rec.score
        })
    }

    return result
}

const getUserSimilarity = async (userId, simType) => {
    const users = await getUsers()

    const userSims = []

    for (const user of users) {
        if (userId == user.id) {
            continue
        }

        switch (simType) {
            case 'euclidean':
                userSims.push({
                    userId: user.id,
                    username: user.name,
                    score: await euclidean(userId, user.id),
                    ratings: await getRatings(userId)
                })
                break
            case 'pearson':
                userSims.push({
                    userId: user.id,
                    username: user.name,
                    score: await pearson(userId, user.id),
                    ratings: await getRatings(userId)
                })
                break
            default:
                console.log("Something went wrong...")
                break
        }
    }

    return userSims
}

const calculateRecommendations = async (moviesSeen, userSims) => {
    const recommendations = []

    for (const sim of userSims) {
        if (sim.score <= 0) {
            continue
        }

        const ratings = await getRatings(sim.userId)

        for (const rating of ratings) {
            if (moviesSeen.some(ms => ms.movieId == rating.movieId)) {
                continue
            }

            const recommendation = recommendations.find(rec => rec.movieId == rating.movieId)
            if (recommendation) {
                recommendation.sumWeight += rating.score * sim.score
                recommendation.sumSim += sim.score
            } else {
                recommendations.push({
                    movieId: rating.movieId,
                    sumWeight: rating.score * sim.score,
                    sumSim: sim.score,
                    score: 0
                })
            }
        }
    }

    for (const recommendation of recommendations) {
        recommendation.score = recommendation.sumWeight / recommendation.sumSim
    }

    return recommendations.sort((a, b) => b.score - a.score)
}