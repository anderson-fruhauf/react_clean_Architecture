import { SurveyModel } from '@/domain/models'
import faker from 'faker'

export const mockSurveyList = (quntity: number): SurveyModel[] => {
  const list: SurveyModel[] = []
  do {
    list.push(mockSurveyItem())
    quntity--
  } while (quntity > 0)

  return list
}

export const mockSurveyItem = (): SurveyModel => ({
  id: faker.random.uuid(),
  question: faker.random.words(10),
  answers: [
    {
      answer: faker.random.words(5),
      image: faker.image.imageUrl()
    },
    {
      answer: faker.random.words(5),
      image: faker.image.imageUrl()
    }
  ],
  didAnswer: faker.random.boolean(),
  date: faker.date.recent()
})
