const Router = require('koa-router');

const commentRouter = new Router({prefix: '/comment'});

const { create, reply, update, remove } = require('../controller/comment.controller.js');

const {
    verifyAuth,
    verifyPermission
} = require('../middleware/auth.middleware')

commentRouter.post('/', verifyAuth, create)

commentRouter.post('/:commentId/reply', verifyAuth, reply)

commentRouter.patch('/:commentId', verifyAuth, verifyPermission, update)

commentRouter.delete('/:commentId', verifyAuth, verifyPermission, remove)


module.exports = commentRouter