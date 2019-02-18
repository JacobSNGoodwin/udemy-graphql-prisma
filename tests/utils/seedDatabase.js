import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import prisma from "../../src/prisma"

const userOne = {
  input: {
    name: "Bob",
    email: "bob@bob.com",
    password: bcrypt.hashSync("blablabla1234")
  },
  user: undefined,
  jwt: undefined
}

const postOne = {
  input: {
    title: "A published post",
    body: "I cannot wait for my readers to read this",
    published: true
  },
  post: undefined
}

const postTwo = {
  input: {
    title: "An unpublished post",
    body: "I hope nobody reads this ever",
    published: false
  },
  post: undefined
}

const seedDatabase = async () => {
  //Delete test data
  await prisma.mutation.deleteManyPosts()
  await prisma.mutation.deleteManyUsers()

  //Create user one
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input
  })
  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET)

  // Create post one
  postOne.post = await prisma.mutation.createPost({
    data: {
      ...postOne.input,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  })

  //Create post two
  postTwo.post = await prisma.mutation.createPost({
    data: {
      ...postTwo.input,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  })
}

export { seedDatabase as default, userOne, postOne, postTwo }
