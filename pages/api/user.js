import { getUsers } from '../utils/csv'

export default async function handler(req, res) {
    try {
        const users = await getUsers()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ error: 'failed to load data' })
    }
}