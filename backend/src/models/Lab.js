import mongoose from "mongoose";

const labSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  fees: { type: Number, required: true },
  location: { type: String },
  contact: { type: String },
  Labpic: {
    type: String, // url
  },
   reviews: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          rating: {
            type: Number,
            required: true,
          },
          comment: {
            type: String,
            required: true,
          },
        },
      ],
      
    },
    {
      timestamps: true,
    }
);

export default mongoose.model("Lab", labSchema);
