import { fireEvent, RenderResult, waitFor } from '@testing-library/react'
import faker from 'faker'

export const elementChildCount = (sut: RenderResult, fieldTestId: string): number => {
  const element = sut.getByTestId(fieldTestId)
  return element.childElementCount
}

export const buttonIsDisabled = (sut: RenderResult, fieldTestId: string): boolean => {
  const element = sut.getByTestId(fieldTestId) as HTMLButtonElement
  return element.disabled
}

export const populateField = (sut: RenderResult, fieldTesteId: string, value = faker.random.word()): void => {
  const field = sut.getByTestId(fieldTesteId)
  fireEvent.input(field, { target: { value: value } })
}

export const populateAllField = (sut: RenderResult, fieldsTesteIds: string[]): void => {
  fieldsTesteIds.forEach((field) => populateField(sut, field))
}

export const waitForTestId = async (sut: RenderResult, fieldTesteId: string): Promise<void> => {
  const field = sut.getByTestId(fieldTesteId)
  await waitFor(() => field)
}
