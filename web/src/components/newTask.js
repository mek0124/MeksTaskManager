import { useState } from 'react';

export default function NewTask({ onSubmit, message }) {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(taskData);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-fontColor text-xl font-bold mb-4">Create New Task</h2>
      
      {message.text && (
        <div className={`w-full p-2 mb-4 rounded ${message.isError ? 'bg-red-500' : 'bg-green-500'}`}>
          <p className="text-fontColor text-center">{message.text}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-4">
          <label className="block text-fontColor mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={taskData.title}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-primary border border-accent text-fontColor"
          />
        </div>

        <div className="mb-4">
          <label className="block text-fontColor mb-2">Description</label>
          <textarea
            name="description"
            value={taskData.description}
            onChange={handleChange}
            className="w-full p-2 rounded bg-primary border border-accent text-fontColor"
            rows="3"
          />
        </div>

        <div className="mb-4">
          <label className="block text-fontColor mb-2">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={taskData.dueDate}
            onChange={handleChange}
            className="w-full p-2 rounded bg-primary border border-accent text-fontColor"
          />
        </div>

        <div className="mb-6">
          <label className="block text-fontColor mb-2">Priority</label>
          <select
            name="priority"
            value={taskData.priority}
            onChange={handleChange}
            className="w-full p-2 rounded bg-primary border border-accent text-fontColor"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => onSubmit(null)} // This will close the popup
            className="bg-accent text-primary px-4 py-2 rounded font-bold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-primary text-fontColor px-4 py-2 rounded font-bold border border-accent"
          >
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
}