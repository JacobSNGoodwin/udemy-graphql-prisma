import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466'
})

// prisma.query prisma.mutation prisma.subscription prisma.exists

const createPostForUser = async (authId, data) => {
  const post = await prisma.mutation.createPost({
    data: {
      ...data,
      author: {
        connect: {
          id: authId
        }
      }
    }
  },
    '{ id }'
  )

  const user = await prisma.query.user({
    where: {
      id: authId
    }
  },
    '{ id name email posts { id title published } }'
  )

  return user
}

const updatePostForUser = async (postId, data) => {
  const post  = await prisma.mutation.updatePost({
    data: data,
    where: {
      id: postId
    }
  },
    '{ author { id } }'
  )

  const user = await prisma.query.user({
    where: {
      id: post.author.id
    }
  },
    '{ id name email posts { id title published } }'
  )

  return user
}

// createPostForUser('cjrjtwstd03tk0761aidqzfll', {
//   title: 'Worst Extreme Sports',
//   body: 'Sporty McSporterton',
//   published: true
// })
//   .then(user => {
//     console.log(JSON.stringify(user, undefined, 2))
//   })

// updatePostForUser('cjrln35t4000w0814lk0ifmzq', {
//   title: 'No Longer Live',
//   body: 'Some things cannot last forever',
//   published: false 
// })
//   .then(user => {
//     console.log(JSON.stringify(user, undefined, 2))
//   })