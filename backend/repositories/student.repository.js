import { db } from "../index.js";
import { schemaStudent, modelStudent } from "../models/student.model.js";  
import { ObjectId } from "mongodb";
import { paginate } from "../utils/paginate.util.js";

export function useStudentRepo() {  
  if (!db) throw new Error("Database not initialized");
  const collection = db.collection("students");


 async function createIndexes() {
  try {
    await collection.createIndexes([
      { key: { firstName: 1 } },
      { key: { middleName: 1 } },
      { key: { lastName: 1 } },    
      { key: { gradeLevel: 1 } }  
    ]);
    return "Indexes created successfully.";
  } catch (error) { 
    throw new Error("Failed to create indexes: " + error.message);
  }
}

  async function add(value) {
    try {
      value = modelStudent(value); 
      await collection.insertOne(value);
      return "Successfully created student.";
    } catch (error) {
      throw new Error("Failed to create student: " + error.message);
    }
  }

  async function getAll({ page = 1, limit = 10, status ="active" } = {}) {
    const query = {};
    if (status) {
      query.status = status;
    } 
    page = page > 0 ? page - 1 : page;
    try {
      const items = await collection
        .aggregate([
          {
            $match: query
          },
          {
          $skip: page * limit  
        },
        {
          $limit: limit  
        },

        ])
        .toArray();

      const length = await collection.countDocuments(query);
      return paginate({ items, page, limit, length });
    } catch (error) {
      throw new Error("Failed to fetch tasks: " + error.message);
    }
  }


  async function getById(id) {
    try {
      return await collection.findOne({ _id: new ObjectId(id) });  
    } catch (error) {
      throw new Error("Failed to fetch student: " + error.message);  
    }
  }

  async function updateById(id, value) {
    try {
      id = new ObjectId(id);
    } catch (error) {
      throw new Error("Invalid ID format");
    }

    const { error } = schemaStudent.validate(value); 
    if (error) {
      throw new Error(
        "Validation failed: " + error.details.map((d) => d.message).join(", ")
      );
    }

    try {
      await collection.updateOne({ _id: id }, { $set: value });
       const updatedStudent = await collection.findOne({ _id: id });
      return updatedStudent; 
    } catch (error) {
      throw new Error("Failed to update student: " + error.message); 
    }
  }

async function deleteById(id) {
  try {
    id = new ObjectId(id);
  } catch (error) {
    throw new Error("Invalid ID format");
  }

  try {
    await collection.deleteOne({ _id: id });
    return { message: "Successfully deleted student." }; 
  } catch (error) {
    throw new Error("Failed to delete student: " + error.message); 
  }
}
  
  return { add, getAll, getById, updateById, deleteById, createIndexes };
}