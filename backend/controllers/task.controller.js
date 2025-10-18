import { useTaskRepo } from "../repositories/task.repository.js";
import { schemaTask } from "../models/task.model.js";
import Joi from "joi";

export function useTaskController() {
  const {
    add: _add,
    getAll: _getAll,
    getById: _getById,
    updateById: _updateById,
    deleteById: _deleteById,
  } = useTaskRepo();

  async function add(req, res) {
    const value = req.body;
    const { error } = schemaTask.validate(value);
    if (error) {
      res.status(400).json({ message: "Validation failed", errors: error.details });
      return;
    }

    try {
      const message = await _add(value);
      res.status(200).json({ message });
      return;
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to create task" });
      return;
    }
  }

  async function getAll(req, res) {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const status = req.query.status || "pending";

    try {
      const items = await _getAll({ page, status });
      res.status(200).json(items);
      return;
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to fetch tasks" });
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
      const task = await _getById(req.params.id);
      if (!task) {
        res.status(404).json({ message: "Task not found" });
        return;
      }
      res.status(200).json(task);
      return;
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to fetch task" });
      return;
    }
  }

  async function updateById(req, res) {
    const validation = Joi.object({
      id: Joi.string().hex().length(24).required(),
      title: Joi.string().trim().min(1).max(200).required(),
      description: Joi.string().trim().max(1000).allow(""),
    });

    const id = req.params.id;
    const payload = req.body;
    const { error } = validation.validate({ id, ...payload });

    if (error) {
      res.status(400).json({ message: "Validation failed", errors: error.details });
      return;
    }

    try {
     const updatedTask = await _updateById(id, req.body);
  res.status(200).json(updatedTask);
      return;
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to update task" });
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
      res.status(500).json({ message: error.message || "Failed to delete task" });
      return;
    }
  }

  return { add, getAll, getById, updateById, deleteById };
}