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
            console.log('123');
            console.log("Returning 400 status with message: 'This link already exists.'");
            return res.status(400).json({message: "This link already exists."})
        }
        const newMusic = new Music({
            name : youtubeUrl,
        })
        await newMusic.save();

        return res.json({message: "Success! Thanks for submitting a video."})
    } catch (error) {
        return res.status(500).json({message: (error as Error).message})
    }

}