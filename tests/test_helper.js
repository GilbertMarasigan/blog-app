const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        "title": "The new blog",
        "author": "Gilbert Marasigan",
        "url": "website.com",
        "likes": 100,
    },
    {
        "title": "The old blog",
        "author": "Louise Padiernos",
        "url": "website.com",
        "likes": 105,
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDB = async () => {
    const users = await User.find({})
    return users.map(user = user.toJSON)
}

module.exports = {
    initialBlogs, blogsInDb, usersInDB
}