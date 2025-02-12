const _ = require('lodash');

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null
    return blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max), blogs[0])
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null

    const authorCounts = _.countBy(blogs, 'author')
    console.log('authorCounts',authorCounts)

    const topAuthor = _.maxBy(_.keys(authorCounts), (author) => authorCounts[author]);
    console.log('topAuthor', topAuthor)

    return {
        author: topAuthor,
        blogs: authorCounts[topAuthor]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}