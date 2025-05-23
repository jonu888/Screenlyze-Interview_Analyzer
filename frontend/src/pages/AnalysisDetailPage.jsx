import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ApiService from '../services/api';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '../components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '../components/ui/tabs';
import { 
  BarChart, 
  LineChart, 
  PieChart 
} from '../components/ui/charts';
import { 
  AlertCircle, 
  TrendingUp, 
  Clock, 
  MessageSquare, 
  ThumbsUp,
  User,
  Calendar,
  Award
} from 'lucide-react';

export default function AnalysisDetailPage() {
    const { id } = useParams();
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                setLoading(true);
                const data = await ApiService.getAnalysisById(id);
                setAnalysis(data);
            } catch (err) {
                setError('Failed to load analysis details.');
                console.error('Error fetching analysis:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [id]);

    const renderFeedbackCard = (feedback) => {
        const feedbackPoints = feedback.split('. ').filter(point => point.trim());
        return (
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                        Detailed Feedback
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {feedbackPoints.map((point, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <ThumbsUp className="h-5 w-5 text-green-500 mt-1" />
                                <span className="text-gray-700">{point}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        );
    };

    const renderPauseAnalytics = (pauseData) => (
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    Speaking Pattern Analysis
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                        <h4 className="text-sm font-medium text-gray-500">Total Pauses</h4>
                        <p className="text-2xl font-bold text-purple-600">{pauseData.total_pauses}</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                        <h4 className="text-sm font-medium text-gray-500">Average Pause Duration</h4>
                        <p className="text-2xl font-bold text-purple-600">{pauseData.avg_pause}s</p>
                    </div>
                </div>
                {pauseData.pauses && pauseData.pauses.length > 0 && (
                    <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Pause Distribution</h4>
                        <LineChart
                            data={pauseData.pauses.map((pause, index) => ({
                                time: index + 1,
                                duration: pause
                            }))}
                            xField="time"
                            yField="duration"
                            color="#8B5CF6"
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );

    const renderInterviewScore = (score) => {
        const getScoreColor = (score) => {
            if (score >= 0.8) return 'text-green-600';
            if (score >= 0.6) return 'text-yellow-600';
            return 'text-red-600';
        };

        const getScoreLabel = (score) => {
            if (score >= 0.8) return 'Excellent';
            if (score >= 0.6) return 'Good';
            if (score >= 0.4) return 'Average';
            return 'Needs Improvement';
        };

        return (
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Award className="h-6 w-6 text-blue-600" />
                        Overall Interview Score
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-white shadow-lg mb-4">
                            <span className={`text-4xl font-bold ${getScoreColor(score)}`}>
                                {(score * 100).toFixed(1)}%
                            </span>
                        </div>
                        <p className={`text-xl font-semibold ${getScoreColor(score)}`}>
                            {getScoreLabel(score)}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                            Based on sentiment, emotions, and speaking patterns
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <Card className="max-w-2xl mx-auto mt-8 bg-red-50">
                <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="h-5 w-5" />
                        <p>{error}</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!analysis) {
        return (
            <Card className="max-w-2xl mx-auto mt-8">
                <CardContent className="p-6 text-center text-gray-600">
                    Analysis not found.
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-2">
                        <User className="h-8 w-8 text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-900">
                            Analysis for {analysis.candidate_name}
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <p>Analyzed on: {new Date(analysis.created_at).toLocaleString()}</p>
                    </div>
                </div>

                {renderInterviewScore(analysis.interview_score)}

                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="emotions">Emotional Analysis</TabsTrigger>
                        <TabsTrigger value="feedback">Detailed Feedback</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-green-600" />
                                        Overall Sentiment
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <BarChart
                                            data={[{ score: analysis.sentiment_score }]}
                                            xField="score"
                                            yField="score"
                                            color="#10B981"
                                        />
                                    </div>
                                    <div className="mt-4 text-center">
                                        <p className="text-2xl font-bold text-green-600">
                                            {analysis.sentiment_score > 0.6 ? 'Positive' : 
                                             analysis.sentiment_score > 0.4 ? 'Neutral' : 'Negative'}
                                        </p>
                                        <p className="text-sm text-gray-500">Sentiment Score: {analysis.sentiment_score}</p>
                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-orange-50 to-red-50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5 text-orange-600" />
                                        Key Emotions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <PieChart
                                            data={Object.entries(analysis.emotion_scores).map(([emotion, score]) => ({
                                                name: emotion,
                                                value: score
                                            }))}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                </div>

                        {analysis.pause_analytics && renderPauseAnalytics(analysis.pause_analytics)}
                    </TabsContent>

                    <TabsContent value="emotions" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Emotional Journey</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[400px]">
                                    <LineChart
                                        data={Object.entries(analysis.emotion_scores).map(([emotion, score]) => ({
                                            emotion,
                                            score
                                        }))}
                                        xField="emotion"
                                        yField="score"
                                        color="#F97316"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Emotion Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[400px]">
                                    <BarChart
                                        data={Object.entries(analysis.emotion_scores).map(([emotion, score]) => ({
                                            emotion,
                                            score
                                        }))}
                                        xField="emotion"
                                        yField="score"
                                        color="#F97316"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="feedback">
                        {renderFeedbackCard(analysis.feedback)}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
} 