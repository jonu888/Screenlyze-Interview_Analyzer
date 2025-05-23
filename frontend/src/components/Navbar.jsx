import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCog, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook
import projectIcon from '../assets/images/job-interview.png'; // Import the project icon
import { SkeletonNavbar } from './ui/Skeleton';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  // *** Replace the local isAuthenticated state ***
  // const [isAuthenticated, setIsAuthenticated] = useState(false); // This should be replaced with your actual auth state
  
  // *** Get isAuthenticated and logout from AuthContext ***
  const { isAuthenticated, logout } = useAuth();

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    // Use the logout function from AuthContext
    logout(); 
    navigate('/login'); // Redirect to login after logout
    setIsDropdownOpen(false);
  };

  if (loading) {
    return <SkeletonNavbar />;
  }

  return (
    <nav className="bg-slate-800 text-white py-4 shadow-xl sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link to="/" className="flex items-center text-2xl font-bold tracking-wide hover:text-slate-300 transition-colors duration-300">
          <img src={projectIcon} alt="Project Icon" className="h-8 w-8 mr-2" />
          Screenlyze
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/" className="text-slate-300 hover:text-white transition-colors duration-300">Home</Link>
          <Link to="/dashboard" className="text-slate-300 hover:text-white transition-colors duration-300">Dashboard</Link>
          <Link to="/prepare" className="text-slate-300 hover:text-white transition-colors duration-300">Prepare</Link>
          
          {/* Settings Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-2 rounded-full text-slate-300 hover:bg-slate-700 hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
              aria-label="Settings"
            >
              <FaCog className="w-5 h-5" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FaUser className="mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200 text-left"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FaSignInAlt className="mr-2" />
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FaUserPlus className="mr-2" />
                      Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
