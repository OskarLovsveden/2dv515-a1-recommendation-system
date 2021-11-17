import { getRatings } from "./csv"

const euclidean = async (userA, userB) => {
    let sim = 0
    let n = 0

    const ratingsA = await getRatings(userA)
    const ratingsB = await getRatings(userB)

    for await (const rA of ratingsA) {
        for await (const rB of ratingsB) {
            if (rA.movieId == rB.movieId) {
                sim += Math.pow(rA.score - rB.score, 2)
                n += 1
            }
        }
    }

    if (n == 0) {
        return 0
    }

    const inv = 1 / (1 + sim)
    return inv
}

const pearson = async (userA, userB) => {
    let sum1 = 0
    let sum2 = 0
    let sum1sq = 0
    let sum2sq = 0
    let pSum = 0
    let n = 0

    const ratingsA = await getRatings(userA)
    const ratingsB = await getRatings(userB)

    for await (const rA of ratingsA) {
        for await (const rB of ratingsB) {
            if (rA.movieId == rB.movieId) {
                sum1 += rA.score
                sum2 += rB.score
                sum1sq += Math.pow(rA.score, 2)
                sum2sq += Math.pow(rB.score, 2)
                pSum += rA.score * rB.score
                n += 1
            }
        }
    }

    if (n == 0) {
        return 0
    }

    const num = pSum - (sum1 * sum2 / n)
    const den = Math.sqrt((sum1sq - Math.pow(sum1, 2) / n) * (sum2sq - Math.pow(sum2, 2) / n))
    return num / den
}

export { euclidean, pearson }