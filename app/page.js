'use client'
import { useEffect, useState } from 'react'
import classNames from 'classnames'
import { Box } from '@chakra-ui/react'

import Question from '@/components/Question'
import { data } from '@/db/data'

import styles from './page.module.scss'

export default function Home() {
  const [categoryId, setCategoryId] = useState(2);
  const [questionId, setQuestionId] = useState(55);
  const [category, setCategory] = useState(null);
  const [question, setQuestion] = useState(null);
  const [filters, setFilters] = useState([]);
  const [isRandom, setIsRandom] = useState(false);

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

  return (
    <main className={styles.main}>
      <div className={styles.filters}>
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
      </div>
      {category && (
        <div className={styles.categoryInfo}>
          <h2>{`${category.number}. ${category.category}`}</h2>
          <p>{category.teacher}</p>
        </div>
      )}
      {question && <Question question={question} goNext={isRandom ? randomQuestion : nextQuestion} />}
    </main>
  )
}
