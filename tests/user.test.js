import { getFirstName } from '../src/utils/user'

test('Should return first name when given full name', () => {
  const firstName = getFirstName('Jacob Goodwin')

  expect(firstName).toBe('Jacob')
})