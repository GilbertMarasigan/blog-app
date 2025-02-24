const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

const getTokenFrom = (request) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer')){
        return authorization.replace('Bearer ', '')
    }
    return null
}

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

blogsRouter.post('/', async (request, response, next) => {
    try {
        const token = getTokenFrom(request)
        if (!token) {
            return response.status(401).json({ error: 'Token missing' })
        }

        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!decodedToken.id) {
            return response.status(401).json({ error: 'Token invalid' })
        }

        console.log('decodedToken.id', decodedToken.id)

        const user = await User.findById(decodedToken.id)
        if (!user) {
            return response.status(404).json({ error: 'User not found' })
        }

        if (!request.body.title || !request.body.url) {
            return response.status(400).json({ error: 'Title and URL are required' })
        }

        const blog = new Blog({
            title: request.body.title,
            author: request.body.author,
            url: request.body.url,
            likes: request.body.likes || 0,
            user: {
                username: user.username,
                name: user.name,
                id: user._id
            }
        })

        const savedBlog = await blog.save()
        response.status(201).json(savedBlog)

    } catch (error) {
        next(error)
    }
})

module.exports = blogsRouter