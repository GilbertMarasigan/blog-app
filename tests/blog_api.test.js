const { test, after , beforeEach } = require('node:test')
const assert = require('assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')

beforeEach(async () => {
    console.log('Starting beforeEach')

    await Blog.deleteMany({})
    console.log('cleared')

    const blogsObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogsObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
    
})

test.only('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})


after(async () => {
    await mongoose.connection.close()
})