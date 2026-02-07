import TaskItem from './TaskItem';
import { FileText } from 'lucide-react';

const TaskList = ({ tasks, onTaskUpdate, onTaskDelete, onToggleTaskCompletion }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No tasks</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new task.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onTaskUpdate={onTaskUpdate}
          onTaskDelete={onTaskDelete}
          onToggleTaskCompletion={onToggleTaskCompletion}
        />
      ))}
    </div>
  );
};

export default TaskList;