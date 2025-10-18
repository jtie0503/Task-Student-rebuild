<template>
  <v-row 
   no-gutters
    justify="center"
    class="fill-height pa-4"
    align-content="center"
  >

  <v-col cols="12" lg="8" >
    <v-card width="100%"  variant="outlined" border="md">
        <v-toolbar class="px-7" >
          <v-text-field
            v-model="searchTask"
            placeholder="Search tasks..."
            density="comfortable"
            prepend-inner-icon="mdi-magnify"
            clearable
            hide-details
            variant="outlined"
            color="orange"
            class="rounded-xl"
            style="max-width: 200px"
          ></v-text-field>
          <v-spacer></v-spacer>
           <img src="https://cdn-icons-png.flaticon.com/512/1950/1950715.png" alt="Tasks" height="40" />
            <h2 class="font-weight-bold ml-3"  style="color: black !important;">Daily Task</h2>
            <v-spacer></v-spacer>
            <v-btn
             class="font-weight-bold green--text"
             rounded="xl"
             color="orange"
             variant="flat"
             style="color: white !important;"
             size="large"
              @click="dialogAdd = true"
            >
                Add Task
            </v-btn>

            <template #append>
              <span class="mx-2">{{ pageRangeTask }}</span>
              <v-btn @click="pageTask += 1">Next</v-btn>
            </template>
        </v-toolbar>
        
        <v-data-table
          :headers="taskHeaders"
          :items="filteredTasks"
          max-height="calc(100vh - 200px)"
          hide-default-header
          hide-default-footer
          class="px-6"
         
        >

        <template v-slot:item="{ item }">
            <tr>
              <td class="py-3">
                <div class="font-weight-bold">{{ item.title }}</div>
              </td>
              <td class="py-3">
                <div class="text-grey">{{ item.description }}</div>
              </td>
              <td class="text-right py-3">
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  color="blue"
                  @click="edit(item)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  color="red"
                 @click="id = item._id || item.id; dialogDelete = true"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
        </template>
        </v-data-table>
    </v-card>
  </v-col>

    <!--Input Dialog -->
<v-dialog v-model="dialogAdd" width="400" persistent>
    <v-card width="100%">
        <v-toolbar class="px-4">
          <span class="text-h6 font-weight-bold">{{ formTitle }}</span>
        </v-toolbar>
        <v-card-text style="max-height: 100vh; overflow-y: auto" class="py-2">
            <v-form v-model="valid">
                 
                    <InputLabel title="Task Name" required />
                    <v-text-field v-model="name" :rules="[inputRequire]" />

                    <InputLabel title="Task Description" required/>
                    <v-textarea v-model="description" rows="2" no-resize />
                
            </v-form>
        </v-card-text>
         
        <v-toolbar density="compact">
          <v-row no-gutters>
            <v-col cols="6">
              <v-btn
                tile
                variant="text"
                size="48"
                class="text-none font-weight-bold"
                block
                @click="
                  dialogAdd = false;
                  resetTaskForm();
                "
              >
                Cancel
              </v-btn>
            </v-col>

            <v-col cols="6">
              <v-btn
                tile
                variant="flat"
                size="48"
                color="black"
                class="text-none font-weight-bold"
                block
                :disabled="!valid"
                @click="submitTask()"
                :loading="loading"
              >
                Submit
              </v-btn>
            </v-col>
          </v-row>
        </v-toolbar>

    </v-card>
</v-dialog>

 <!--Input Delete Dialog -->
<v-dialog v-model="dialogDelete" width="400" persistent>
  <v-card>
    <v-card-title class="text-h6 font-weight-bold">
      Confirm Deletion
    </v-card-title>
    <v-card-text>
      Are you sure you want to delete this task?
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        variant="text"
        color="grey"
       @click="dialogDelete = false"
      >
        Cancel
      </v-btn>
      <v-btn
        variant="flat"
        color="red"
       
        @click="deleteTask(id); dialogDelete = false" 
      >
        Delete
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
  </v-row>


   <!--Student  -->
