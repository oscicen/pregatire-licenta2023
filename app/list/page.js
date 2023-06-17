'use client'
import Question from '@/components/Question'
import { data } from '@/db/data'

import styles from '../page.module.scss'

export default function Home() {

  return (
    <main className={styles.main}>
      { data.map(c => (
        <div key={c.id} className={styles.category}>
          <div className={styles.categoryInfo}>
            <h2>{`${c.id}. ${c.category}`}</h2>
            <p>{c.teacher}</p>
          </div>
          <div>
            { c.questions.map(q => (
              <Question key={q.id} isList question={q} goNext={() => console.log('hi')} />
            )) }
          </div>
        </div>
      )) }
    </main>
  )
}
