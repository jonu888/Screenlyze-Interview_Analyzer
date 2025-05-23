import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ApiService from '../services/api';
import EmotionChart from '../components/EmotionChart';
import SentimentChart from '../components/SentimentChart';
import { 
    ChartBarIcon, 
    UserGroupIcon, 
    ClockIcon, 
    ChartPieIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';

// Functions for combined analytics
const calculateOverallSentiment = (analyses) => {
    if (!analyses || analyses.length === 0) return 0;
    const validAnalyses = analyses.filter(analysis => analysis.sentiment_score !== undefined && analysis.sentiment_score !== null);
    if (validAnalyses.length === 0) return 0;
    const totalSentiment = validAnalyses.reduce((sum, analysis) => sum + (analysis.sentiment_score), 0);
    return parseFloat((totalSentiment / validAnalyses.length).toFixed(2)); // Return average as a float
};

const calculateOverallEmotions = (analyses) => {
    if (!analyses || analyses.length === 0) return {};
    const combinedEmotions = {};
    let totalAnalysesWithEmotions = 0;

    analyses.forEach(analysis => {
        if (analysis.emotion_scores && Object.keys(analysis.emotion_scores).length > 0) {
            totalAnalysesWithEmotions++;
            Object.entries(analysis.emotion_scores).forEach(([emotion, score]) => {
                combinedEmotions[emotion] = (combinedEmotions[emotion] || 0) + score;
            });
        }
    });

    // Average the emotion scores across analyses that have emotion data
    if (totalAnalysesWithEmotions === 0) return {};

    const averagedEmotions = {};
    Object.entries(combinedEmotions).forEach(([emotion, totalScore]) => {
        averagedEmotions[emotion] = parseFloat((totalScore / totalAnalysesWithEmotions).toFixed(4)); // Average as float
    });

    return averagedEmotions;
};

const calculateTotalPauses = (analyses) => {
    if (!analyses || analyses.length === 0) return 0;
    const total = analyses.reduce((sum, analysis) => sum + (analysis.pause_analytics?.total_pauses || 0), 0);
    return total;
};

const calculateTotalInterviews = (analyses) => {
    return analyses.length;
};

const calculateAveragePausesPerInterview = (analyses) => {
    if (!analyses || analyses.length === 0) return 0;
    return Math.round(calculateTotalPauses(analyses) / analyses.length);
};

const Dashboard = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user data if needed
                // const userResponse = await ApiService.getUserData();
                // setUserData(userResponse.data);

                // Fetch analysis history
                const analysesResponse = await ApiService.getAnalyses();
                setAnalyses(analysesResponse);

            } catch (err) {
                setError('Failed to load dashboard data or analysis history');
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLogout = async () => {
        try {
            await ApiService.logout();
            navigate('/login');
        } catch (err) {
            setError('Failed to logout');
            console.error('Error logging out:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Enhanced Header */}
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Interview Analytics Dashboard</h1>
                            <p className="mt-2 text-sm text-gray-600">Track and analyze your interview performance metrics</p>
                        </div>
                        
                    </div>

                    {/* Key Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                                    <UserGroupIcon className="h-6 w-6" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Interviews</p>
                                    <p className="text-2xl font-semibold text-gray-900">{calculateTotalInterviews(analyses)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                                    <ChartBarIcon className="h-6 w-6" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Avg. Pauses per Interview</p>
                                    <p className="text-2xl font-semibold text-gray-900">{calculateAveragePausesPerInterview(analyses)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                                    <ChartPieIcon className="h-6 w-6" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Overall Sentiment</p>
                                    <p className="text-2xl font-semibold text-gray-900">{calculateOverallSentiment(analyses).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="rounded-md bg-red-50 p-4 mb-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-red-800">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="mt-8">
                    {/* Combined Analytics Summary */}
                    <div className="bg-white shadow rounded-lg mb-8">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">Analytics Overview</h2>
                                    <p className="mt-1 text-sm text-gray-500">Comprehensive analysis of all interviews</p>
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <InformationCircleIcon className="h-5 w-5 mr-1" />
                                    <span>Hover over charts for details</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            {analyses.length > 0 ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Emotional Analysis</h3>
                                        <EmotionChart data={calculateOverallEmotions(analyses)} />
                                        <p className="mt-4 text-sm text-gray-600">Average emotional distribution across all interviews</p>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Sentiment Trend</h3>
                                        <SentimentChart score={calculateOverallSentiment(analyses)} />
                                        <p className="mt-4 text-sm text-gray-600">Overall sentiment score across interviews</p>
                                    </div>
                                    <div className="lg:col-span-2 bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Pause Analysis</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                                <p className="text-sm font-medium text-gray-600">Total Pauses</p>
                                                <p className="text-3xl font-bold text-indigo-600">{calculateTotalPauses(analyses)}</p>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                                <p className="text-sm font-medium text-gray-600">Average Pauses per Interview</p>
                                                <p className="text-3xl font-bold text-indigo-600">{calculateAveragePausesPerInterview(analyses)}</p>
                                            </div>
                                        </div>
                                        {/* Detailed Pauses List */}
                                        {analyses.length > 0 && calculateTotalPauses(analyses) > 0 && (
                                            <div className="mt-6">
                                                <h4 className="text-md font-medium text-gray-900 mb-2">Individual Pause Durations (seconds):</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {analyses.reduce((allPauses, analysis) => {
                                                        if (analysis.pause_analytics?.pauses) {
                                                            return allPauses.concat(analysis.pause_analytics.pauses);
                                                        }
                                                        return allPauses;
                                                    }, []).map((pause, index) => (
                                                        <span key={index} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            {pause.toFixed(2)}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">No analysis data available yet.</p>
                                    <Link to="/upload" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                                        Start Your First Analysis
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Analysis History */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">Interview History</h2>
                            <p className="mt-1 text-sm text-gray-500">Detailed view of all analyzed interviews</p>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {analyses.length > 0 ? (
                                analyses.map((analysis) => (
                                    <div key={analysis.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center">
                                                    <h3 className="text-lg font-medium text-gray-900 truncate">
                                                        {analysis.candidate_name}
                                                    </h3>
                                                    <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                        {new Date(analysis.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="mt-2 flex flex-wrap gap-4">
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <ChartBarIcon className="h-4 w-4 mr-1" />
                                                        Pauses: {analysis.pause_analytics?.total_pauses || 0}
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <ChartPieIcon className="h-4 w-4 mr-1" />
                                                        Sentiment: {analysis.sentiment_score?.toFixed(2) || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0">
                                                <Link
                                                    to={`/analysis/${analysis.id}`}
                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">No interview analysis history found.</p>
                                    <Link to="/upload" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                                        Upload Your First Interview
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 