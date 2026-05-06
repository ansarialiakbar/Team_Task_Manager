import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <div className="navbar bg-base-100 shadow">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">TeamTask</Link>
      </div>
      <div className="flex-none gap-4">
        <span className="text-sm">{user?.name} ({user?.role})</span>
        <button onClick={() => dispatch(logout())} className="btn btn-error btn-sm">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;