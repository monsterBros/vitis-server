import Router from '@koa/router'
import UserModel from '../database/User/model'
import successHandler from '../utils/successHandler'
import DBException from '../exception/dbException'
import ParamException from '../exception/paramException'

const router = new Router()

router.get('/list',async (context) => {
        try {
                const list =  await UserModel.find({}, {_id: 0, password: 0}).exec()  
                successHandler(context, list)
        } catch (error: any) {
                throw new DBException(error)
        }
        
})

router.post('/add', async (ctx) => {
        const { account, password, editable = false, releasable = false } = (ctx.request.body as any)
        const user = new UserModel({
                account,
                password,
                editable,
                releasable
        });
        await user.add()
        successHandler(ctx)
})

router.post('/update', async (ctx) => {
        const { account, editable = false, releasable = false } = (ctx.request.body as any)
        if (!account) {
                throw new ParamException('account是必填字段')   
        }
        const result = await UserModel.findOneAndUpdate({account}, {editable, releasable})
        if (!result) {
                throw new ParamException(`不存在${account}`)
        } else {
                successHandler(ctx)
        }
})

router.post('/del', async (ctx) => {
        const { account } = (ctx.request.body as any)
        await UserModel.findOneAndDelete({account})
        successHandler(ctx)
})

export default router
