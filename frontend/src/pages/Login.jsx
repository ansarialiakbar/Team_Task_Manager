import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(state => state.auth);

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const result = await dispatch(login(data));
    if (!result.error) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl">Login</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="email" placeholder="Email" className="input input-bordered w-full" {...register('email')} required />
            <input type="password" placeholder="Password" className="input input-bordered w-full" {...register('password')} required />
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="text-center">
            Don't have an account? <Link to="/register" className="link">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;