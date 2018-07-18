const request=require('request');

const {socials,secret}=require('../../../config')

const User=require('../../../model/users');
const jwt=require('jsonwebtoken');

exports.naver=(req,res)=>{
    const code = req.query.code;
    const state = req.query.state;
    const redirectURI = 'http://localhost:3001/api/auth/naver';

    const getToken = ()=>{
        const api_url = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id='
     + socials.naver.client_id + '&client_secret=' + socials.naver.client_secret + '&redirect_uri=' + redirectURI + '&code=' + code + '&state=' + state;
        const options={
            url: api_url,
            headers: {'X-Naver-Client-Id':socials.naver.client_id, 'X-Naver-Client-Secret': socials.naver.client_secret}
        }

        return new Promise((resolve,reject)=>{
            request.get(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                       resolve(JSON.parse(body))  
                } else {
                    res.status(response.statusCode).end();
                    console.log('1 error = ' + response.statusCode);
                }
              });

        })
    }
    const getInfo=(json)=>{
        const token=json.access_token;
        const header="Bearer "+token;
        const api_url='https://openapi.naver.com/v1/nid/me';
        const options={
            url: api_url,
            headers:{'Authorization': header}
        }
        return new Promise((resolve,reject)=>{
            request.get(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    resolve(JSON.parse(body))  
                } else {
                    res.status(response.statusCode).end();
                    console.log('2 error = ' + response.statusCode);
                }
              });
        })
    }
    //db에 등록
    const register=(json)=>{
        User.findOneByEmail(json.response.email)
        .then(user=>{
            if(!user){
                User.create(json)
            }
        })
        return new Promise((resolve,reject)=>{
            resolve(json);
        })
        //async await <- 
    }

    //jsonwebtoken
    const give_token=(json)=>{
        const req=json.response;

        return new Promise((resolve,reject)=>{
            jwt.sign({
                _id: req.vid,
                nickname: req.nickname
            },
            secret,
            {
                expiresIn: '1h',
                issuer: 'localhost:3001',
                subject: 'jwttesting',
            }, (err,token)=>{
                if(err) reject(err);
                resolve(token);
            })

        })
    }

    const respond=(token)=>{
        res.cookie('token', token, {httpOnly: true, maxAge:60*60*1000}).redirect('http://localhost:3000/')
    }

    getToken()
    .then(getInfo)
    .then(register)
    .then(give_token)
    .then(respond);
}