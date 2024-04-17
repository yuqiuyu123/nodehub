const jwt = require('jsonwebtoken');
const errorType = require('../constants/error-types');
const service = require('../service/user.service');
const userService = require('../service/auth.service');

const md5password = require('../utils/password-handle');

const {PRIVATE_KEY} = require('../app/config');


const verifyLogin = async (ctx, next) => {
    const {name, password} = ctx.request.body
    
    // 验证用户名和密码的逻辑
    if (!name || !password) {
        const error = new Error(errorType.NAME_OR_PASSWORD_IS_REQUIRED);
        return ctx.app.emit('error', error, ctx);
    }

    const result = await service.getUserByName(name);
    const user = result[0];

    if (!user) {
        const error = new Error(errorType.USER_DOES_NOT_EXISTS);
        return ctx.app.emit('error', error, ctx);
    }

    // 密码是否一致
    if (md5password(password) !== user.password) {
        const error = new Error(errorType.PASSWORD_IS_INCORRECT);
        return ctx.app.emit('error', error, ctx);
    }

    ctx.user = user;

    await next()
}

const verifyAuth = async (ctx, next) => {
    const authorization = ctx.headers.authorization;

    if(!authorization) {
        const error = new Error(errorType.UNAUTHORIZED_ERROR);
        ctx.app.emit('error', error, ctx);
    }
    
    const token = authorization.replace('Bearer ', '');
    try {
        const result = jwt.verify(token, PRIVATE_KEY, {
            algorithms: ['RS256']
        })
        ctx.user = result;
        await next()
    } catch (e) {
        const error = new Error(errorType.UNAUTHORIZED_ERROR);
        ctx.app.emit('error', error, ctx);
    }

}

const verifyPermission = async (ctx, next) => {
    try {
        const [resourceKey] = Object.keys(ctx.params)
        const tableName = resourceKey.replace('Id', '')
        const resourceId = ctx.params[resourceKey]

        const {id} = ctx.user
        const isPermission = await userService.checkAuth(tableName, resourceId, id)
        
        if(!isPermission) {
            const error = new Error(errorType.UNPERMISSION);
            return ctx.app.emit('error', error, ctx);
        }

        await next()
    } catch (error) {
        console.log(error);
    }
}

// const verifyPermission = (tableName) => async (ctx, next) => {
//     try {
//         const {momentId} = ctx.params
//         const {id} = ctx.user
//         const isPermission = await userService.checkAuth(tableName, momentId, id)
        
//         if(!isPermission) {
//             const error = new Error(errorType.UNPERMISSION);
//             return ctx.app.emit('error', error, ctx);
//         }

        
//         await next()
//     } catch (error) {
//         console.log(error);
//     }
// }

module.exports = {
    verifyLogin,
    verifyAuth,
    verifyPermission
}