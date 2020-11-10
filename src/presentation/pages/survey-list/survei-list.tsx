import { Footer, Header, Icon, IconName } from '@/presentation/components'
import React from 'react'
import Styles from './survei-list-styles.scss'

const SurveiList: React.FC = () => {
  return (
    <div className={Styles.surveiListWrap}>
      <Header />
      <div className={Styles.contentWrap}>
        <h2>Enquetes</h2>
        <ul>
          <li>
            <div className={Styles.surveyContent}>
              <Icon iconName={IconName.thumbUp} className={Styles.iconWrap} />
              <time>
                <span className={Styles.day}>22</span>
                <span className={Styles.month}>02</span>
                <span className={Styles.year}>2020</span>
              </time>
              <p>Qual seu framwork web favorito?</p>
            </div>
            <footer>Ver Resultado</footer>
          </li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <Footer />
    </div>
  )
}

export default SurveiList
