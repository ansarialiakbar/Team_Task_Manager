import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(state => state.auth);

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const result = await dispatch(registerUser(data));
    if (!result.error) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl">Register</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            <input
              type="text"
              placeholder="Full Name"
              className="input input-bordered w-full"
              {...register('name')}
              required
            />

            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full"
              {...register('email')}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="input input-bordered w-full"
              {...register('password')}
              required
            />

            {/* ✅ Role Dropdown */}
            <select
              className="select select-bordered w-full"
              {...register('role')}
              defaultValue="Member"
            >
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </select>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="text-center">
            Already have an account?{' '}
            <Link to="/login" className="link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;