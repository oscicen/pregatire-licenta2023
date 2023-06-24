'use client'
import { useEffect, useState, useRef } from 'react'
import classNames from 'classnames'
import Cookies from 'js-cookie'
import {
  Button,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Switch
} from '@chakra-ui/react'

import Question from '@/components/Question'
import shuffle from '@/lib/shuffleArray'
import { data } from '@/db/data'

import styles from './page.module.scss'

const defaultProfile = {
  cCategoryId: 0,
  cQuestionsId: [],
  cIsRandom: false,
  cStats: {
    answered: 0,
    correct: 0
  }
}

export default function Home() {
  const [categoryId, setCategoryId] = useState(0)
  const [questionsId, setQuestionsId] = useState([])
  const [category, setCategory] = useState(null)
  const [question, setQuestion] = useState(null)
  const [isRandom, setIsRandom] = useState(false)
  const [open, setOpen] = useState(false)
  const [stats, setStats] = useState({ answered: 0, correct: 0 })

  const didMountRef = useRef(false);

  useEffect(() => {
    // Delete old cookie
    if (Cookies.get('stats')) {
      Cookies.remove('stats')
    }

    // Get and set initial state from profile cookie
    if (Cookies.get('profile')) {
      const { cCategoryId, cQuestionsId, cIsRandom, cStats } = JSON.parse(Cookies.get('profile'))
      setIsRandom(cIsRandom)
      setStats(cStats)
      setCategoryId(cCategoryId)
      setQuestionsId(Object.values(cQuestionsId))
    } else {
      Cookies.set('profile', JSON.stringify(defaultProfile), { expires: 7 })
    }
  }, []);

  useEffect(() => {
    // Quick fix
    if (!questionsId.length) {
      generateQuestionsId()
    }
  }, [])

  useEffect(() => {
    if (didMountRef.current) { 
      generateQuestionsId()
    }
    didMountRef.current = true;
  }, [categoryId])

  useEffect(() => {
    if (questionsId.length) {
      const updatedQuestionsId = [...questionsId]
      setQuestionsId(isRandom ? shuffle(updatedQuestionsId) : updatedQuestionsId.sort((a, b) => a - b))
    }
  }, [isRandom])

  useEffect(() => {
    const newCategory = data.find(c => c.id === categoryId);
    const newQuestion = newCategory.questions.find(q => q.id === questionsId[0])
    setCategory(newCategory)
    setQuestion(newQuestion)
  }, [categoryId, questionsId])

  const generateQuestionsId = () => {
    const ids = Array.from(Array(data[categoryId].questions.length).keys())

    const updatedQuestionsId = isRandom ? shuffle(ids) : ids
    setQuestionsId(updatedQuestionsId)

    const cookie = JSON.parse(Cookies.get('profile'))
    Cookies.set('profile', JSON.stringify({ ...cookie, cQuestionsId: { ...updatedQuestionsId } }))
  }

  const nextQuestion = () => {
    if (questionsId.length > 1) {
      const updatedQuestionsId = [...questionsId]
      updatedQuestionsId.shift()
      setQuestionsId(updatedQuestionsId)

      const cookie = JSON.parse(Cookies.get('profile'))
      Cookies.set('profile', JSON.stringify({ ...cookie, cQuestionsId: { ...updatedQuestionsId } }))
    } else {
      generateQuestionsId()
    }
  }

  const handleCategoryChange = (selectedCategory) => {
    if (categoryId !== selectedCategory) {
      setCategoryId(selectedCategory)

      const cookie = JSON.parse(Cookies.get('profile'))
      Cookies.set('profile', JSON.stringify({ ...cookie, cCategoryId: selectedCategory}))
    }
  }

  const resetStats = () => {
    setStats({ answered: 0, correct: 0 })

    const cookie = JSON.parse(Cookies.get('profile'))
    Cookies.set('profile', JSON.stringify({ ...cookie, cStats: { answered: 0, correct: 0 }}))
  }

  const onNext = (correct) => {
    let newStats;
    if (correct) {
      newStats = { answered: stats.answered + 1, correct: stats.correct + 1 }
    } else {
      newStats = { answered: stats.answered + 1, correct: stats.correct }
    }

    setStats({ ...newStats })
    const cookie = JSON.parse(Cookies.get('profile'))
    Cookies.set('profile', JSON.stringify({ ...cookie, cStats: { ...newStats } }))

    nextQuestion()
  }

  const handleRandom = (value) => {
    setIsRandom(value)

    const cookie = JSON.parse(Cookies.get('profile'))
    Cookies.set('profile', JSON.stringify({ ...cookie, cIsRandom: value }))
  }

  return (
    <main className={styles.main}>
      <div className={styles.actions}>
        <Button className={styles.modalBtn} onClick={() => setOpen(true)}>Setari</Button>
        <div className={styles.stats}>
          <div className={styles.correct}><p><span>Corecte:</span> {stats.correct}</p></div>
          <div className={styles.wrong}><p><span>Gresite:</span> {stats.answered - stats.correct}</p></div>
          <div className={styles.percentage}><p>{Math.floor((stats.correct / stats.answered) * 100 || 0)}%</p></div>
        </div>
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Setari</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className={styles.filters}>
              <p>Selecteaza categoria:</p>
              { data.map(c => (
                <Box
                  className={classNames({ [styles.active]: categoryId === c.id })}
                  key={c.id}
                  as='button'
                  borderRadius='md'
                  borderWidth='1px'
                  p={2}
                  onClick={() => handleCategoryChange(c.id)}
                >
                  <h4>{ c.category }</h4>
                </Box>
              )) }
              <br />
              <p>Mod afisare aleatoriu?</p>
              <Switch isChecked={isRandom} onChange={(e) => handleRandom(e.target.checked)} />
              <br />
              <p>Reseteaza progresul:</p>
              <Button mr={3} onClick={() => resetStats()}>
                Reset
              </Button>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={() => setOpen(false)}>
              Inchide
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {category && (
        <div className={styles.categoryInfo}>
          <div>
            <h2>{`${category.number}. ${category.category}`}</h2>
            <p>{category.teacher}</p>
          </div>
        </div>
      )}
      {question && <Question question={question} goNext={onNext} />}
    </main>
  )
}
