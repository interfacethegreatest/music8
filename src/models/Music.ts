import mongoose from "mongoose";

const musicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

// Check if the model is already compiled before compiling it again
const Music = mongoose.models.Music || mongoose.model("Music", musicSchema);

export default Music;