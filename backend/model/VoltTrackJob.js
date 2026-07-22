import mongoose from "mongoose";

const TransformerTestSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    stage: {
      type: String,
      enum: ["Not Started", "Tested", "Reviewed", "Authorized"],
      default: "Not Started",
    },
    updatedAt: { type: Number, default: () => Date.now() },
    observationData: { type: mongoose.Schema.Types.Mixed, default: {} },
    accepted: { type: Boolean, default: false },
  },
  { _id: false }
);

const VoltTrackJobSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    capacity: {
      type: String,
      enum: ["8MVA", "12.3MVA", "16.5MVA"],
      required: true,
    },
    type: {
      type: String,
      enum: ["Auto", "Traction", "V Connect"],
      required: true,
    },
    createdAt: { type: Number, default: () => Date.now() },
    status: {
      type: String,
      enum: ["Processing", "Completed"],
      default: "Processing",
    },
    ratingData: { type: mongoose.Schema.Types.Mixed, default: {} },
    tests: { type: [TransformerTestSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("VoltTrackJob", VoltTrackJobSchema);