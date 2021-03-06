const express=require("express");
const bodyParser=require("body-parser");

const app=express();
const port=3001;

// const crawlRouter=require("./router/api/crawl.js");

app.use(bodyParser.urlencoded({ extended: false }));
// https://stackoverflow.com/questions/29960764/what-does-extended-mean-in-express-4-0

app.use('/api/',require('./router/api'));

app.get('/',(req,res)=>{
    res.end("rest api server");
});
app.get('/test',(req,res)=>{
    res.json({
        server:'listening',
        path: '/test',
    });
})

app.listen(port,()=>{
    console.log(`server is listening on port ${port}.`);
});