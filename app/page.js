'use client'
import { useEffect, useState } from 'react'
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
import CategoryStats from '@/components/CategoryStats'
import { data } from '@/db/data'

import styles from './page.module.scss'

export default function Home() {
  const [categoryId, setCategoryId] = useState(2);
  const [questionId, setQuestionId] = useState(55);
  const [category, setCategory] = useState(null);
  const [question, setQuestion] = useState(null);
  const [filters, setFilters] = useState([]);
  const [isRandom, setIsRandom] = useState(false);
  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState({ answered: 0, correct: 0 });

  useEffect(() => {
    if (Cookies.get('stats')) {
      setStats(JSON.parse(Cookies.get('stats')));
    } else {
      Cookies.set('stats', JSON.stringify({ answered: 0, correct: 0 }), { expires: 7 });
    }
  }, []);

  useEffect(() => {
    const newCategory = data.find(c => c.id === categoryId);
    const newQuestion = newCategory.questions.find(q => q.id === questionId);
    setCategory(newCategory);
    setQuestion(newQuestion);
  }, [categoryId, questionId])

  useEffect(() => {
    if (isRandom) {
      randomQuestion()
    } else {
      setCategoryId(filters.length ? filters[0] : 0);
      setQuestionId(0)
    }
  }, [filters])

  const randomQuestion = () => {
    const noOfCategories = filters.length || data.length;
    const randomCategory = Math.floor(Math.random() * (noOfCategories - 0) + 0);
    const noOfQuestions = filters.length ? data.find(c => c.id === filters[randomCategory]).questions.length : data[randomCategory].questions.length;
    const randomQuestion = Math.floor(Math.random() * (noOfQuestions - 0) + 0);
    setQuestionId(randomQuestion);
    setCategoryId(filters.length ? filters[randomCategory] : randomCategory);
  }

  const nextQuestion = (filter) => {
    if (data[categoryId].questions[questionId + 1]) {
      setQuestionId(questionId + 1)
    } else if (data[categoryId + 1]) {
      setCategoryId(categoryId + 1)
      setQuestionId(0)
    } else {
      setCategoryId(0)
      setQuestionId(0)
    }
  }

  const handleFilter = (filterId) => {
    let newFilters;
    if (filters.includes(filterId)) {
      newFilters = [...filters].filter(f => f !== filterId)
    } else {
      newFilters = [...filters, filterId]
    }
    setFilters(newFilters.sort((a ,b) => a - b));
  }

  const resetStats = () => {
    setStats({ answered: 0, correct: 0 });
    Cookies.set('stats', JSON.stringify({ answered: 0, correct: 0 }), { expires: 7 });
  }

  const onNext = (correct) => {
    let newStats;
    if (correct) {
      newStats = { answered: stats.answered + 1, correct: stats.correct + 1 }
    } else {
      newStats = { answered: stats.answered + 1, correct: stats.correct }
    }

    setStats({ ...newStats })
    Cookies.set('stats', JSON.stringify({ ...newStats }), { expires: 7 });

    isRandom ? randomQuestion() : nextQuestion()
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
                  className={classNames({ [styles.active]: filters.includes(c.id) })}
                  key={c.id}
                  as='button'
                  borderRadius='md'
                  borderWidth='1px'
                  p={2}
                  onClick={() => handleFilter(c.id)}
                >
                  <h4>{ c.category }</h4>
                </Box>
              )) }
              <br />
              <p>Mod afisare aleatoriu?</p>
              <Switch isChecked={isRandom} onChange={(e) => setIsRandom(e.target.checked)} />
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
          <CategoryStats category={category} />
        </div>
      )}
      {question && <Question question={question} goNext={onNext} />}
    </main>
  )
}
