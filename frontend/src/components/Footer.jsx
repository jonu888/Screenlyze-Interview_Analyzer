import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 px-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Interview Analyzer</h3>
          <p className="text-sm leading-relaxed">AI-powered tool to help you ace your interviews with confidence. Providing detailed analysis and actionable insights.</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-3">
            <li><Link to="/" className="hover:text-white transition-colors duration-300">Home</Link></li>
            <li><Link to="/dashboard" className="hover:text-white transition-colors duration-300">Dashboard</Link></li>
            <li><Link to="/upload" className="hover:text-white transition-colors duration-300">Upload</Link></li>
            <li><Link to="/profile" className="hover:text-white transition-colors duration-300">Profile</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
          <ul className="space-y-3">
            <li><Link to="/privacy" className="hover:text-white transition-colors duration-300">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white transition-colors duration-300">Terms of Service</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Connect With Us</h3>
          <div className="flex space-x-5">
            <a href="#" className="text-slate-400 hover:text-white transition-colors duration-300" aria-label="Twitter"><FaTwitter className="text-2xl" /></a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors duration-300" aria-label="LinkedIn"><FaLinkedin className="text-2xl" /></a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors duration-300" aria-label="GitHub"><FaGithub className="text-2xl" /></a>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-slate-700 pt-8 text-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} Interview Analyzer. All rights reserved.</p>
      </div>
    </footer>
  );
}
