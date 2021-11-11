import Head from 'next/head'
import styles from '../styles/index.module.css'

import { useEffect, useState, useRef } from 'react'

export default function Home() {
  const [users, setUsers] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const userSelectRef = useRef();

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/user')
      const data = await res.json()
      setUsers(data)
    }

    fetchUsers()
  }, [])

  const getRecommendations = async () => {
    const res = await fetch('/api/recommendation', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user: userSelectRef.current.value })
    })
    const data = await res.json()
    console.log(data)
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
          <select name="user" id="user" ref={userSelectRef}>
            {users.map(user =>
              <option key={user.id} value={user.id}>
                {user.id + ": " + user.name}
              </option>
            )}
          </select>
          <label htmlFor="similarity">{'Similarity '}</label>
          <select name="similarity" id="similarity">
            <option value="euclidean">Euclidean</option>
          </select>
          <label htmlFor="results">{'Results '}</label>
          <input type="text" id="results" />
        </section>
        <section className={styles.section}>
          <button disabled>Find top matching users</button>
          <button onClick={getRecommendations}>Find recommended movies</button>
          <button disabled>Find recommendations, item-based</button>
        </section>
      </main>
    </div>
  )
}
