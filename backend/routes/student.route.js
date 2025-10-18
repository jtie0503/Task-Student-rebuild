import express from "express";
import Joi from "joi";
import { ObjectId } from "mongodb";
import { useStudentController } from "../controllers/student.controller.js";
import { useLogMiddleware } from "../middlewares/log.middleware.js";

const router = express.Router();

export default function useStudentRoute() {
  const { add, getAll, getById, updateById, deleteById } = useStudentController();
  const { logRequest } = useLogMiddleware();

  // Get all students
  router.get("/", logRequest, getAll);

  // Get one student by ID
  router.get("/:id", logRequest, getById);

  // Create new student
  router.post("/", logRequest, add);

  // Update a student
  router.put("/:id", logRequest, updateById);

  // Delete a student
  router.delete("/:id", deleteById);

  return router;
}