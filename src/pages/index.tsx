import Image from "next/image";
import styles from "./page.module.css";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import axios from 'axios';
import { PropagateLoader } from "react-spinners";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";

const FormSchema = z.object({
  youtubeUrl: z.string()
    .url("Invalid URL format")
    .regex(
      /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]{11}$/,
      "URL must be a valid YouTube video link (watch?v=)"
    )
});
type FormSchemaType = z.infer<typeof FormSchema>;

interface ApiResponse {
  message?: string;
  song_title?: string;
  song_link?: string;
}


export default function Home() {
  const [apiResponse, setResponse] = useState<ApiResponse | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema)
  });

  const onSubmit: SubmitHandler<FormSchemaType> = async (values) => {
    try {
        const { data } = await axios.post('/api/auth/registerVideo', values);
        console.log(data)
        setResponse(data);
        reset(); // Reset only after successful submission
    } catch (error: any) {
        console.error("Error during form submission:", error.response.data.message); // Log the error message
        // Set the error on the youtubeUrl field
        setError('youtubeUrl', {
            type: 'manual', // Type of error
            message: error.response.data.message // Error message to display
        });
    }
}


  return (
   <>
     <h1>Hello world</h1>
     <form onSubmit={handleSubmit(onSubmit)}>
       {isSubmitting ? (
         <PropagateLoader color='white' size={5} style={{ display: "flex", justifyContent: "center", alignItems: "center" }} />
       ) : (
         <input type="text" disabled={isSubmitting} {...register("youtubeUrl")} />
       )}
       <h5>{errors.youtubeUrl ? errors.youtubeUrl.message : null}</h5>
       <h5>{apiResponse ? apiResponse.song_title : null}</h5>
       <br />
       <button type="submit">Submit</button>
     </form>
   </>
  );
}
