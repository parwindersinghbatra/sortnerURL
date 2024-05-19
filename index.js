// const express = require('express');
// const nanoid = require('nanoid');
import express, { json } from "express";
import { nanoid } from "nanoid";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import  path  from "node:path";

const app = express();

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const isUrlValid = (url) =>{
    try{
      new URL(url)
      return true;
    }catch(e){
      return false;
    }
}

// app.use(express.json());
app.use(express.urlencoded({ extended:true}))

app.get('/', (req, res) =>{
  res.sendFile(__dirname + '/index.html')
})


app.post("/url-shortner", (req, res) => {
  const longUrl = req.body.longUrl
  if(!isUrlValid(longUrl)){
   return res.status(400).json({
        success: false,
        message:"Invalid URL, Please enter a valid URL"
    })
  }
  const shortUrl = nanoid(8);

  const urlFilePath = "urlmap.json"

  let urlFileDatajson = {}
  if(fs.existsSync(urlFilePath)){
    const urlFileData = fs.readFileSync(urlFilePath, {encoding: "utf-8"})
    urlFileDatajson = JSON.parse(urlFileData)
  }
  urlFileDatajson[shortUrl] = longUrl
  fs.writeFileSync(urlFilePath, JSON.stringify(urlFileDatajson, null, 2))
  res.json({
       success: true,
       data: `https://sortner-url.vercel.app/${shortUrl}`,
  });
});

app.get("/:shortUrl", (req, res) => {

    const fileData = fs.readFileSync("urlmap.json", { encoding: "utf-8"});
    const FileDatajson = JSON.parse(fileData)
    const shortUrl = req.params.shortUrl
   const longUrl = FileDatajson[shortUrl]
  if(!longUrl){
    return res.json({success: false, message:"Invalid sort URL"})
  }

  res.redirect(longUrl)
})

app.listen(8080, () => {
  console.log("Express Server is running at 8080");
});
