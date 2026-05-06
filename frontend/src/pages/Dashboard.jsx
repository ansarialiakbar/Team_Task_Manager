import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../redux/slices/projectSlice';
import { fetchTasks } from '../redux/slices/taskSlice';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { projects } = useSelector(state => state.projects);
  const { tasks, loading } = useSelector(state => state.tasks);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTasks());
  }, [dispatch]);

  const todo = tasks.filter(t => t.status === 'Todo');
  const inProgress = tasks.filter(t => t.status === 'In Progress');
  const done = tasks.filter(t => t.status === 'Done');
  const overdue = tasks.filter(t => 
    t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done'
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Welcome back, {user?.name} 👋</h1>
          <p className="text-base-content/70 mt-1">Here's what's happening with your projects</p>
        </div>
        <Link to="/projects" className="btn btn-primary mt-4 md:mt-0">Manage Projects</Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat bg-base-100 shadow-xl rounded-2xl">
          <div className="stat-title">Total Projects</div>
          <div className="stat-value text-primary">{projects.length}</div>
        </div>
        <div className="stat bg-base-100 shadow-xl rounded-2xl">
          <div className="stat-title">Pending Tasks</div>
          <div className="stat-value text-orange-500">{todo.length + inProgress.length}</div>
        </div>
        <div className="stat bg-base-100 shadow-xl rounded-2xl">
          <div className="stat-title">Completed</div>
          <div className="stat-value text-green-500">{done.length}</div>
        </div>
        <div className="stat bg-base-100 shadow-xl rounded-2xl border border-red-300">
          <div className="stat-title text-red-500">Overdue</div>
          <div className="stat-value text-red-500">{overdue.length}</div>
        </div>
      </div>

      {/* Overdue Tasks */}
      {overdue.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 text-red-500">🚨 Overdue Tasks</h2>
          <div className="grid gap-4">
            {overdue.slice(0, 5).map(task => (
              <div key={task._id} className="alert alert-error shadow-lg">
                <div>
                  <span className="font-medium">{task.title}</span>
                  <span className="text-sm ml-4">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Status Overview */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Task Overview</h2>
        <div className="flex flex-wrap gap-3">
          {['Todo', 'In Progress', 'Review', 'Done'].map(status => (
            <div key={status} className="badge badge-lg badge-outline p-4 text-lg">
              {status}: {tasks.filter(t => t.status === status).length}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;