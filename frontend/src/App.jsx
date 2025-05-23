import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import Dashboard from './pages/DashboardPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AnalysisDetailPage from './pages/AnalysisDetailPage';
import ProfilePage from './pages/ProfilePage';
import Prepare from './pages/Prepare';
import { AuthProvider, useAuth } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {

    return (
        <Router>
            <AuthProvider>
                <Navbar />
            <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                <Route 
                    path="/dashboard" 
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } 
                />
                <Route 
                    path="/upload" 
                    element={
                        <PrivateRoute>
                            <UploadPage />
                        </PrivateRoute>
                    } 
                />
                <Route 
                    path="/prepare" 
                    element={
                        <PrivateRoute>
                            <Prepare />
                        </PrivateRoute>
                    } 
                />
                <Route 
                    path="/analysis/:id" 
                    element={
                        <PrivateRoute>
                            <AnalysisDetailPage />
                        </PrivateRoute>
                    } 
                />
                <Route 
                    path="/profile" 
                    element={
                        <PrivateRoute>
                             <ProfilePage /> 
                        </PrivateRoute>
                    } 
                    />

                    <Route path="*" element={<Navigate to="/" />} />

            </Routes>
            <Footer />
            </AuthProvider>
        </Router>
    );
}

export default App;
