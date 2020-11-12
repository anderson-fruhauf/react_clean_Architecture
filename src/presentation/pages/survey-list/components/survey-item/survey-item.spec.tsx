import React from 'react'
import { mockSurveyItem } from '@/domain/test'
import { render, screen } from '@testing-library/react'
import { SurveyItem } from './survey-item'
import { IconName } from '@/presentation/components'

describe('SurveiItem Component', () => {
  test('Shoul render with correct values', () => {
    const survey = mockSurveyItem()
    survey.didAnswer = true
    survey.date = new Date('2020-12-11T00:00:00')
    render(<SurveyItem survey={survey} />)
    expect(screen.getByTestId('icon')).toHaveProperty('src', IconName.thumbUp)
    expect(screen.getByTestId('question')).toHaveTextContent(survey.question)
    expect(screen.getByTestId('day')).toHaveTextContent(survey.date.getDay().toString())
    expect(screen.getByTestId('month')).toHaveTextContent('dez')
    expect(screen.getByTestId('year')).toHaveTextContent(survey.date.getFullYear().toString())
  })
})
