import Notes from "../models/notes.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRETE_KEY = process.env.SECRETE_KEY;

export async function createNote(data, token) {
  let response;
  try {
    const payload = jwt.verify(token, SECRETE_KEY);
    
    // Ensure only Dentist or Admin can create medical notes (role 2 or 3)
    if (payload.role !== 2 && payload.role !== 3) {
      return { code: 403, message: "Access Denied: Only Dentists/Admins can write clinical notes" };
    }

    const requiredFields = ["patientName", "dentistName", "noteText", "date", "patientId"];
    for (let field of requiredFields) {
      if (data[field] === undefined || data[field] === null || data[field] === "") {
        return { code: 400, message: `Missing required field: ${field}` };
      }
    }

    data.createdby = payload.crid;
    const newNote = await Notes.create(data);
    response = { code: 200, message: "Clinical note created successfully", note: newNote };
  } catch (e) {
    response = { code: 500, message: e.message };
  }
  return response;
}

export async function getAllNotes(token) {
  let response;
  try {
    const payload = jwt.verify(token, SECRETE_KEY);
    
    let query = {};
    if (payload.role === 1) {
      // Patients only see their own notes
      query = { patientId: payload.crid };
    } else if (payload.role === 2) {
      // Dentists see notes they created
      query = { createdby: payload.crid };
    } else if (payload.role === 3) {
      // Admin sees all
      query = {};
    }

    const notes = await Notes.find(query).sort({ _id: -1 });
    response = { code: 200, notes: notes };
  } catch (e) {
    response = { code: 500, message: e.message };
  }
  return response;
}

export async function getNoteById(id, token) {
  let response;
  try {
    const payload = jwt.verify(token, SECRETE_KEY);
    const note = await Notes.findById(id);
    
    if (!note) {
      return { code: 404, message: "Note not found" };
    }

    // Authorization check
    if (payload.role === 1 && Number(note.patientId) !== Number(payload.crid)) {
      return { code: 403, message: "Access Denied" };
    }
    if (payload.role === 2 && Number(note.createdby) !== Number(payload.crid)) {
      return { code: 403, message: "Access Denied" };
    }

    response = { code: 200, note: note };
  } catch (e) {
    response = { code: 500, message: e.message };
  }
  return response;
}

export async function updateNote(id, data, token) {
  let response;
  try {
    const payload = jwt.verify(token, SECRETE_KEY);
    const note = await Notes.findById(id);

    if (!note) {
      return { code: 404, message: "Note not found" };
    }

    // Only the creator dentist or Admin can edit the note
    if (payload.role !== 3 && Number(note.createdby) !== Number(payload.crid)) {
      return { code: 403, message: "Access Denied: You did not create this note" };
    }

    const updatedNote = await Notes.findOneAndUpdate({ _id: id }, data, { new: true });
    response = { code: 200, message: "Note updated successfully", note: updatedNote };
  } catch (e) {
    response = { code: 500, message: e.message };
  }
  return response;
}

export async function deleteNote(id, token) {
  let response;
  try {
    const payload = jwt.verify(token, SECRETE_KEY);
    const note = await Notes.findById(id);

    if (!note) {
      return { code: 404, message: "Note not found" };
    }

    // Only the creator dentist or Admin can delete
    if (payload.role !== 3 && Number(note.createdby) !== Number(payload.crid)) {
      return { code: 403, message: "Access Denied: You did not create this note" };
    }

    await Notes.findOneAndDelete({ _id: id });
    response = { code: 200, message: "Note has been deleted" };
  } catch (e) {
    response = { code: 500, message: e.message };
  }
  return response;
}
