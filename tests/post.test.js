import 'cross-fetch/polyfill'
import '@babel/polyfill'

import prisma from '../src/prisma'
import seedDatabase, { userOne, postOne, postTwo } from './utils/seedDatabase'
import getClient from './utils/getClient'
import {
  getPosts,
  myPosts,
  updatePost,
  createPost,
  deletePost
} from './utils/operations'

const client = getClient()

beforeEach(seedDatabase)

test('Should expose public posts', async () => {
  const response = await client.query({
    query: getPosts
  })

  expect(response.data.posts.length).toBe(1)
  expect(response.data.posts[0].published).toBe(true)
})

test('Should return users published and unpublished posts', async () => {
  const client = getClient(userOne.jwt)

  // destructure response.data
  const { data } = await client.query({ query: myPosts })

  expect(data.myPosts.length).toBe(2)
})

test('Should be able to update own post', async () => {
  const variables = {
    id: postOne.post.id,
    data: {
      published: false
    }
  }
  const client = getClient(userOne.jwt)

  const { data } = await client.mutate({ mutation: updatePost, variables })
  // also check database directly for a doc and make sure it is not published
  const exists = await prisma.exists.Post({
    id: postOne.post.id,
    published: false
  })

  expect(data.updatePost.published).toBe(false)
  expect(exists).toBe(true)
})

test('Should create a post', async () => {
  const variables = {
    data: {
      title: 'A new post',
      body: 'This is for a test case',
      published: true
    }
  }
  const client = getClient(userOne.jwt)

  const { data } = await client.mutate({ mutation: createPost, variables })

  const exists = await prisma.exists.Post({
    id: data.createPost.id,
    title: 'A new post',
    published: true
  })

  expect(data.createPost.title).toBe('A new post')
  expect(data.createPost.body).toBe('This is for a test case')
  expect(data.createPost.published).toBe(true)
  expect(exists).toBe(true)
})

test('Should delete a post', async () => {
  const variables = {
    id: postTwo.post.id
  }
  const client = getClient(userOne.jwt)

  const { data } = await client.mutate({ mutation: deletePost, variables })
  const exists = await prisma.exists.Post({
    id: postTwo.post.id
  })

  expect(data.deletePost.id).toBe(postTwo.post.id)
  expect(exists).toBe(false)
})
