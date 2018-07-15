const express=require("express");
const app=express();
const port = 3000;

const path=require("path");

const axios=require("axios");

app.set('views',path.resolve(path.dirname(''))+'/views')
app.set('view engine', 'ejs');

app.get('/',(req,res)=>{
    res.render('pages/index')
})

app.listen(port,()=>{
    console.log("client server is running on %d",port);
})

app.get('/webtoons',(req,res)=>{
    axios.get('http://localhost:3001/api/crawl/lists')
    .then(response=>{
        res.render('pages/webtoons',{
            webtoons: response.data
        });
    })
})


app.get('/signin',(req,res)=>{
    res.render('pages/signin');
})


app.get('/signup',(req,res)=>{
    res.render('pages/signup');
})

