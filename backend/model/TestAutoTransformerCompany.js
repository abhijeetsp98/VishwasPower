import mongoose from "mongoose";

const projectSchema = {
  id: { type: Number, required: true },
  name: { type: String, required: true },
  companyName: { type: String, required: true },
  stage: { type: Number, required: true },
  formsCompleted: { type: Number, required: true },
  totalForms: { type: Number, required: true },
  status: { type: String, required: true },
  lastActivity: { type: Date, default: Date.now },
  stageApprovals: { type: Map, of: Boolean },
  submittedStages: { type: Map, of: Boolean },
  rejectionReason: { type: String, default: "" },
  lastEventUser: { type: String, default: "" },
  lastEventAction: { type: String, default: "" },
  lastEventTimestamp: { type: Date, default: null },
  lastSubmittedUser: { type: String, default: "" },
  lastSubmittedTimestamp: { type: Date, default: null },
  lastApprovedUser: { type: String, default: "" },
  lastApprovedTimestamp: { type: Date, default: null },
  jobRating: { type: String, default: "" },
  submittedForms: { type: Map, of: Boolean },
};

const TestAutoTransformerCompanySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    companyDescription: { type: String, required: true },
    companyProjects: { type: [projectSchema], required: true },
  },
  { timestamps: true }
);

export default mongoose.model("TestAutoTransformerCompany", TestAutoTransformerCompanySchema);