import getUserId from '../utils/getUserId'

const Query = {
    users(parent, args, { prisma }, info) {
        // info provides info or requst coming from clients
        const opArgs = {
          first: args.first,
          skip: args.skip,
          after: args.after,
          orderBy: args.orderBy
        }

        if (args.query) {
            opArgs.where =  {
                OR: [
                    { name_contains: args.query }
                ]
            }
        }

        return prisma.query.users(opArgs, info)
    },
    myPosts(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy,
            where: {
                author: {
                    id: userId
                }
            }
        }

        if (args.query) {
            opArgs.where.OR = [
                { title_contains: args.query },
                { body_contains: args.query }
            ]
        }

        return prisma.query.posts(opArgs, info)

    },
    posts(parent, args, { prisma }, info) {
        // default is to show only published posts except for user
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy,
            where: {
                published: true
            }
        }

        // adds OR property if a query is included
        if (args.query) {
            opArgs.where.OR = [
                { title_contains: args.query },
                { body_contains: args.query }
            ]
        }

        return prisma.query.posts(opArgs, info)
    },
    comments(parent, args, { prisma }, info) {
        const opArgs = {
          first: args.first,
          skip: args.skip,
          after: args.after,
          orderBy: args.orderBy
        }
        return prisma.query.comments(opArgs, info)
    },
    me(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        return prisma.query.user({
            where: {
                id: userId
            }
        }, info)
    },
    async post(parent, args, { prisma, request }, info) {
        const userId = getUserId(request, false)

        const posts = await prisma.query.posts({
            where: {
                id: args.id,
                OR: [
                    { published: true },
                    { author: 
                        { id: userId 
                        } 
                    }
                ]
            }
        }, info)

        if (posts.length === 0) {
            throw new Error('Post not found')
        }

        return posts[0]
    }
}

export { Query as default }