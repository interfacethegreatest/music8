import Music from "@/models/Music"
import connectDB from "@/utils/connectDb";
import {  NextApiRequest, NextApiResponse } from "next";
import validator from 'validator';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    try {
        await connectDB();
        const { youtubeUrl } = req.body;

        if (!youtubeUrl) {
            return res.status(400).json({message: "Please fill in the field correctly."})
        }
        
        if (!validator.isURL(youtubeUrl)){
           return res.status(400).json({message: "Please provide a valid link."})
        }
        const musicLink = await Music.findOne({
            name : youtubeUrl,
        })

        console.log("exists : " + musicLink!=null);
        if (musicLink != null) {
            
            //return res.status(400).json({message: "This link already exists."})
        }else{
            const newMusic = new Music({
                name : youtubeUrl,
            })
            await newMusic.save();
        }
        const url = youtubeUrl.slice(32);
        const YOUTUBE_MP3_API = process.env.YOUTUBE_MP3_API as string;
        const YOUTUBE_HOST_API = process.env.YOUTUBE_HOST_API as string;
        const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${url}`,{
            "method": "GET",
            "headers": {
                "x-rapidapi-key" : YOUTUBE_MP3_API,
                "x-rapidapi-host": YOUTUBE_HOST_API
            }         
        });
        const fetchResponse = await fetchAPI.json();
        if(fetchResponse.status === "ok") {
            return res.json({message : "Success", song_title: fetchResponse.title, song_link: fetchResponse.link})
        }else{
            return res.status(400).json({message : "123"+fetchResponse.msg})

        }

    } catch (error) {
        return res.status(500).json({message: (error as Error).message})
    }

}