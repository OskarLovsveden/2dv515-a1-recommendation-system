import { getRatings } from "./csv"

const euclidean = async (userA, userB) => {
    let sim = 0
    let n = 0

    const ratingsA = await getRatings(userA)
    const ratingsB = await getRatings(userB)

    for await (const rA of ratingsA) {
        for await (const rB of ratingsB) {
            sim += Math.pow(rA.score - rB.score, 2)
            n += 1
        }
    }

    if (n == 0) {
        return 0
    }

    const inv = 1 / (1 + sim)
    return inv
}

export { euclidean }