import 'cross-fetch/polyfill'
import '@babel/polyfill'

import prisma from '../src/prisma'
import seedDatabase, {
  userOne,
  postOne,
  commentOne,
  commentTwo
} from './utils/seedDatabase'
import getClient from './utils/getClient'
import {
  deleteComment,
  subscribeToComments,
  subscribeToPosts
} from './utils/operations'

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

test('Should subscribe to comments for a post', async done => {
  const variables = {
    postId: postOne.post.id
  }

  client.subscribe({ query: subscribeToComments, variables }).subscribe({
    next(response) {
      expect(response.data.comment.mutation).toBe('DELETED')
      done()
    }
  })

  // Change a comment to trigger next
  await prisma.mutation.deleteComment({
    where: {
      id: commentOne.comment.id
    }
  })
})

test('Should subscribe to post changes', async () => {
  client.subscribe({ query: subscribeToPosts }).subscribe({
    next(response) {
      expect(response.data.post.mutation).toBe('DELETED')
      done()
    }
  })

  await prisma.mutation.deletePost({
    where: {
      id: postOne.post.id
    }
  })
})
