import { useState, useEffect } from "react";
import axios from "axios";

function DailyTasks({ user, missingSkills }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskId, setTaskId] = useState(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [allDone, setAllDone] = useState(false);

  useEffect(() => {
    generateTasks();
  }, []);

  const generateTasks = async () => {
    try {
      const res = await axios.post(
        "https://careeros-0w27.onrender.com/tasks/generate",
        {
          user_id: user.id,
          missing_skills: missingSkills || []
        }
      );
      setTasks(res.data.tasks);
      setTaskId(res.data.task_id);
      setCompletedCount(res.data.completed_count);
      setAllDone(res.data.completed_count === res.data.tasks.length);
    } catch (err) {
      console.error("Task generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (index) => {
    if (tasks[index].completed) return;
    try {
      const res = await axios.post(
        "https://careeros-0w27.onrender.com/tasks/complete",
        {
          user_id: user.id,
          task_index: index
        }
      );
      setTasks(res.data.tasks);
      setCompletedCount(res.data.completed_count);
      setAllDone(res.data.all_done);
    } catch (err) {
      console.error("Task completion error:", err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-indigo-400 font-bold">
          Generating your tasks... ⏳
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">
          Today's Tasks 📋
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Complete all 3 tasks to maintain your streak 🔥
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-800 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <p className="text-gray-400 text-sm font-bold">
            Daily Progress
          </p>
          <p className="text-white text-sm font-bold">
            {completedCount}/3 Done
          </p>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className="h-3 rounded-full bg-indigo-500 transition-all duration-500"
            style={{ width: `${(completedCount / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* All Done Banner */}
      {allDone && (
        <div className="bg-green-900 border border-green-500 rounded-xl p-4 mb-6 text-center">
          <p className="text-2xl mb-1">🎉</p>
          <p className="text-green-400 font-bold text-lg">
            All tasks completed!
          </p>
          <p className="text-green-300 text-sm mt-1">
            Your streak has been updated. Come back tomorrow!
          </p>
        </div>
      )}

      {/* Task Cards */}
      <div className="flex flex-col gap-4">
        {tasks.map((task, index) => (
          <div
            key={index}
            onClick={() => completeTask(index)}
            className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
              task.completed
                ? "bg-green-900 border-green-500 opacity-75"
                : "bg-gray-800 border-gray-700 hover:border-indigo-500"
            }`}
          >
            <div className="flex items-start gap-4">

              {/* Checkbox */}
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                task.completed
                  ? "bg-green-500 border-green-500"
                  : "border-gray-500"
              }`}>
                {task.completed && (
                  <span className="text-white text-xs">✓</span>
                )}
              </div>

              {/* Task Content */}
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  task.completed
                    ? "text-green-300 line-through"
                    : "text-white"
                }`}>
                  {task.task}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    task.type === "skill_gap"
                      ? "bg-red-900 text-red-300"
                      : "bg-indigo-900 text-indigo-300"
                  }`}>
                    {task.type === "skill_gap" ? `📚 ${task.skill}` : "⭐ General"}
                  </span>
                  {!task.completed && (
                    <span className="text-gray-500 text-xs">
                      Click to complete
                    </span>
                  )}
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Motivation */}
      {!allDone && (
        <div className="mt-6 bg-gray-800 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-sm">
            {completedCount === 0 && "Start your day strong! Complete task 1 🚀"}
            {completedCount === 1 && "Great start! 2 more tasks to go 💪"}
            {completedCount === 2 && "Almost there! 1 last task 🔥"}
          </p>
        </div>
      )}

    </div>
  );
}

export default DailyTasks;