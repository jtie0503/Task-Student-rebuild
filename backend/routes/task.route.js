import express from "express";
import Joi from "joi";
import { ObjectId } from "mongodb";
import { useTaskController } from "../controllers/task.controller.js";
import { useLogMiddleware } from "../middlewares/log.middleware.js";

const router = express.Router();

export default function useTaskRoute() {
  const { add, getAll, getById, updateById, deleteById } = useTaskController();
  const { logRequest } = useLogMiddleware();

  // Get all tasks
  router.get("/", logRequest, getAll);

  // Get one task by ID
  router.get("/:id", logRequest, getById);

  // Create new task
  router.post("/", logRequest, add);

  // Update a task
  router.put("/:id", logRequest, updateById);

  // Delete a task
  router.delete("/:id", deleteById);

  return router;
}
