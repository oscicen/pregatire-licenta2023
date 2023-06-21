'use client'
import Question from '@/components/Question'
import CategoryStats from '@/components/CategoryStats'
import { data } from '@/db/data'

import styles from '../page.module.scss'

export default function Home() {

  const c = data[0];

  return (
    <main className={styles.main}>
      <div key={c.id} className={styles.category}>
        <div className={styles.categoryInfo}>
          <div>
            <h2>{`${c.id}. ${c.category}`}</h2>
            <p>{c.teacher}</p>
          </div>
          <CategoryStats category={c} />
        </div>
        <div>
          { c.questions.map(q => (
            <Question key={q.id} isList question={q} goNext={() => console.log('hi')} />
          )) }
        </div>
      </div>
    </main>
  )
}
