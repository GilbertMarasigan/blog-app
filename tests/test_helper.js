const Blog = require('../models/blog')

const initialBlogs = [
    {
        "title": "The new blog",
        "author": "Gilbert Marasigan",
        "url": "website.com",
        "likes": 100,
        "id": "67ab1b7b9d0cc4568f65e345"
    },
    {
        "title": "The old blog",
        "author": "Louise Padiernos",
        "url": "website.com",
        "likes": 105,
        "id": "67ab1bc69d0cc4568f65e347"
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs, blogsInDb
}