<v-row 
   no-gutters
    justify="center"
    class="fill-height pa-4"
    align-content="center"
  >

  <v-col cols="12" lg="8" >
    <v-card width="100%"  variant="outlined" border="md">
        <v-toolbar class="px-7" >
          <v-text-field
            v-model="searchStudent"
            placeholder="Search students..."
            density="comfortable"
            prepend-inner-icon="mdi-magnify"
            clearable
            hide-details
            variant="outlined"
            color="orange"
            class="rounded-xl"
            style="max-width: 200px"
          ></v-text-field>
          <v-spacer></v-spacer>
           <img src="https://cdn-icons-png.flaticon.com/512/1950/1950715.png" alt="Tasks" height="40" />
            <h2 class="font-weight-bold ml-3"  style="color: black !important;">Student Records</h2>
            <v-spacer></v-spacer>
            <v-btn
             class="font-weight-bold green--text"
             rounded="xl"
             color="orange"
             variant="flat"
             style="color: white !important;"
             size="large"
             @click="dialogAddStudent = true"
            >
                Add Student
            </v-btn>
              <template #append>
              <span class="mx-2">{{ pageRangeStudent }}</span>
              <v-btn @click="pageStudent += 1">Next</v-btn>
            </template>
            
        </v-toolbar>
        
        <v-data-table
          :headers="studentHeaders"
          :items="filteredStudents"
          max-height="calc(100vh - 200px)"
          hide-default-header
          hide-default-footer
          class="px-6"
         
        >

        <template v-slot:item="{ item }">
            <tr>
              <td class="py-3">{{ item.firstName }}</td>
              <td class="py-3">{{ item.middleName }}</td>
              <td class="py-3">{{ item.lastName }}</td>
              <td class="py-3">{{ item.birthDate }}</td>
              <td class="py-3">{{ item.gradeLevel }}</td>
              <td class="text-right py-3">
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  color="blue"
                  @click="editStudent(item)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  color="red"
                 @click="studentId = item._id || item.id; dialogDeleteStudent = true"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
        </template>
        </v-data-table>
    </v-card>
  </v-col>

    <!--Input Student Dialog -->
<v-dialog v-model="dialogAddStudent" width="400" persistent>
    <v-card width="100%">
        <v-toolbar class="px-4">
          <span class="text-h6 font-weight-bold">{{ studentFormTitle }}</span>
        </v-toolbar>
        <v-card-text style="max-height: 100vh; overflow-y: auto" class="py-2">
            <v-form v-model="valid">
                 
              <InputLabel title="First Name" required />
              <v-text-field v-model="firstName" :rules="[inputRequire]" /> 

              <InputLabel title="Middle Name" required />
              <v-text-field v-model="middleName" :rules="[inputRequire]" />

              <InputLabel title="Last Name" required />
              <v-text-field v-model="lastName" :rules="[inputRequire]" />

              <InputLabel title="Birth Date" required />
              <v-date-input
                v-model="birthDate"
                :rules="[inputRequire]"
              ></v-date-input>

              <InputLabel title="Grade Level" required />
              <v-text-field v-model="gradeLevel" :rules="[inputRequire]" />

            </v-form>
        </v-card-text>
         
        <v-toolbar density="compact">
          <v-row no-gutters>
            <v-col cols="6">
              <v-btn
                tile
                variant="text"
                size="48"
                class="text-none font-weight-bold"
                block
                @click="
                  dialogAddStudent = false;
                  resetStudentForm();
                "
              >
                Cancel
              </v-btn>
            </v-col>

            <v-col cols="6">
              <v-btn
                tile
                variant="flat"
                size="48"
                color="black"
                class="text-none font-weight-bold"
                block
                :disabled="!valid"
                @click="submitStudent()"
                :loading="loading"
              >
                Submit
              </v-btn>
            </v-col>
          </v-row>
        </v-toolbar>

    </v-card>
</v-dialog>

 <!--student Delete Dialog -->
<v-dialog v-model="dialogDeleteStudent" width="400" persistent>
  <v-card>
    <v-card-title class="text-h6 font-weight-bold">
      Confirm Deletion
    </v-card-title>
    <v-card-text>
      Are you sure you want to delete this Student?
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        variant="text"
        color="grey"
       @click="dialogDeleteStudent = false"
      >
        Cancel
      </v-btn>
      <v-btn
        variant="flat"
        color="red"

       @click="deleteStudent(studentId); dialogDeleteStudent = false"
      >
        Delete
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
  </v-row>

</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useDate } from "vuetify";

//  API Base URL
const API_URL = "http://localhost:4000/api";

