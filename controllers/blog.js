const blogsRouter = require('express').Router()
const { request, response } = require('express')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogsRouter.patch('/:id', async (request, response) => {

    const { title, author, url, likes } = request.body

    const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        { title, author, url, likes },
        { new: true, runValidators: true }
    )

    response.status(200).json(updatedBlog)

})

blogsRouter.post('/', (request, response, next) => {
    const body = request.body

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    })

    blog.likes = blog.likes === undefined ? 0 : blog.likes

    if (blog.title === undefined || blog.url === undefined) {
        response.status(400).json('Bad request')
    }

    blog
        .save()
        .then(savedBlog => {
            response.status(201).json(savedBlog)
        })
        .catch(error => next(error))
})

module.exports = blogsRouter