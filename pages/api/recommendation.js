import { euclidean } from '../utils/algorithms'
import { getUsers } from '../utils/csv'

export default async function userHandler(req, res) {
    const {
        body: { user },
        method,
    } = req

    switch (method) {
        case 'POST':
            try {
                const recommendations = await getRecommendations(user, 'euclidean')
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


const getRecommendations = async (userA, algorithm) => {
    const users = await getUsers();

    for await (const userB of users) {
        if (userA != userB.id) {
            console.log(userB.name + ": " + await euclidean(userA, userB.id))
        }
    }

    return users
}
