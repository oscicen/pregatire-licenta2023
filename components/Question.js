'use client'
import { useState } from 'react';
import classNames from 'classnames';
import { Box, Button, ButtonGroup } from '@chakra-ui/react'

import styles from './question.module.scss'

const Question = ({ question, goNext, isList }) => {
  const [guess, setGuess] = useState('')
  const [check, setCheck] = useState(false)

  const onNextQuestion = () => {
    setGuess('')
    setCheck(false)

    const selectedAnswer = question.answers.find(a => a.id === guess)
    goNext(selectedAnswer.isTrue)
  }

  const onAnswerSelect = (answerId) =>{
    if (isList) return
    setGuess(answerId === guess ? '' : answerId);
  }

  return (
    <div className={classNames(styles.container, { [styles.list]: isList })}>
      <Box w='100%' borderRadius='md' borderWidth='1px' p={4}>
        <h3 dangerouslySetInnerHTML={{ __html: `${ question.number }. ${ question.question }` }} />
        <div className={ styles.answers }>
          { question.answers.map(answer => (
            <button
              className={classNames({
                [styles.guess]: answer.id === guess,
                [styles.wrong]: answer.id === guess && check && !answer.isTrue,
                [styles.correct]: (check || isList) && answer.isTrue
              })}
              onClick={() => onAnswerSelect(answer.id) }
              key={answer.id}
            >
              { `${answer.id}) ${answer.answer}` }
            </button>
          )) }
        </div>
      </Box>
      { !isList && (
        <ButtonGroup className={styles.actions}>
          <Button isDisabled={!guess.length} onClick={() => setCheck(true)}>Verifica</Button>
          <Button isDisabled={!check} onClick={onNextQuestion}>Urmatoarea Intrebare</Button>
        </ButtonGroup>
      ) }
    </div>
  );
};

export default Question;
