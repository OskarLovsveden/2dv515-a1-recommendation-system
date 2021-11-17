import { euclidean, pearson } from 'utils/similarity'
import { getRatings, getUsers } from 'utils/csv'

export default async function userHandler(req, res) {
    const {
        body: { userId, similarity },
        method,
    } = req

    switch (method) {
        case 'POST':
            try {
                const recommendations = await getRecommendations(userId, similarity)
                res.status(200).json(recommendations)
            } catch (error) {
                res.status(500).json({ error: 'failed to load data' })
            }
            break
        default:
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}


const getRecommendations = async (userId, similarity) => {
    const users = await getUsers();

    const userMatrix = []

    for await (const user of users) {
        if (userId != user.id) {
            switch (similarity) {
                case 'euclidean':
                    userMatrix.push({
                        id: user.id,
                        name: user.name,
                        similarity: await euclidean(userId, user.id)
                    })
                    break;
                case 'pearson':
                    userMatrix.push({
                        id: user.id,
                        name: user.name,
                        similarity: await pearson(userId, user.id)
                    })
                    break;
                default:
                    console.log("Something went wrong...")
                    break;
            }
        }
    }

    // const weightedScores = []

    // for await (const user of userMatrix) {
    //     if (user.similarity > 0) {
    //         const ratings = getRatings(user.id)

    //         for await (const rating of ratings) {
    //             if (weightedScores.some(w => w.id == rating.userId)) {

    //             }
    //         }
    //     }
    // }

    return userMatrix
}
