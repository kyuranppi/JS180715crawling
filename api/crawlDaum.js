// const pythonShell=require("python-shell")
const fetch=require("isomorphic-fetch");
const mongoose=require("mongoose");
const config=require("../config/mongodbUrl.js");

// mongoose.promise=require("bluebird");

const Webtoon=require("../model/webtoons.js");

// const runPy=()=>{
//     return new Promise((resolve,reject)=>{
//         pythonShell.run("./crawlDaum.py",{},(err,results)=>{
//             if(err) reject(err);
//             json=results.reduce((cur,e)=>{return cur+e},'')
//             json=json.slice(0,json.length-1)+"]"
//             resolve(JSON.parse(json));
//         })
//     })
// }
// runPy().then((json)=>{
//     console.log(json)
// })


const crawlDaum=()=>{
    return new Promise((resolve,reject)=>{
        const week=["mon","tue","wed","thu","fri","sat","sun"]
        const url = "http://webtoon.daum.net/data/pc/webtoon/list_serialized/"
        let list=[]
        Promise.all(
            week.map((e,i)=>{
                return new Promise((resolve,reject)=>{
                    fetch(url+e).then(res=>{
                        res.json().then(json=>{
                            json.data.map(f=>{
                                list.push({
                                    day: [i],
                                    title: f.title,
                                    imgsrc: f.pcThumbnailImage.url
                                })
                            })
                            resolve(list)
                        })
                    })
                })
            })
        ).then(()=>{
            //initialize
            console.log("Initializing for daum...");
            Webtoon.find({"platform":"daum"},(err,toons)=>{
                if(err)console.error(err);
                toons.map(toon=>{
                    toon.remove({_id:toon._id},(err,datas)=>{
                        if(err)console.error(err);
                    });
                })
            })
            .then(()=>{
                console.log("Initialized for daum");
                console.log("Saving for daum");
                let filtered=[{}];
                list.map((e,i)=>{
                    const idx=filtered.findIndex((f)=>{return e.title===f.title});
                    if(idx>=0){
                        filtered[idx].day=[...filtered[idx].day,...e.day]
                    }else{
                        filtered.push(e);
                    }         
                });

                Promise.all(
                    filtered.map((e,i)=>{   
                        let newtoon=new Webtoon();
                        newtoon.day=e.day;
                        newtoon.title=e.title;
                        newtoon.imgsrc=e.imgsrc;
                        newtoon.platform="daum";
                        newtoon.save((err)=>{
                            if(err){console.error(err)}
                            return new Promise((res,rej)=>res());
                        })
                    })
                ).then(()=>{
                    console.log("*****Finished for daum*****")
                    resolve()
                })
            })
        })
    })
}

mongoose.connect(config.url,{useNewUrlParser: true});

module.exports=crawlDaum