const tasks = ref([]);
const students = ref([]);
const searchTask = ref("");


//filter tasks
const filteredTasks = computed(function () {
  if (!searchTask.value) {
    return tasks.value;
  } else {
    return tasks.value.filter(function (task) {
      return (
        task.title.toLowerCase().includes(searchTask.value.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTask.value.toLowerCase())
      );
    });
  }
});

// Tasks fields
const id = ref(null);
const name = ref("");
const description = ref("");
const dialogDelete = ref(false);
const dialogAdd = ref(false);
const searchStudent = ref("");

// Student fields
const studentId = ref(null);
const dialogAddStudent = ref(false);
const dialogDeleteStudent = ref(false);
const studentFormTitle = ref("Add Student");
const firstName = ref("");
const middleName = ref("");
const lastName = ref("");
const birthDate = ref("");
const gradeLevel = ref("");




// Table Headers
const taskHeaders = [
  { title: "Title", value: "title" },
  { title: "Description", value: "description" },
  { title: "", value: "delete", width: "80px" },
];


const formTitle = ref("Add Task");
const loading = ref(false);
const valid = ref(true);
const inputRequire = (v) => !!v || "Field is required";

const date = useDate();
const formattedBirthdate = computed(() =>
  birthDate.value ? date.format(birthDate.value, "fullDate") : ""
);

// ============= TASKS API FUNCTIONS =============

// Fetch all tasks
async function fetchTasks() {
  try {
    const response = await fetch(`${API_URL}/tasks`);
    const data = await response.json();
    tasks.value = data.items || []; 
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
}


const pageTask = ref(1);
const { data: todoReq, refresh: refreshTodo } = await useLazyAsyncData(
  "get-tasks-"+ pageTask,
  () => $fetch("http://localhost:4000/api/tasks", {query: { page: pageTask.value }}),
  {watch: [pageTask]}
);

const pagesTask = ref(0);
const pageRangeTask = ref("-- --of--");


watchEffect(() => {
  if (todoReq.value) {
    tasks.value = todoReq.value.items;
    pagesTask.value = todoReq.value.pages;
    pageRangeTask.value = todoReq.value.pageRange;
  }
});




// Add task
async function addTask() {
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: name.value,
        description: description.value,   
      }),
    });

    if (!response.ok) throw new Error("Failed to add task");

    const newTask = await response.json();
    tasks.value.push(newTask);
    await fetchTasks(); 
    console.log("Task added:", newTask);
  } catch (error) {
    console.error("Error adding task:", error);
  }
}

// Edit task
function edit(item) {
  console.log("Edit item:", item);
  id.value = item._id || item.id; 
  name.value = item.title;
  description.value = item.description;
  formTitle.value = "Update Task";
  dialogAdd.value = true;
}

