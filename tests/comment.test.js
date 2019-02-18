import 'cross-fetch/polyfill'
import '@babel/polyfill'

import prisma from '../src/prisma'
import seedDatabase, {
  userOne,
  commentOne,
  commentTwo
} from './utils/seedDatabase'
import getClient from './utils/getClient'
import { deleteComment } from './utils/operations'

const client = getClient()

beforeEach(seedDatabase)

test('Should delete own comment', async () => {
  const variables = {
    id: commentTwo.comment.id
  }

  const client = getClient(userOne.jwt)

  await client.mutate({
    mutation: deleteComment,
    variables
  })

  const exists = await prisma.exists.Comment({
    id: commentTwo.comment.id
  })

  expect(exists).toBe(false)
})

test('Should not delete comment by other user', async () => {
  const variables = {
    id: commentOne.comment.id
  }

  const client = getClient(userOne.jwt)

  await expect(
    client.mutate({ mutation: deleteComment, variables })
  ).rejects.toThrow()
})
