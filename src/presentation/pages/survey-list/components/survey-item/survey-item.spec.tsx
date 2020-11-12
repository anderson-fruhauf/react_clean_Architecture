import React from 'react'
import { mockSurveyItem } from '@/domain/test'
import { render, screen } from '@testing-library/react'
import { SurveyItem } from './survey-item'
import { IconName } from '@/presentation/components'
import { SurveyModel } from '@/domain/models'

const makeSut = (survey: SurveyModel = mockSurveyItem()): void => {
  render(<SurveyItem survey={survey} />)
}

describe('SurveiItem Component', () => {
  test('Shoul render with correct values', () => {
    const survey = Object.assign(mockSurveyItem(), {
      didAnswer: true,
      date: new Date('2020-12-11T00:00:00')
    })
    makeSut(survey)
    expect(screen.getByTestId('icon')).toHaveProperty('src', IconName.thumbUp)
    expect(screen.getByTestId('question')).toHaveTextContent(survey.question)
    expect(screen.getByTestId('day')).toHaveTextContent('11')
    expect(screen.getByTestId('month')).toHaveTextContent('dez')
    expect(screen.getByTestId('year')).toHaveTextContent('2020')
  })

  test('Shoul render with correct values', () => {
    const survey = Object.assign(mockSurveyItem(), {
      didAnswer: false,
      date: new Date('2019-05-03T00:00:00')
    })
    makeSut(survey)
    expect(screen.getByTestId('icon')).toHaveProperty('src', IconName.thumbDown)
    expect(screen.getByTestId('question')).toHaveTextContent(survey.question)
    expect(screen.getByTestId('day')).toHaveTextContent('03')
    expect(screen.getByTestId('month')).toHaveTextContent('mai')
    expect(screen.getByTestId('year')).toHaveTextContent('2019')
  })
})
