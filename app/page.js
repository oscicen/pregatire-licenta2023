'use client'
import { Heading } from '@chakra-ui/react'

import styles from './page.module.scss'

export default function Home() {
  return (
    <div className={styles.end}>
      <Heading as='h2' size='1xl' noOfLines={1}>
        Felicitări tuturor! 🎉
      </Heading>
    </div>
  )
}
