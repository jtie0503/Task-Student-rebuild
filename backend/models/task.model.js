import Joi from "joi";

export const schemaTask = Joi.object({
  title: Joi.string().trim().min(1).max(200).required(),
  description: Joi.string().trim().max(1000).allow(""),
  completed: Joi.boolean().default(false),
});

export function modelTask(value) {
  const { error } = schemaTask.validate(value);
  if (error) {
    throw new Error(
      "Validation failed: " + error.details.map((d) => d.message).join(", ")
    );
  }
  return {
    title: value.title ?? "",
    description: value.description ?? "",
    status: value.status ?? "pending",
    createdAt: new Date(),
  };
}
