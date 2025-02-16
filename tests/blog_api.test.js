const { test, after, beforeEach } = require('node:test')
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

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('verify that the unique identifier property of the blog posts is named id', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    response.body.forEach(blog => {
        assert.ok(blog.id !== undefined, 'Each blog should have an "id" property');
        assert.strictEqual(typeof blog.id, 'string', 'The "id" property should be a string');
    });
})

test('successful post adds one to the blog', async () => {
    const newBlog = {
        "title": "The new test blog",
        "author": "Gilbert Testmaster",
        "url": "test.com",
        "likes": 999,
        "id": "67ab1b7b9d0cc4568f65e311"
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const contents = response.body.map(r => r.title)

    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

    assert(contents.includes('The new test blog'))

})

test('verify that if the likes property is missing from the request, it will default to the value 0', async () => {

    const newBlog = {
        "title": "The new test blog",
        "author": "Gilbert Testmaster",
        "url": "test.com",
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const blog = response.body.find(blog => blog.title === 'The new test blog')
    console.log('blog', blog)

    assert.ok(newBlog.likes === undefined, 'not an undefined sample');
    assert.strictEqual(blog.likes, 0, 'default like should be 0');

})

test.only('new blog entries does not have title or url returns 400 Bad Request', async () => {
    const newBlog = {
        "title": "The new test blog",
        "author": "Gilbert Testmaster"
    }
    
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)
})

after(async () => {
    await mongoose.connection.close()
})