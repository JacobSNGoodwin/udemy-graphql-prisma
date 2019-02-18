import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../src/prisma'

const userOne = {
  input: {
    name: 'Bob',
    email: 'bob@bob.com',
    password: bcrypt.hashSync('blablabla1234')
  },
  user: undefined,
  jwt: undefined
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

  await prisma.mutation.createPost({
    data: {
      title: 'A published post',
      body: 'I cannot wait for my readers to read this',
      published: true,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  })
  
  await prisma.mutation.createPost({
    data: {
      title: 'An unpublished post',
      body: 'I hope nobody reads this ever',
      published: false,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  })
}

export { seedDatabase as default, userOne }