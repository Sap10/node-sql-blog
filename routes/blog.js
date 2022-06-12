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
    const [posts] = await db.query('SELECT tbl_posts.*, tbl_authors.name AS author_name, tbl_authors.email AS author_email FROM tbl_posts INNER JOIN tbl_authors ON tbl_posts.author_id = tbl_authors.id WHERE tbl_posts.id = ?', [id]);
    
    if(!posts || posts.length === 0){
        return res.status(404).render('404');
    }

    const postData = {
        ...posts[0],
        date:posts[0].date.toISOString(),
        humanReadableDate:posts[0].date.toLocaleDateString('en-US',{ 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })
    }


    res.render('post-detail', {post:postData});
}); 

router.get('/postEdit/:id', async (req, res) => {
    const id = [req.params.id];
    const [posts] = await db.query('SELECT * FROM tbl_posts WHERE id = ?', [id]);

    if(!posts || posts.length === 0){
        return res.status(404).render('404');
    }

    res.render('update-post', {post:posts[0]});
});

router.post('/postsUpdate/:id', async (req, res) => {
    const data = [req.body.title, req.body.summary, req.body.content, +req.params.id];
    await db.query('UPDATE tbl_posts SET title = ?, summary = ? , body = ? WHERE id = ?', data);
    res.redirect('/posts');
});

router.post('/postDelete/:id', async (req, res) => {
    const id = req.params.id;
    await db.query('DELETE FROM tbl_posts WHERE id=?', [id]);
    res.redirect('/posts');
});

module.exports = router;