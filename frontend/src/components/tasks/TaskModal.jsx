import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, updateTask } from '../../redux/slices/taskSlice';
import { useEffect } from 'react';

const TaskModal = ({ isOpen, onClose, projectId, taskToEdit = null, projects = [] }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    if (taskToEdit) {
      setValue('title', taskToEdit.title);
      setValue('description', taskToEdit.description);
      setValue('assignedTo', taskToEdit.assignedTo?._id || '');
      setValue('dueDate', taskToEdit.dueDate?.split('T')[0]);
      setValue('priority', taskToEdit.priority);
    } else {
      reset();
    }
  }, [taskToEdit, setValue, reset]);

  const onSubmit = async (data) => {
  const payload = taskToEdit
    ? { ...data, project: projectId || taskToEdit.project?._id }
    : data; // project comes from dropdown

  if (taskToEdit) {
    await dispatch(updateTask({ id: taskToEdit._id, ...payload }));
  } else {
    await dispatch(createTask(payload));
  }

  onClose();
};

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-lg">
        <h3 className="font-bold text-xl mb-4">
          {taskToEdit ? 'Edit Task' : 'Create New Task'}
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register('title', { required: true })}
            placeholder="Task Title"
            className="input input-bordered w-full"
            required
          />

          <textarea
            {...register('description')}
            placeholder="Description"
            className="textarea textarea-bordered w-full h-24"
          />
          {!taskToEdit && (
  <div>
    <label className="label">Project</label>
    <select
      {...register('project', { required: true })}
      className="select select-bordered w-full"
    >
      <option value="">Select Project</option>
      {projects.map(p => (
        <option key={p._id} value={p._id}>
          {p.name}
        </option>
      ))}
    </select>
  </div>
)}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Due Date</label>
              <input type="date" {...register('dueDate')} className="input input-bordered w-full" />
            </div>

            <div>
              <label className="label">Priority</label>
              <select {...register('priority')} className="select select-bordered w-full">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          {/* Only Admin can assign tasks */}
          {user?.role === 'Admin' && (
            <div>
              <label className="label">Assign To (User ID)</label>
              <input
                {...register('assignedTo')}
                placeholder="User ObjectId"
                className="input input-bordered w-full"
              />
            </div>
          )}

          <div className="modal-action">
            <button type="button" onClick={onClose} className="btn">Cancel</button>
            <button type="submit" className="btn btn-primary">
              {taskToEdit ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;