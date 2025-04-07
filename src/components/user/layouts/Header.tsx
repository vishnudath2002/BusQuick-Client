import  { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { performLogout } from '../../../redux/actions/authActions';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import toast from 'react-hot-toast';
import { logout } from '../../../api/authApi';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  interface RootState {
    auth: {
      isLoggedIn: boolean | null;
    };
  }

  const isUser = useSelector((state: RootState) => state.auth.isLoggedIn);

  const handleLogout = async () => {
    try{
      const response = await logout();
      dispatch(performLogout());
      toast.success(response.message);
      navigate('/login');
      setShowDropdown(false);
    }catch(error:unknown){
      if(error instanceof Error){
        toast.error(error.message);
      }else{
        toast.error("Logout failed. Please try again.");
      }
    }
  };

  return (
    <header className="bg-[#007074] text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Bus Quik</h1>
      <nav>
        <ul className="flex items-center gap-4">
          <li><a href="/home" className="hover:text-gray-200">Home</a></li>
          <li><a href="/about" className="hover:text-gray-200">About</a></li>
          <li><a href="/contact" className="hover:text-gray-200">Contact</a></li>
          {isUser ? (
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-1 rounded-full hover:bg-[#005c5f] transition-colors"
              >
                <User size={24} />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <a 
                    href="/userprofile" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    Profile
                  </a>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <li><a href="/register" className="hover:text-gray-200">Register</a></li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;