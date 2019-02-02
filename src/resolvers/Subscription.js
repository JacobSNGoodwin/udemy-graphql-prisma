const Subscription = {
  comment: {
    subscribe(parent, { postId }, { prisma }, info) {
      return prisma.subscription.comment({
        where: {
          node: {
            post: {
              id: postId
            }
          }
        }
      }, info)
    }
  },
  post: {
    subscribe(parnet, args, { db, pubsub }, info) {
      return pubsub.asyncIterator('post')
    }
  }
}

export { Subscription as default }