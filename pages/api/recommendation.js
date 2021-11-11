export default function userHandler(req, res) {
    const {
        body: { user },
        method,
    } = req

    switch (method) {
        case 'POST':
            // handle recommendations data
            res.status(200).json({ message: 'OK' })
            break
        default:
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}