import mongoose from "mongoose";

const notesSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true, trim: true },
    dentistName: { type: String, required: true, trim: true },
    noteText: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    createdby: { type: Number, required: true },
    patientId: { type: Number, required: true }
  },
  {
    timestamps: { createdAt: "createdat", updatedAt: "updatedat" }
  }
);

const Notes = mongoose.model("notes", notesSchema);

export default Notes;