// Update task by id
async function updateTaskById() {
  try {
    const response = await fetch(`${API_URL}/tasks/${id.value}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: name.value,
        description: description.value,
      }),
    });

    if (!response.ok) throw new Error("Failed to update task");

    const updatedTask = await response.json();
    const index = tasks.value.findIndex(
      (task) => (task._id || task.id) === id.value
    );
    if (index !== -1) {
      tasks.value[index] = updatedTask;
    }
    console.log("Task updated:", updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
  }
}

// Delete task
async function deleteTask(taskId) {
  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to delete task");

    const index = tasks.value.findIndex(
      (task) => (task._id || task.id) === taskId
    );
    if (index !== -1) {
      tasks.value.splice(index, 1);
    }
    console.log("Task deleted:", taskId);
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}

// Submit task (add or update)
async function submitTask() {
  try {
    loading.value = true;
    if (formTitle.value === "Add Task") {
      await addTask();
    }
    if (formTitle.value === "Update Task") {
      await updateTaskById();
    }
    dialogAdd.value = false;
  } catch (error) {
    console.log(error);
  } finally {
    resetTaskForm();
    loading.value = false;
  }
}

// Reset task form
function resetTaskForm() {
  id.value = null;
  name.value = "";
  description.value = "";
  formTitle.value = "Add Task";
}

// ============= STUDENTS API FUNCTIONS =============

const studentHeaders = [
  { title: "First Name", value: "firstName" },
  { title: "Middle Name", value: "middleName" },
  { title: "Last Name", value: "lastName" },
  { title: "Birthday", value: "birthDate" },
  { title: "Grade Level", value: "gradeLevel" },
  { title: "", value: "delete", width: "80px" },
];

const pageStudent = ref(1);

const { data: getStudentReq, refresh: refreshStudentList } = await useLazyAsyncData(
  "get-students-" + pageStudent,
  () => $fetch("http://localhost:4000/api/students", {query: { page: pageStudent.value }}),
  {watch: [pageStudent]}
);

const pagesStudent = ref(0);

const pageRangeStudent = ref("-- --of--");

watchEffect(() => { 
  if (getStudentReq.value) {
    students.value = getStudentReq.value.items;
    pagesStudent.value = getStudentReq.value.pages;
    pageRangeStudent.value = getStudentReq.value.pageRange;
  }
});

// filter students
const filteredStudents = computed(function () {
  if (!searchStudent.value) {
    return students.value;
  } else {
    return students.value.filter(function (student) {
      return (
        student.firstName.toLowerCase().includes(searchStudent.value.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchStudent.value.toLowerCase()) ||
        (student.middleName && student.middleName.toLowerCase().includes(searchStudent.value.toLowerCase()))
      );
    });
  }
});






// Fetch all students
async function fetchStudents() {
  try {
    const response = await fetch(`${API_URL}/students`);
    const data = await response.json();
    students.value = data.items || [];  
  } catch (error) {
    console.error("Error fetching students:", error);
  }
}


// Add student
async function addStudent() {
  try {
    const response = await fetch(`${API_URL}/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: firstName.value,
        middleName: middleName.value,
        lastName: lastName.value,
        birthDate: formattedBirthdate.value,
        gradeLevel: gradeLevel.value,
      }),
    });

    if (!response.ok) throw new Error("Failed to add student");

    // After adding, fetch the updated list
    await fetchStudents();
    
    console.log("Student added successfully");
  } catch (error) {
    console.error("Error adding student:", error);
  }
}

// Edit student
function editStudent(item) {
  console.log("Edit item:", item);
  studentId.value = item._id || item.id;
  firstName.value = item.firstName;
  middleName.value = item.middleName;
  lastName.value = item.lastName;
  birthDate.value = item.birthDate;
  gradeLevel.value = item.gradeLevel;
  studentFormTitle.value = "Update Student";
  dialogAddStudent.value = true;
}

// Update student by id
async function updateStudentById() {
  try {
    const response = await fetch(`${API_URL}/students/${studentId.value}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: firstName.value,
        middleName: middleName.value,
        lastName: lastName.value,
        birthDate: formattedBirthdate.value,
        gradeLevel: gradeLevel.value,
      }),
    });

    if (!response.ok) throw new Error("Failed to update student");

    const updatedStudent = await response.json();
    const index = students.value.findIndex(
      (student) => (student._id || student.id) === studentId.value
    );
    if (index !== -1) {
      students.value[index] = updatedStudent;
    }
    console.log("Student updated:", updatedStudent);
  } catch (error) {
    console.error("Error updating student:", error);
  }
}

// Delete student
async function deleteStudent(studentIdParam) {
  try {
    const response = await fetch(`${API_URL}/students/${studentIdParam}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to delete student");

    const index = students.value.findIndex(
      (student) => (student._id || student.id) === studentIdParam
    );
    if (index !== -1) {
      students.value.splice(index, 1);
    }
    console.log("Student deleted:", studentIdParam);
  } catch (error) {
    console.error("Error deleting student:", error);
  }
}

// Submit student (add or update)
async function submitStudent() {
  try {
    loading.value = true;
    if (studentFormTitle.value === "Add Student") {
      await addStudent();
    }
    if (studentFormTitle.value === "Update Student") {
      await updateStudentById();
    }
    dialogAddStudent.value = false;
  } catch (error) {
    console.log(error);
  } finally {
    resetStudentForm();
    loading.value = false;
  }
}

// Reset student form
function resetStudentForm() {
  studentId.value = null;
  firstName.value = "";
  middleName.value = "";
  lastName.value = "";
  birthDate.value = "";
  gradeLevel.value = "";
  studentFormTitle.value = "Add Student";
}

// ============= LOAD DATA ON MOUNT =============
onMounted(async () => {
  await fetchTasks();
  await fetchStudents();
});
</script>