const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

const protect = async (request, response, next) => {
    let token;

    if (request.headers.authorization && request.headers.authorization.startsWith('Bearer')) {
        try {
            token = request.headers.authorization.split(' ')[1]; // Get token after 'Bearer'

            // Verify token
            const decoded = jwt.verify(token, process.env.SECRET);

            // 🔹 Await should now work properly
            request.user = await User.findById(decoded.id).select('-password');

            next(); // Ensure the request moves to the next middleware/route
        } catch (error) {
            return response.status(401).json({ error: 'Not authorized, invalid token' });
        }
    } else {
        return response.status(401).json({ error: 'No token, authorization denied' });
    }
}

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

blogsRouter.post('/', protect, (request, response, next) => {

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