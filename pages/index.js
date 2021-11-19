import Head from 'next/head'
import styles from 'styles/index.module.css'

import { useEffect, useState, useRef } from 'react'

export default function Home() {
  const [users, setUsers] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const userRef = useRef()
  const similarityTypeRef = useRef()
  const resultLimitRef = useRef()

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/user')
      const data = await res.json()
      setUsers(data)
    }

    fetchUsers()
  }, [])

  const onFindTopMatchingUsers = async () => {
    await fetchRecommendations('/api/recommendation/user')
  }

  const onFindRecommendedMovies = async () => {
    await fetchRecommendations('/api/recommendation/movie')
  }

  const fetchRecommendations = async (url) => {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userRef.current.value,
        similarity: similarityTypeRef.current.value,
        limit: resultLimitRef.current.value
      })
    })

    setRecommendations(await res.json())
  }

  return (
    <div>
      <Head>
        <title>2DV515 | A1</title>
        <meta name="description" content="LNU course 2DV515" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <section className={styles.section}>
          <label htmlFor="user">{'User '}</label>
          <select name="user" id="user" ref={userRef}>
            {users.map(user =>
              <option key={user.id} value={user.id}>
                {user.id + ": " + user.name}
              </option>
            )}
          </select>
          <label htmlFor="similarity">{'Similarity '}</label>
          <select name="similarity" id="similarity" ref={similarityTypeRef}>
            <option value="euclidean">Euclidean</option>
            <option value="pearson">Pearson</option>
          </select>
          <label htmlFor="results">{'Results '}</label>
          <input type="text" id="results" ref={resultLimitRef} />
        </section>
        <section className={styles.section}>
          <button onClick={onFindTopMatchingUsers}>Find top matching users</button>
          <button onClick={onFindRecommendedMovies}>Find recommended movies</button>
          <button disabled>Find recommendations, item-based</button>
        </section>
        {recommendations.length != 0 &&
          <section>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>ID</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {recommendations.map(r =>
                  <tr key={r.movieID}>
                    <td>{r.name}</td>
                    <td>{r.id}</td>
                    <td>{r.score.toFixed(4)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>}
      </main>
    </div>
  )
}
