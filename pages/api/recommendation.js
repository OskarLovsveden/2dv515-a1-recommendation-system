import { euclidean, pearson } from '../utils/similarity'
import { getUsers } from '../utils/csv'

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

    for await (const user of users) {
        if (userId != user.id) {
            switch (similarity) {
                case 'euclidean':
                    console.log(user.name + ": " + await euclidean(userId, user.id))
                    break;
                case 'pearson':
                    console.log(user.name + ": " + await pearson(userId, user.id))
                    break;
                default:
                    console.log("Something went wrong...")
                    break;
            }
        }
    }

    return users
}
