const express=require("express");
const mongoose=require("mongoose");
const Webtoon=require("../model/webtoons.js");
const config=require("../config/mongodbUrl.js");

const router=express.Router();

const crawlNaver=require("../api/crawlNaver.js");
const crawlDaum=require("../api/crawlDaum.js");

const secret="abcdefg";

router.post('/naver',(req,res)=>{
    if(req.body.secret===secret){
        crawlNaver().then(()=>{return ;});

        res.json({
            path: 'HTTP POST /naver',
            crawled: 'true'
        });
    }else {
        res.json({
            path: 'HTTP POST /naver'
        })
    }
}).get('/naver',(req,res)=>{
    res.json({
        path:'HTTP GET /crawlNaver'
    })
})

router.get('/daum',(req,res)=>{
    crawlDaum().then(()=>{return ;});
    res.json({
        path: 'HTTP GET /daum',
    })
})

router.get('/reset',(req,res)=>{
    Promise.all(
        [crawlDaum(),crawlNaver()]
    ).then(()=>console.log("fin"))
    
    res.json({
        path: 'HTTP GET /reset'
    })
})

router.get('/lists',(req,res)=>{
    Webtoon.find((err,data)=>{
        if(err)console.error(err)
        res.json(data)
    });
})

module.exports=router;
mongoose.connect(config.url,{useNewUrlParser: true});