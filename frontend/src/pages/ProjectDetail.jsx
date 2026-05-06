import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, createTask, updateTaskStatus } from '../redux/slices/taskSlice';

const ProjectDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { tasks } = useSelector(state => state.tasks);
  const [showTaskModal, setShowTaskModal] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks(id));
  }, [dispatch, id]);

  // Task creation and status update logic similar to above

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Project Tasks</h1>
      
      <div className="grid gap-4">
        {tasks.map(task => (
          <div key={task._id} className="card bg-base-100 shadow flex flex-row justify-between items-center p-4">
            <div>
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-sm text-gray-500">{task.assignedTo?.name}</p>
            </div>
            <select 
              value={task.status}
              onChange={(e) => dispatch(updateTaskStatus({ id: task._id, status: e.target.value }))}
              className="select select-bordered select-sm"
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Review">Review</option>
              <option value="Done">Done</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectDetail;