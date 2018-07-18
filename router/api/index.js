const express=require('express');
const router=express.Router();

router.use('/crawl',require('./crawl'));
router.use('/auth',require('./auth'));

module.exports=router;