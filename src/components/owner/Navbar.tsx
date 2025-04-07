import  { useState } from 'react';
import { Bus, UserCircle } from 'lucide-react';
import {  useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { performLogout } from '../../redux/actions/authActions';
import toast from 'react-hot-toast';

export function Navbar() {
  const [showMenu, setShowMenu] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();



  const logout = () => {
    dispatch(performLogout());
    toast.success("You have successfully logged out.");
    navigate('/');
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleProfileClick = () => {
    //navigate('/profile');
  };

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Bus className="w-6 h-6 text-blue-600" />
            <span className="ml-2 text-xl font-semibold">Bus Quik</span>
          </div>
          <div className="relative">
            <button
              className="p-2 hover:bg-gray-100 rounded-full"
              onClick={toggleMenu}
            >
              <UserCircle className="w-6 h-6 text-gray-600" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleProfileClick}
                >
                  Profile
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
