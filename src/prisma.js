import { Prisma } from 'prisma-binding'
import { fragmentReplacements } from './resolvers/index'

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466',
  secret: 'thisismysupersecrettext',
  fragmentReplacements
})

export { prisma as default }

// prisma.query prisma.mutation prisma.subscription prisma.exists


// const createPostForUser = async (authId, data) => {
//   const usereExists = await prisma.exists.User({
//     id: authId
//   })

//   if (!usereExists) {
//     throw new Error('Use not found')
//   }

//   const post = await prisma.mutation.createPost({
//     data: {
//       ...data,
//       author: {
//         connect: {
//           id: authId
//         }
//       }
//     }
//   },
//     '{ author { id name email posts { id title published } } }'
//   )

//   return post.author
// }

// createPostForUser('cjrjtwstd03tk0761aidqzfll', {
//   title: 'Best Protein Powders',
//   body: 'Gonna get muskelie',
//   published: true
// })
//   .then(user => {
//     console.log(JSON.stringify(user, undefined, 2))
//   })
//   .catch(error => {
//     console.log(error)
//   })

// const updatePostForUser = async (postId, data) => {
//   const postExists = await prisma.exists.Post({
//     id: postId
//   })

//   if (!postExists)  {
//     throw new Error('Post not found')
//   }

//   const post  = await prisma.mutation.updatePost({
//     data: data,
//     where: {
//       id: postId
//     }
//   },
//     '{ author { id name email posts { id title published } } }'
//   )

//   return post.author
// }


// updatePostForUser('cjrln35t4000w0814lk0ifmzq', {
//   title: 'We are live again!',
//   body: 'Some things come back from the dead',
//   published: true 
// })
//   .then(user => {
//     console.log(JSON.stringify(user, undefined, 2))
//   })
//   .catch(error => {
//     console.log(error)
//   })