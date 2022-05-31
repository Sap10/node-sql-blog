const express = require('express');
const { redirect } = require('express/lib/response');

const router = express.Router();

const db = require('../data/database');

router.get('/', (req, res) => {
    res.redirect('/posts');
});

router.get('/posts', async (req, res) => {
    const [posts] = await db.query('SELECT tbl_posts.*, tbl_authors.name AS author_name FROM tbl_posts INNER JOIN tbl_authors ON tbl_posts.author_id = tbl_authors.id;');
    res.render('posts-list', {posts:posts});
});

router.get('/new-post', async (req, res) => {
    const [authors] = await db.query('SELECT * FROM tbl_authors');
    res.render('create-post', {authors:authors});
});

router.post('/posts', async (req, res) => {
    const data = [req.body.title, req.body.summary, req.body.content, req.body.author];
    await db.query('INSERT INTO tbl_posts (title, summary, body, author_id) VALUES (?)', [data]);
    res.redirect('/new-post');
});

router.get('/posts/:id', async (req, res) => {
    const id = [req.params.id];
    const [post] = await db.query('SELECT * FROM tbl_posts WHERE id = ?', [id]);
    res.render('post-detail', {post:post});
}); 

router.get('/postEdit/:id', async (req, res) => {
    const id = [req.params.id];
    const [post] = await db.query('SELECT * FROM tbl_posts WHERE id = ?', [id]);
    res.render('update-post', {post:post});
});

router.post('/postsUpdate', async (req, res) => {
    const data = [req.body, req.body, req.body, req.params.id];
    await db.query('UPDATE FROM tbl_posts SET (title = ?, summary = ? , body = ?) WHERE id = ?', []);
    res.render();
});

module.exports = router;