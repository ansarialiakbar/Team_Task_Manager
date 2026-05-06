import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, createProject } from '../redux/slices/projectSlice';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

const Projects = () => {
  const dispatch = useDispatch();
  const { projects, loading } = useSelector(state => state.projects);
  const [showModal, setShowModal] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const onSubmit = async (data) => {
    await dispatch(createProject(data));
    reset();
    setShowModal(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project._id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">{project.name}</h2>
              <p className="line-clamp-2">{project.description}</p>
              <div className="card-actions justify-end mt-4">
                <Link to={`/projects/${project._id}`} className="btn btn-sm btn-primary">
                  View
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Project Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Create New Project</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input {...register('name')} placeholder="Project Name" className="input input-bordered w-full" required />
              <textarea {...register('description')} placeholder="Description" className="textarea textarea-bordered w-full" />
              <div className="modal-action">
                <button type="button" onClick={() => setShowModal(false)} className="btn">Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;