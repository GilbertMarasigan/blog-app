const Blog = require('../models/blog')

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

module.exports = {
    initialBlogs, blogsInDb
}