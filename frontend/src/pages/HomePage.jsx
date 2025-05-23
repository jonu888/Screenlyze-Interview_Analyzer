import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaCogs, FaChartLine, FaLock } from 'react-icons/fa'; // Import icons
import backgroundImage from '../assets/images/bg.jpg'; // Import the background image

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section with Parallax Effect */}
      <div
        className="relative bg-cover bg-fixed bg-center h-screen flex items-center justify-center text-white"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div> {/* Overlay */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-4 animate-fade-in-up">Interview Analyzer</h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-up animation-delay-200">Unlock Your Potential with AI-Powered Interview Feedback</p>
          <button
            onClick={() => navigate('/upload')}
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-semibold rounded-full shadow-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105 animate-fade-in-up animation-delay-400"
          >
            Start Analyzing Your Interview
          </button>
        </div>
      </div>

      {/* About Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">About Interview Analyzer</h2>
          <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
            Interview Analyzer is an innovative platform designed to help you master your interview skills. 
            By leveraging cutting-edge artificial intelligence, we provide detailed and actionable feedback 
            on your practice interviews. Our system analyzes various aspects of your performance, including 
            your verbal responses, body language, tone, and overall confidence. This comprehensive analysis 
            gives you valuable insights into your strengths and areas for improvement, enabling you to refine 
            your technique and approach your next interview with greater confidence.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto mt-4">
            Whether you are preparing for your first job interview or aiming for a career change, 
            Interview Analyzer offers a supportive and effective way to practice and receive objective feedback. 
            Our goal is to empower you with the tools and insights needed to make a strong impression and 
            achieve your professional aspirations.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div className="flex flex-col items-center p-8 shadow-lg rounded-xl bg-gray-50 transition-transform duration-300 hover:scale-105">
              <FaCogs className="text-5xl text-purple-600 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">AI-Powered Analysis</h3>
              <p className="text-gray-700 leading-relaxed">Get in-depth feedback on your responses, tone, and body language using advanced AI algorithms.</p>
            </div>
            <div className="flex flex-col items-center p-8 shadow-lg rounded-xl bg-gray-50 transition-transform duration-300 hover:scale-105">
              <FaChartLine className="text-5xl text-purple-600 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Performance Insights</h3>
              <p className="text-gray-700 leading-relaxed">Identify your strengths and weaknesses with clear, actionable insights and performance tracking.</p>
            </div>
            <div className="flex flex-col items-center p-8 shadow-lg rounded-xl bg-gray-50 transition-transform duration-300 hover:scale-105">
              <FaLock className="text-5xl text-purple-600 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Secure & Private</h3>
              <p className="text-gray-700 leading-relaxed">Your practice sessions and personal data are encrypted and kept strictly confidential.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section (New Placeholder) */}
       <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-600 text-white text-2xl font-bold rounded-full mb-4">1</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Record Your Interview</h3>
              <p className="text-gray-700">Use our platform to record your practice interview questions and answers.</p>
            </div>
            <div className="flex flex-col items-center">
               <div className="flex items-center justify-center w-16 h-16 bg-purple-600 text-white text-2xl font-bold rounded-full mb-4">2</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">AI Analysis</h3>
              <p className="text-gray-700">Our AI processes your recording to evaluate various performance metrics.</p>
            </div>
            <div className="flex flex-col items-center">
               <div className="flex items-center justify-center w-16 h-16 bg-purple-600 text-white text-2xl font-bold rounded-full mb-4">3</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Receive Detailed Feedback</h3>
              <p className="text-gray-700">Get a comprehensive report with actionable insights and suggestions for improvement.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-purple-800 text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-6">Ready to Elevate Your Interview Skills?</h2>
          <p className="text-xl mb-8">Join Interview Analyzer today and get the feedback you need to succeed!</p>
          <Link 
            to="/register"
            className="inline-flex items-center px-10 py-4 border border-transparent text-lg font-semibold rounded-full shadow-lg text-purple-800 bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors duration-300 transform hover:scale-105"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
}
