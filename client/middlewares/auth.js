const jwt=require('jsonwebtoken');

exports.authToken=(req,res,next)=>{
    const token=req.cookies.token;

    if(!token){
        req.decoded=undefined

    }

    const p = new Promise(
        (resolve,reject)=>{
            jwt.verify(token,req.app.get('jwt-secret'),(err,
                decoded)=>{
                    if(err) reject(err);
                    resolve(decoded);
                })
        }
    )
    const onError=(error)=>{
        req.decoded=undefined;
        next();
    }

    p.then((decoded)=>{
        req.decoded=decoded
        next();
    }).catch(onError);

}