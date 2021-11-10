import Head from 'next/head'
import styles from '../styles/index.module.css'

import { useEffect, useState } from 'react'

export default function Home() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/user')
      const data = await res.json()
      setUsers(data)
    }

    fetchUsers()
  }, [])

  return (
    <div>
      <Head>
        <title>2DV515 | A1</title>
        <meta name="description" content="LNU course 2DV515" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.center}>
        <div className={`${styles.flex} ${styles.gap}`}>
          <div>
            <label for="user">{'User '}</label>
            <select name="user" id="user">
              {users.map(user =>
                <option key={user.id} value={user.id}>
                  {user.id + ": " + user.name}
                </option>
              )}
            </select>
          </div>
          <div>
            <label for="similarity">{'Similarity '}</label>
            <select name="similarity" id="similarity">
              <option value="euclidean">Euclidean</option>
            </select>
          </div>
          <div>
            <label for="results">{'Results '}</label>
            <input type="text" id="results" />
          </div>
        </div>
        <div className={`${styles.flex} ${styles.gap}`}>
          <button>Find top matching users</button>
          <button>Find recommended movies</button>
          <button>Find recommendations, item-based</button>
        </div>
      </main>
    </div>
  )
}
