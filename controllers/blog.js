const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.delete('/:id', async (request, response) => {

    const blog = await Blog.findById(request.params.id)

    console.log('blog', blog)

    console.log('request.user._id.toString()', request.user._id.toString())
    console.log('blog.user.toString()', blog.user.id.toString())

    if(request.user._id.toString() === blog.user.id.toString()){
        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
    }
    else{
        return response.status(401).json({ error: 'Blogs can only be deleted by author' })
    }
   
    
    
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

    if (!request.user) {
        return response.status(401).json({ error: 'User not authenticated' })
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: {
            username: request.user.username,
            name: request.user.name,
            id: request.user._id
        }

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