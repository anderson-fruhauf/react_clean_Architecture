import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { SurveiList } from '@/presentation/pages'
import { LoadSurveyList } from '@/domain/usecases'
import { mockSurveyList } from '@/domain/test'
import { UnexpectedError } from '@/domain/errors'

class LoadSurveyListSpy implements LoadSurveyList {
  loadAll = jest.fn()
}

type SutType = {
  loadSurveyListSpy: LoadSurveyListSpy
}

const makeSut = (loadSurveyListSpy?: LoadSurveyListSpy): SutType => {
  if (!loadSurveyListSpy) {
    loadSurveyListSpy = new LoadSurveyListSpy()
    loadSurveyListSpy.loadAll.mockResolvedValue(mockSurveyList(4))
  }
  render(<SurveiList loadSurveyList={loadSurveyListSpy} />)
  return { loadSurveyListSpy }
}

describe('SurveyList Component', () => {
  test('Shoul present 4 empty items on start', async () => {
    makeSut()
    const surveyList = screen.getByTestId('survey-list')
    expect(surveyList.querySelectorAll('li:empty')).toHaveLength(4)
    await waitFor(() => surveyList)
  })

  test('Shoul call LoadSurveyList', async () => {
    const { loadSurveyListSpy } = makeSut()
    expect(loadSurveyListSpy.loadAll).toHaveBeenCalled()
    await waitFor(() => screen.getByText('Enquetes'))
  })

  test('Should render SurveyItem on success', async () => {
    makeSut()
    const surveyList = screen.getByTestId('survey-list')
    await waitFor(() => surveyList)
    expect(surveyList.querySelectorAll('li.surveyItemWrap')).toHaveLength(4)
  })

  test('Should render error on failure', async () => {
    const loadSurveyListSpy = new LoadSurveyListSpy()
    const error = new UnexpectedError()
    loadSurveyListSpy.loadAll.mockRejectedValue(error)
    makeSut(loadSurveyListSpy)
    await waitFor(() => screen.getByRole('heading'))
    expect(screen.queryByTestId('survey-list')).not.toBeInTheDocument()
    expect(screen.queryByTestId('error')).toHaveTextContent(error.message)
  })
})
