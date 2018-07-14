const fetch=require("isomorphic-fetch");
const cheerio=require("cheerio");
// console.log("hi");
// setTimeout(()=>{console.log("wow")},3000);
// console.log("hey");

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
            // return titles;
        });
        // const test=naverTitles[0][0];
        // const a="신의 탑"
        // console.log(test===a)
        naverTitles.map((i,e)=>{ //i를 안 쓰면 안된다.
            e.map((j,f)=>{
                console.log(i,j,f);
            });
        });
        return 1;
    }).then(res=>{
        console.log("finished");
    });
})