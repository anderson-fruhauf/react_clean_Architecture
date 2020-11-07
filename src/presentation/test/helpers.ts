import { RenderResult } from '@testing-library/react'

export const elementChildCount = (
  sut: RenderResult,
  fieldTestId: string
): number => {
  const element = sut.getByTestId(fieldTestId)
  return element.childElementCount
}

export const buttonIsDisabled = (
  sut: RenderResult,
  fieldTestId: string
): boolean => {
  const element = sut.getByTestId(fieldTestId) as HTMLButtonElement
  return element.disabled
}
