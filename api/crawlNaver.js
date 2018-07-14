const fetch=require("isomorphic-fetch");
const cheerio=require("cheerio");
const mongoose=require("mongoose");
const config=require("../config/mongodbUrl.js");
// mongoose.promise=require("bluebird");

const Webtoon=require("../model/webtoons.js");

const crawlNaver=()=>{
    return new Promise((resolve,reject)=>{
        fetch("https://comic.naver.com/webtoon/weekday.nhn")
        .then(res=>{
            res.text().then(html=>{
                const $=cheerio.load(html);
                const objects=$('div.col'); //.length=7!

                const naverTitles=objects.map((i,e)=>{
                    // console.log($(e).children().attr('class'))
                    const lists=$(e).children().children('ul').children();
                    // console.log(lists.length)

                    return lists.map((i,e)=>{
                        const list=$(e).children('a').attr('title');
                        const imgsrc=$(e).children('div').children('a').children('img').attr('src');
                        // console.log(imgsrc);
                        const webtoon={
                            title: list,
                            imgsrc: imgsrc,
                        }
                        // console.log(list)
                        return webtoon;
                    });
                });
                // console.log(naverTitles.length);
                return naverTitles;
            })
            .then(data=>{
                //initialize
                console.log("Initializing...");
                Webtoon.find({"platform":"naver"},(err,toons)=>{
                    if(err)console.error(err);
                    toons.map(toon=>{
                        toon.remove({_id:toon._id},(err,datas)=>{
                            if(err)console.error(err);
                        });
                    })
                })
                .then(()=>{
                    console.log("Initialized");
                    console.log("Saving...");
                    let filtered=[{}];
                    data.map((i,e)=>{
                        e.map((j,f)=>{
                            const idx=filtered.findIndex((e)=>{return e.title===f.title});
                            if(idx>=0){
                                filtered[idx].day=[...filtered[idx].day,i]
                            }else{
                                filtered.push({
                                    day:[i],
                                    title: f.title,
                                    imgsrc: f.imgsrc,
                                });
                            }         
                        })
                    });

                    Promise.all(
                        filtered.map((e,i)=>{   
                            let newtoon=new Webtoon();
                            newtoon.day=e.day;
                            newtoon.title=e.title;
                            newtoon.imgsrc=e.imgsrc;
                            newtoon.platform="naver";
                            newtoon.save((err)=>{
                                // if(err){console.error(err)}
                                return new Promise((resolve,reject)=>{
                                    if(err){reject(err)}
                                    resolve()
                                });
                            })
                        })
                    ).then(()=>{
                        console.log("*****Finished for naver******");
                        resolve()
                    });
                })
            });
        })
    })
}
// crawlNaver();
// crawlNaver.then(res=>console.log(res.length))
mongoose.connect(config.url,{useNewUrlParser: true});

module.exports = crawlNaver;