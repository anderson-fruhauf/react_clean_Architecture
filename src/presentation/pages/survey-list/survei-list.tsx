import { Footer, Header } from '@/presentation/components'
import React, { useEffect, useState } from 'react'
import { SurveyItem, SurveyItemEmpty } from './components'
import Styles from './survei-list-styles.scss'
import { LoadSurveyList } from '@/domain/usecases'
import { SurveyModel } from '@/domain/models'

type Props = {
  loadSurveyList: LoadSurveyList
}

const SurveiList: React.FC<Props> = ({ loadSurveyList }: Props) => {
  const [state, setState] = useState({
    surveys: [] as SurveyModel[]
  })

  useEffect(() => {
    loadSurveyList.loadAll().then((surveys) => {
      setState({ ...state, surveys })
    })
  }, [])

  return (
    <div className={Styles.surveiListWrap}>
      <Header />
      <div className={Styles.contentWrap}>
        <h2>Enquetes</h2>
        <ul data-testid="survey-list">
          {state.surveys.length ? (
            state.surveys.map((survey: SurveyModel) => <SurveyItem survey={survey} />)
          ) : (
            <SurveyItemEmpty />
          )}
        </ul>
      </div>
      <Footer />
    </div>
  )
}

export default SurveiList
