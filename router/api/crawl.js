const express=require("express");
const mongoose=require("mongoose");
const Webtoon=require("../../model/webtoons.js");

// const config=require("../config/mongodbUrl.js");
// const {secret}=require("../../config/secret.js");
const config=require("../../config");

const router=express.Router();

const crawlNaver=require("./crawl/crawlNaver.js");
const crawlDaum=require("./crawl/crawlDaum.js");


router.post('/naver',(req,res)=>{
    if(req.body.secret===config.secret){
        crawlNaver().then(()=>{return ;});

        res.json({
            path: 'HTTP POST /naver',
            crawled: true
        });
    }else {
        res.json({
            path: 'HTTP POST /naver'
        })
    }
}).get('/naver',(req,res)=>{
    res.json({
        path:'HTTP GET /naver'
    })
})

router.post('/daum',(req,res)=>{
    if(req.body.secret===config.secret){
        crawlDaum().then(()=>{return ;});

        res.json({
            path: 'HTTP POST /daum',
            crawled: true
        });
    }else {
        res.json({
            path: 'HTTP POST /daum'
        })
    }
}).get('/naver',(req,res)=>{
    res.json({
        path:'HTTP GET /daum'
    })
})

router.post('/reset',(req,res)=>{
    if(req.body.secret===config.secret){
        res.json({
            path: 'HTTP POST /reset',
            crawled: true
        })
        Promise.all(
            [crawlDaum(),crawlNaver()]
        ).then(()=>{
            console.log("============= fin ============")
        })
    }else{
        res.json({
            path: 'HTTP POST /reset'
        })
    }
}).get('/reset',(req,res)=>{
    res.json({
        path: 'HTTP GET /reset'
    });
})

router.get('/lists',(req,res)=>{
    Webtoon.find((err,data)=>{
        if(err)console.error(err)
        res.json(data)
    });
})

module.exports=router;
mongoose.connect(config.mongodbUrl,{useNewUrlParser: true});