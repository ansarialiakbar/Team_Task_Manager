import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchTasks, 
  updateTaskStatus, 
  deleteTask 
} from '../redux/slices/taskSlice';
import TaskModal from '../components/tasks/TaskModal';
import { useForm } from 'react-hook-form';
import { canManageProject } from '../utils/roleUtils';
import { fetchProjects } from '../redux/slices/projectSlice';

const Tasks = () => {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector(state => state.tasks);
  const { user } = useSelector(state => state.auth);
  const { projects } = useSelector(state => state.projects);

  const [showModal, setShowModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [filter, setFilter] = useState('all'); // all, Todo, In Progress, Review, Done
  const [search, setSearch] = useState('');

  const { register, handleSubmit, reset } = useForm(); // For quick search if needed

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchProjects());
  }, [dispatch]);

  // Filter tasks
  const filteredTasks = tasks
    .filter(task => {
      const matchesStatus = filter === 'all' || task.status === filter;
      const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) ||
                           task.description?.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleStatusChange = (id, status) => {
    dispatch(updateTaskStatus({ id, status }));
  };

  const handleEdit = (task) => {
    setTaskToEdit(task);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this task?')) {
      dispatch(deleteTask(id));
    }
  };

  const getPriorityColor = (priority) => {
    if (priority === 'High') return 'badge-error';
    if (priority === 'Medium') return 'badge-warning';
    return 'badge-success';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Todo': 'bg-gray-500',
      'In Progress': 'bg-blue-500',
      'Review': 'bg-purple-500',
      'Done': 'bg-green-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold">All Tasks</h1>
        <button 
          onClick={() => { setTaskToEdit(null); setShowModal(true); }}
          className="btn btn-primary"
        >
          + New Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search tasks..."
          className="input input-bordered w-full md:w-80"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="join">
          {['all', 'Todo', 'In Progress', 'Review', 'Done'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`btn join-item ${filter === status ? 'btn-active' : ''}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks Table / Cards */}
      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-xl shadow">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Assigned To</th>
                <th>Due Date</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task._id} className="hover">
                  <td>
                    <div className="font-medium">{task.title}</div>
                    <div className="text-sm text-base-content/70 line-clamp-1">
                      {task.description}
                    </div>
                  </td>
                  <td>{task.project?.name}</td>
                  <td>{task.assignedTo?.name || 'Unassigned'}</td>
                  <td>
                    {task.dueDate ? (
                      <span className={new Date(task.dueDate) < new Date() && task.status !== 'Done' 
                        ? 'text-red-500 font-medium' : ''}>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    ) : '-'}
                  </td>
                  <td>
                    <div className={`badge ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </div>
                  </td>
                  <td>
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      className={`select select-bordered select-sm ${getStatusColor(task.status)} text-white`}
                    >
                      <option value="Todo">Todo</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Review">Review</option>
                      <option value="Done">Done</option>
                    </select>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(task)}
                        className="btn btn-sm btn-ghost"
                      >
                        Edit
                      </button>
                      {canManageProject(user) && (
                      <button 
                        onClick={() => handleDelete(task._id)}
                        className="btn btn-sm btn-ghost text-error"
                      >
                        Delete
                      </button>
             )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTasks.length === 0 && (
            <div className="text-center py-20 text-base-content/60">
              No tasks found
            </div>
          )}
        </div>
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setTaskToEdit(null);
        }}
        projectId={null}           // Global task page (optional project filter later)
        taskToEdit={taskToEdit}
        projects={projects} 
      />
    </div>
  );
};

export default Tasks;