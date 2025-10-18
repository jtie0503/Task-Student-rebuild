import { db } from "../index.js";
import { schemaTask, modelTask } from "../models/task.model.js";
import { ObjectId } from "mongodb";
import { paginate } from "../utils/paginate.util.js";

export function useTaskRepo() {
  if (!db) throw new Error("Database not initialized");
  const collection = db.collection("tasks");

  async function createIndexes() {
    try {
      await collection.createIndexes([
        { key: { title: 1 } },
        { key: { status: 1 } },
      ]);
      return "Indexes created successfully.";
    } catch (error) {
      throw new Error("Failed to create indexes: " + error.message);
    }
  }

  async function add(value) {
    try {
      value = modelTask(value);
      await collection.insertOne(value);
      return "Successfully created task.";
    } catch (error) {
      throw new Error("Failed to create task: " + error.message);
    }
  }

  async function getAll({ page = 1, limit = 10, status = "pending" } = {}) {
    const query = { status };
    page = page > 0 ? page - 1 : page;
    try {
      const items = await collection
        .aggregate([
          {
            $match: query,
          },
          {
            $skip: page * limit,
          },
          {
            $limit: limit,
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
    id = new ObjectId(id);
    return await collection.findOne({ _id: id });
  } catch (error) {
    throw new Error("Failed to fetch task: " + error.message);
  }
}

 async function updateById(id, value) {
  try {
    id = new ObjectId(id);
  } catch (error) {
    throw new Error("Invalid ID format");
  }

  const { error } = schemaTask.validate(value);
  if (error) {
    throw new Error(
      "Validation failed: " + error.details.map((d) => d.message).join(", ")
    );
  }

  try {
    await collection.updateOne({ _id: id }, { $set: value });
    const updatedTask = await collection.findOne({ _id: id });
    return updatedTask;  
  } catch (error) {
    throw new Error("Failed to update task: " + error.message);
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
      return "Successfully deleted task.";
    } catch (error) {
      throw new Error("Failed to delete task: " + error.message);
    }
  }

  return { add, getAll, getById, updateById, deleteById, createIndexes };
}
