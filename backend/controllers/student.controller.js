import { useStudentRepo } from "../repositories/student.repository.js";
import { schemaStudent } from "../models/student.model.js";
import Joi from "joi";

export function useStudentController() {
  const {
    add: _add,
    getAll: _getAll,
    getById: _getById,
    updateById: _updateById,
    deleteById: _deleteById,
  } = useStudentRepo();

  async function add(req, res) {
    const value = req.body;
    const { error } = schemaStudent.validate(value);
    if (error) {
      res.status(400).json({ message: "Validation failed", errors: error.details });
      return;
    }

    try {
      const message = await _add(value);
      res.status(201).json({ message });
      return;
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to create student" });
      return;
    }
  }

  async function getAll(req, res) {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const status = req.query.status || "active";

    try {
      const items = await _getAll({ page, status });
      res.status(200).json(items);
      return;
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to fetch students" });
      return;
    }
  }

  async function getById(req, res) {
    const validation = Joi.object({
      id: Joi.string().hex().length(24).required(),
    });

    const { error } = validation.validate(req.params);
    if (error) {
      res.status(400).json({ message: "Validation failed", errors: error.details });
      return;
    }

    try {
      const student = await _getById(req.params.id);
      if (!student) {
        res.status(404).json({ message: "Student not found" });
        return;
      }
      res.status(200).json(student);
      return;
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to fetch student" });
      return;
    }
  }

  async function updateById(req, res) {
    const validation = Joi.object({
      id: Joi.string().hex().length(24).required(),
      firstName: Joi.string().trim().min(1).max(100),
      middleName: Joi.string().trim().max(100).allow(""),
      lastName: Joi.string().trim().min(1).max(100),
      birthDate: Joi.string(),
      gradeLevel: Joi.string().trim(),
    });

    const id = req.params.id;
    const payload = req.body;
    const { error } = validation.validate({ id, ...payload });

    if (error) {
      res.status(400).json({ message: "Validation failed", errors: error.details });
      return;
    }

    try {
     const updatedStudent = await _updateById(id, req.body);
      res.status(200).json(updatedStudent);
      return;
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to update student" });
      return;
}
  }

  async function deleteById(req, res) {
    const validation = Joi.object({
      id: Joi.string().hex().length(24).required(),
    });

    const { error } = validation.validate(req.params);
    if (error) {
      res.status(400).json({ message: "Validation failed", errors: error.details });
      return;
    }

    try {
      const message = await _deleteById(req.params.id);
      res.status(200).json({ message });
      return;
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to delete student" });
      return;
    }
  }

  return { add, getAll, getById, updateById, deleteById };
}