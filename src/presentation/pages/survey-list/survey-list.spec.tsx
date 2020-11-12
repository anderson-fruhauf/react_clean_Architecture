import React from 'react'
import { render, screen } from '@testing-library/react'
import { SurveiList } from '@/presentation/pages'
import { LoadSurveyList } from '@/domain/usecases'

class LoadSurveyListSpy implements LoadSurveyList {
  loadAll = jest.fn()
}

type SutType = {
  loadSurveyListSpy: LoadSurveyListSpy
}

const makeSut = (): SutType => {
  const loadSurveyListSpy = new LoadSurveyListSpy()
  render(<SurveiList loadSurveyList={loadSurveyListSpy} />)
  return { loadSurveyListSpy }
}

describe('SurveyList Component', () => {
  test('Shoul present 4 empty items on start', () => {
    makeSut()
    const surveyList = screen.getByTestId('survey-list')
    expect(surveyList.querySelectorAll('li:empty')).toHaveLength(4)
  })
  test('Shoul call LoadSurveyList', () => {
    const { loadSurveyListSpy } = makeSut()
    expect(loadSurveyListSpy.loadAll).toHaveBeenCalled()
  })
})
