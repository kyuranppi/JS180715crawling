const express=require("express");
const app=express();
const port = 3000;

const path=require("path");

const axios=require("axios");

app.set('views',path.resolve(path.dirname(''))+'/views')
app.set('view engine', 'ejs');

//추가
app.use('/public',express.static(path.resolve(path.dirname(''))+'/public'))
const cookieParser=require('cookie-parser');
const {secret}=require('./client_config');
const {authToken}=require('./middlewares/auth');

app.use(cookieParser());
app.set('jwt-secret',secret);

app.use('/*', authToken)

app.get('/',(req,res)=>{
    res.render('pages/index',{
        info: req.decoded, 
    })
})

app.listen(port,()=>{
    console.log("client server is running on %d",port);
})

app.get('/webtoons',(req,res)=>{
    axios.get('http://localhost:3001/api/crawl/lists')
    .then(response=>{
        res.render('pages/webtoons',{
            webtoons: response.data,
            info: req.decoded,
        });
    })
})

const {socials}=require('./client_config');
app.get('/signin',(req,res)=>{
    const redirectURI = 'http://localhost:3001/api/auth/naver';
    const state ='RANDOM_STATE';
    const 
    naverlogin_url='https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + socials.naver.client_id + '&redirect_uri=' + redirectURI + '&state=' + state;

    res.render('pages/signin',{
        naverlogin: naverlogin_url,
        info: req.decoded,
    });
})


app.get('/signup',(req,res)=>{
    res.render('pages/signup',{
        info: req.decoded,
    });
})

app.get('/signout',(req,res)=>{
    req.decoded=undefined;
    res.clearCookie('token').redirect('/');
})

