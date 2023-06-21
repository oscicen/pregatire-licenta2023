'use client'

import styles from '../app/page.module.scss'

const CategoryStats = ({ category }) => {

  const answerProbability = (category) => {
    const answers = { a: 0, b: 0, c: 0, d: 0 };
    let longest;
    let count = 0;
    category.questions.forEach(q => {
      longest = {};
      q.answers.forEach(a => {
        if (a.answer.length > (longest?.answer?.length || 0) ) {
          longest = a;
        }
        if (a.isTrue) {
          answers[a.id] = answers[a.id] + 1;
        }
      })
      if (longest.isTrue) {
        count = count + 1;
      }
    })
    return (
      <div className={ styles.categoryStats }>
        <p>Varianta corecta de raspuns: { Object.keys(answers).map(a => <span key={a}>{`${ a }: ${ Math.floor(answers[a]/ category.questions.length * 100) }% `}</span>) }</p>
        <p>Probabilitatea ca cel mai lung raspus sa fie cel corect: <span>{ Math.floor(count / category.questions.length * 100) }%</span></p>
      </div>
    )
  }


  return answerProbability(category);
};

export default CategoryStats;
