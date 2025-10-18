import Joi from "joi";

export const schemaStudent = Joi.object({
  firstName: Joi.string().trim().min(1).max(100).required(),
  middleName: Joi.string().trim().max(100).allow("").optional(),
  lastName: Joi.string().trim().min(1).max(100).required(),
 birthDate: Joi.string().required(),
  gradeLevel: Joi.string().trim().required(),
});

export function modelStudent(value) {
  const { error } = schemaStudent.validate(value);
  if (error) {
    throw new Error(
      "Validation failed: " + error.details.map((d) => d.message).join(", ")
    );
  }
  return {
    firstName: value.firstName ?? "",
    middleName: value.middleName ?? "",
    lastName: value.lastName ?? "",
    birthDate: value.birthDate ?? "",
    gradeLevel: value.gradeLevel ?? "",
    status: value.status ?? "active",
    createdAt: new Date(),
  };
}