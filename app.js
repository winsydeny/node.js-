const http = require("http");
const url = require("url");
const fs = require("fs");
const gbk = require("gbk");
const JSDOM = require("jsdom").JSDOM;
// function matchUrl(murl){
//     let pattern = new RegExp(".webp$");
//     let result = murl.match(pattern);
//     console.log(result);
// }

// matchUrl("https://img.alicdn.com/tfs/TB162zornmWBKNjSZFBXXXxUFXa-520-280.png_q90_.webp");



getUrl("https://read.qidian.com/chapter/iDXHV_zMjlDiUReBXKVubw2/fSD9snSa3D1OBDFlr9quQA2",function(data){
//存在乱码的时候用到gbk;    
// let html = gbk.toString("utf-8",data);
    // fs.writeFile("douban.html",data,"utf8",(err)=>{
    //                 if(err) throw err;
    //                 console.log("already copy!");
    //             });
    // console.log(html);

    console.log(data);
    let dom = new JSDOM(data);
    let doc = dom.window.document;
    let inner = doc.querySelectorAll("a");
    let t = "";
    for(let i = 0;i<inner.length;i++){
        t+= inner[i].textContent +"\n";
    }
    fs.writeFile("novel.txt",t,"utf8",()=>{});
    // document.querySelectorAll("p")[0].textContent
    // console.log(doc.querySelectorAll("div")[0].textContent);
});
let index = 0;
function getUrl(surl,success){
    
    let objUrl = url.parse(surl);
    let http;
    if(objUrl.protocol == "http:"){
        http = require("http");
    }else{
        http = require("https");
    }
    let req = http.request({
        "hostname":objUrl.hostname,
        "path":objUrl.path
    },res=>{
        console.log(res.statusCode);
        index++;
        if(res.statusCode == 200){
            let arr = [];
            res.on("data",buffer => {
                arr.push(buffer);
            });
            res.on("end",() => {
                let b = Buffer.concat(arr);
                success && success(b);
        
            })

        }
        else if(res.statusCode == 301 || res.statusCode == 302){
            console.log(`第${index}次：`)
            getUrl(res.headers.location,success);
        }
       
    })
    req.end();
}
// https://wenku.baidu.com/view/46e69461854769eae009581b6bd97f192279bff2.html
//request 默认是以post方式去访问的
//node 获取post 数据用on方法
// let req = http.request({
//     "hostname":"www.lzu.edu.cn",
//     "path":"/"
// },res => {
//     let arr = [];
//     let str = "";
//     res.on("data",buffer=>{
//         arr.push(buffer);
//         str += buffer;
//     });
//     res.on("end",()=>{
//         fs.writeFile("down.html",arr,"utf8",(err)=>{
//             if(err) throw err;
//             console.log("already copy!");
//         });
//         // console.log(res);
//     });
// })
// req.end();