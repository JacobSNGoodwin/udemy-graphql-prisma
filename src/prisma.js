import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466'
})

// prisma.query prisma.mutation prisma.subscription prisma.exists

// prisma.query.users(null, '{id name posts{ id title } }')
//   .then(data => {
//     console.log(JSON.stringify(data, undefined, 2))
//   })

// prisma.query.comments(null, '{id text author{ id name } }')
//   .then(data => {
//     console.log(JSON.stringify(data, undefined, 2))
//   })

// prisma.mutation.createPost({
//   data: {
//     title: "Post to be published!",
//     body: "Are you excited",
//     published: false,
//     author: {
//       connect: {
//         id: "cjrjtwstd03tk0761aidqzfll"
//       }
//     }
//   }
// },
// '{ id title body published }'
// )
//   .then((data) => {
//     console.log(data)
//     return prisma.query.users(null, '{id name posts{ id title } }')
//   })
//   .then(data => {
//     console.log(JSON.stringify(data, undefined, 2))
//   })

prisma.mutation.updatePost({
  data: {
    body: "I hope your excitement isn't waning :(",
    published: true
  },
  where: {
    id: "cjrlnp4co00230814zdgixyd3"
  }
},
  '{id title body published author {name}}'
)
  .then((data) => {
    console.log('Created Post...')
    console.log(data)
    return prisma.query.posts(null, '{id body title published}')
  })
  .then((data) => {
    console.log('All Created Posts...')
    console.log(data)
  })
  .catch(error => {
    console.log(error)
  })