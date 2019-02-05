import getUserId from '../utils/getUserId'

const User = {
  // use fragment to make sure we get the id, so that way we can get email even if id isn't queried
  email: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, { request }, info) {
      // if not authenticated, get null back
      const userId = getUserId(request, false)
  
      if (userId && userId === parent.id) {
        return parent.email
      } else {
        return null
      }
    }
  },
  posts: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, { prisma }, info) {
      // if not authenticated, get null back
      return prisma.query.posts({
        where: {
          published: true,
          author: {
            id: parent.id
          }
        }
      })
    }
  }
}

export { User as default }