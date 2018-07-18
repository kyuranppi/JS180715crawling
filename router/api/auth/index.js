const router=require('express').Router();
const controller=require('./auth.controller');

router.get('/',(req,res)=>{
    res.json({
        path:'/api/auth'
    })
})
router.get('/naver',controller.naver)
module.exports=router;