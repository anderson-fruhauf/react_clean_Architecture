import { Footer, Header } from '@/presentation/components'
import React, { useEffect } from 'react'
import { SurveyItemEmpty } from './components'
import Styles from './survei-list-styles.scss'
import { LoadSurveyList } from '@/domain/usecases'

type Props = {
  loadSurveyList: LoadSurveyList
}

const SurveiList: React.FC<Props> = ({ loadSurveyList }: Props) => {
  useEffect(() => {
    loadSurveyList.loadAll()
  }, [])

  return (
    <div className={Styles.surveiListWrap}>
      <Header />
      <div className={Styles.contentWrap}>
        <h2>Enquetes</h2>
        <ul data-testid="survey-list">
          <SurveyItemEmpty />
        </ul>
      </div>
      <Footer />
    </div>
  )
}

export default SurveiList
