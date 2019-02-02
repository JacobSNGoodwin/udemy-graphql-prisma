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
    subscribe(parnet, args, { prisma }, info) {
      return prisma.subscription.post({
        where: {
          node: {
            published: true
          }
        }
      }, info)
    }
  }
}

export { Subscription as default }