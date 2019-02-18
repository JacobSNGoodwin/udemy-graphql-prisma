import "cross-fetch/polyfill"
import "@babel/polyfill"
import { gql } from "apollo-boost"

import prisma from "../src/prisma"
import seedDatabase, { userOne, postOne, postTwo } from "./utils/seedDatabase"
import getClient from "./utils/getClient"
import { Prisma } from "prisma-binding"

const client = getClient()

beforeEach(seedDatabase)

test("Should expose public posts", async () => {
  const getPosts = gql`
    query {
      posts {
        id
        body
        title
        published
      }
    }
  `

  const response = await client.query({
    query: getPosts
  })

  expect(response.data.posts.length).toBe(1)
  expect(response.data.posts[0].published).toBe(true)
})

test("Should return users published and unpublished posts", async () => {
  const client = getClient(userOne.jwt)
  const myPosts = gql`
    query {
      myPosts {
        id
        title
        published
      }
    }
  `
  // destructure response.data
  const { data } = await client.query({ query: myPosts })

  expect(data.myPosts.length).toBe(2)
})

test("Should be able to update own post", async () => {
  const client = getClient(userOne.jwt)
  const updatePost = gql`
    mutation {
      updatePost(
        id: "${postOne.post.id}",
        data: {
          published: false
        }
      ){
        id
        title
        body
        published
      }
    }
  `
  const { data } = await client.mutate({ mutation: updatePost })
  // also check database directly for a doc and make sure it is not published
  const exists = await prisma.exists.Post({
    id: postOne.post.id,
    published: false
  })

  expect(data.updatePost.published).toBe(false)
  expect(exists).toBe(true)
})

test("Should create a post", async () => {
  const client = getClient(userOne.jwt)

  const createPost = gql`
    mutation {
      createPost(
        data: {
          title: "A new post"
          body: "This is for a test case"
          published: true
        }
      ) {
        id
        title
        body
        published
      }
    }
  `

  const { data } = await client.mutate({ mutation: createPost })

  const exists = await prisma.exists.Post({
    id: data.createPost.id,
    title: "A new post",
    published: true
  })

  expect(data.createPost.title).toBe("A new post")
  expect(data.createPost.body).toBe("This is for a test case")
  expect(data.createPost.published).toBe(true)
  expect(exists).toBe(true)
})

test("Should delete a post", async () => {
  const client = getClient(userOne.jwt)
  console.log(postTwo.post.id)
  const deletePost = gql`
    mutation {
      deletePost(
        id: "${postTwo.post.id}"
      ){
        id
      }
    }
  `

  const { data } = await client.mutate({ mutation: deletePost })
  const exists = await prisma.exists.Post({
    id: postTwo.post.id
  })

  expect(data.deletePost.id).toBe(postTwo.post.id)
  expect(exists).toBe(false)
})
