import { euclidean, pearson } from 'utils/similarity'
import { getUsers } from 'utils/csv'

export default async function userHandler(req, res) {
    const {
        body: { userId, similarity, limit },
        method,
    } = req

    switch (method) {
        case 'POST':
            try {
                const recommendations = await findTopMatchingUsers(userId, similarity)
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

const findTopMatchingUsers = async (userId, simType) => {
    const users = await getUsers()

    const result = []

    for (const user of users) {
        if (userId == user.id) {
            continue
        }

        switch (simType) {
            case 'euclidean':
                result.push({
                    name: user.name,
                    id: user.id,
                    score: await euclidean(userId, user.id)
                })
                break
            case 'pearson':
                result.push({
                    name: user.name,
                    id: user.id,
                    score: await pearson(userId, user.id)
                })
                break
            default:
                console.log("Something went wrong...")
                break
        }
    }

    return result
}