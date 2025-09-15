const { MongoClient } = require("mongodb");

// 🔑 Change this to your MongoDB URI
const uri = "mongodb://127.0.0.1:27017"; // Local
// const uri = "your-mongodb-atlas-connection-string"; // Atlas

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("taskDB"); // Database name
    const tasks = db.collection("tasks"); // Collection name

    // 1. InsertMany (bulk insert 30 tasks)
    const dummyTasks = [
      {
        taskTitle: "Design Landing Page",
        taskDescription: "Create a responsive UI for the product landing page",
        dueDate: "2025-09-20",
        status: "pending",
        assignedTo: "Alice"
      },
      {
        taskTitle: "Set Up Database Schema",
        taskDescription: "Design MongoDB schema for task management system",
        dueDate: "2025-09-22",
        status: "in-progress",
        assignedTo: "Bob"
      }
      // 👉 Paste all 30 tasks here (from the JSON I gave earlier)
    ];

    // Insert data (only once, comment this out after first run to avoid duplicates)
    await tasks.insertMany(dummyTasks);
    console.log("✅ Inserted tasks successfully!");

    // 2. Count tasks based on status
    const statusCount = await tasks.aggregate([
      { $group: { _id: "$status", totalTasks: { $sum: 1 } } }
    ]).toArray();
    console.log("📊 Task count by status:", statusCount);

    // 3. Find tasks assigned to a specific user (example: Alice)
    const aliceTasks = await tasks.find({ assignedTo: "Alice" }).toArray();
    console.log("👩‍💻 Tasks assigned to Alice:", aliceTasks);

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();