import { useState, useEffect } from 'react';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import ApiService from '../services/api';

const Prepare = () => {
  const [activeTab, setActiveTab] = useState('common');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const commonQuestions = [
    {
      question: "Tell me about yourself.",
      answer: "This is your opportunity to give a brief overview of your professional background. Focus on your relevant experience, key achievements, and what makes you a good fit for the role. Keep it concise (2-3 minutes) and highlight your most impressive accomplishments."
    },
    {
      question: "What are your greatest strengths?",
      answer: "Choose 2-3 strengths that are relevant to the job. For each strength, provide a specific example of how you've used it in a professional context. For example: 'I'm highly organized, which I demonstrated by successfully managing multiple projects simultaneously in my previous role.'"
    },
    {
      question: "What are your greatest weaknesses?",
      answer: "Choose a real weakness that you're actively working to improve. Show self-awareness and demonstrate your commitment to growth. For example: 'I sometimes take on too many tasks. I'm working on this by improving my delegation skills and using project management tools.'"
    },
    {
      question: "Why do you want to work for this company?",
      answer: "Research the company thoroughly and mention specific aspects that appeal to you, such as their culture, values, products, or recent achievements. Show how your goals align with the company's mission and how you can contribute to their success."
    },
    {
      question: "Where do you see yourself in five years?",
      answer: "Show ambition while being realistic. Focus on professional growth and how you plan to develop your skills. Mention how you want to grow within the company and contribute to its success. Avoid mentioning specific job titles or salary expectations."
    },
    {
      question: "Why should we hire you?",
      answer: "Highlight your unique combination of skills, experience, and qualities that make you the best candidate. Provide specific examples of your achievements and how they relate to the job requirements. Show enthusiasm and confidence in your ability to contribute."
    },
    {
      question: "What is your expected salary?",
      answer: "Research the market rate for the position and your experience level. If possible, let the employer make the first offer. If you must provide a number, give a range based on your research. Be prepared to justify your expectations based on your skills and experience."
    },
    {
      question: "Do you have any questions for us?",
      answer: "Prepare thoughtful questions about the role, team, company culture, and growth opportunities. Avoid asking about salary, benefits, or vacation time in the first interview. Good questions show your interest and help you evaluate if the role is right for you."
    }
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await ApiService.searchInterviewQuestions(searchQuery);
      console.log('API Search Results:', results);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching questions:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsSearching(false);
    }
  };

  const toggleQuestion = (index) => {
    setExpandedQuestion(expandedQuestion === index ? null : index);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Interview Preparation</h1>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-6 py-3 text-lg font-medium ${
            activeTab === 'common'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('common')}
        >
          Common Questions
        </button>
        <button
          className={`px-6 py-3 text-lg font-medium ${
            activeTab === 'role'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('role')}
        >
          Role-Specific Questions
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {activeTab === 'common' ? (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Common Interview Questions</h2>
            <div className="space-y-4">
              {commonQuestions.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleQuestion(index)}
                    className="w-full p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left flex justify-between items-center"
                  >
                    <span className="font-medium text-gray-800">{item.question}</span>
                    <span className="text-gray-500">
                      {expandedQuestion === index ? '▼' : '▶'}
                    </span>
                  </button>
                  {expandedQuestion === index && (
                    <div className="p-4 bg-white border-t border-gray-200">
                      <p className="text-gray-700 whitespace-pre-line">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Role-Specific Questions</h2>
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for role-specific questions (e.g., 'Python Developer', 'Data Scientist')"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                  {isSearching ? <FaSpinner className="animate-spin" /> : 'Search'}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleQuestion(index)}
                    className="w-full p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <span className="font-medium text-gray-800 block mb-1">{result.question}</span>
                        <div className="flex gap-2 text-sm text-gray-500">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full capitalize">{result.category}</span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full capitalize">{result.difficulty}</span>
                        </div>
                      </div>
                      <span className="text-gray-500 ml-4">
                        {expandedQuestion === index ? '▼' : '▶'}
                      </span>
                    </div>
                  </button>
                  {expandedQuestion === index && (
                    <div className="p-4 bg-white border-t border-gray-200">
                      <p className="text-gray-700 whitespace-pre-line">{result.answer}</p>
                    </div>
                  )}
                </div>
              ))}
              {searchResults.length === 0 && searchQuery && !isSearching && (
                <p className="text-center text-gray-500">No questions found. Try a different search term.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prepare; 