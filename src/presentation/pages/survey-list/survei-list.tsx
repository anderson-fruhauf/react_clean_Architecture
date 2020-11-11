import { Footer, Header } from '@/presentation/components'
import React from 'react'
import Styles from './survei-list-styles.scss'

const SurveiList: React.FC = () => {
  return (
    <div className={Styles.surveiListWrap}>
      <Header />
      <div className={Styles.contentWrap}>
        <h2>Enquetes</h2>
        <ul></ul>
      </div>
      <Footer />
    </div>
  )
}

export default SurveiList
