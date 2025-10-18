import { useTaskRepo } from "./repositories/task.repository.js";
import { useStudentRepo } from "./repositories/student.repository.js";

export default async function setup() {
  const { createIndexes } = useTaskRepo();
  try {
   const message = await createIndexes();
   console.log(message);
  } catch (error) {
    console.error("Error creating indexes:", error);
  }


  //  Create Student Indexes
  const studentRepo = useStudentRepo();
  try {
    const studentMessage = await studentRepo.createIndexes();
    console.log(studentMessage);
  } catch (error) {
    console.error("Error creating student indexes:", error);
  }
}
