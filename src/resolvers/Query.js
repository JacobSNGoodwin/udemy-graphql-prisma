 const Query = {
    users(parent, args, { prisma }, info) {
        // info provides info or requst coming from clients
        return prisma.query.users(null, info)
    },
    posts(parent, args, { prisma }, info) {
        return prisma.query.posts(null, info)
    },
    comments(parent, args, { db }, info) {
        return db.comments
    },
    me() {
        return {
            id: '123098',
            name: 'Mike',
            email: 'mike@example.com'
        }
    },
    post() {
        return {
            id: '092',
            title: 'GraphQL 101',
            body: '',
            published: false
        }
    }
}

export { Query as default }