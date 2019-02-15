import { getFirstName, isValidPassword } from '../src/utils/user'
import { text } from 'body-parser';

test('Should return first name when given full name', () => {
  const firstName = getFirstName('Jacob Goodwin')

  expect(firstName).toBe('Jacob')
})

test('Should return first name when given first name', () => {
  const firstName = getFirstName('Jen')

  expect(firstName).toBe('Jen')
})

test('Should reject password less than 8 characters', () => {
  const isValid = isValidPassword('jdi20n')
  expect(isValid).toBe(false)
})

test('Should reject password that contains the world password', () => {
  const isValid1 = isValidPassword('daflhPAssworD')
  const isValid2 = isValidPassword('password1234')
  expect(isValid1).toBe(false)
  expect(isValid2).toBe(false)
})

test('Should correctly validate a valid password', () => {
  const isValid = isValidPassword('lkfja3o924,s1')

  expect(isValid).toBe(true)
})