const Router = require('koa-router')

const momentRouter = new Router({prefix: '/moment'})
const { create, detail, list, update, remove} = require('../controller/moment.controller.js')

const {
    verifyAuth,
    verifyPermission
} = require('../middleware/auth.middleware')

momentRouter.post('/', verifyAuth, create)
momentRouter.get('/', list)
momentRouter.get('/:momentId', detail)

momentRouter.patch('/:momentId', verifyAuth, verifyPermission, update) // 修改动态
momentRouter.delete('/:momentId', verifyAuth, verifyPermission, remove) // 修改动态


module.exports = momentRouter