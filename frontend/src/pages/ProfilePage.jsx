import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
import { useAuth } from '../context/AuthContext';
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
  LineChart 
} from '../components/ui/charts';
import { 
  User,
  Settings,
  History,
  Mail,
  Calendar,
  TrendingUp,
  Clock,
  Edit2,
  Save,
  X,
  AlertCircle
} from 'lucide-react';

function ProfilePage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: '',
    date_joined: '',
    interviewsCompleted: 0,
    averageScore: 0,
    lastInterview: null,
    interviewHistory: [],
    preferences: {
      notifications: true,
      emailUpdates: true,
      darkMode: true,
      language: 'English'
    }
  });

  const [editedProfile, setEditedProfile] = useState(profile);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getProfile();
        // Format the data to match our UI needs
        const formattedData = {
          ...data,
          name: `${data.first_name} ${data.last_name}`.trim() || data.username,
          role: data.role || 'User',
          date_joined: data.date_joined ? data.date_joined.split('.')[0] : null,
          interviewsCompleted: data.interviewsCompleted || 0,
          averageScore: data.averageScore || 0,
          lastInterview: data.lastInterview || null,
          interviewHistory: data.interviewHistory || [],
          preferences: data.preferences || {
            notifications: true,
            emailUpdates: true,
            darkMode: false,
            language: 'English'
          }
        };
        setProfile(formattedData);
        setEditedProfile(formattedData);
      } catch (err) {
        setError('Failed to load profile data. Please try again.');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    setEditedProfile(profile);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Split name into first and last name
      const [firstName = '', lastName = ''] = editedProfile.name.split(' ');
      
      // Prepare data for API
      const profileData = {
        first_name: firstName,
        last_name: lastName,
        email: editedProfile.email,
        role: editedProfile.role,
        preferences: editedProfile.preferences
      };

      const updatedData = await ApiService.updateProfile(profileData);
      
      // Format the response data
      const formattedData = {
        ...updatedData,
        name: `${updatedData.first_name} ${updatedData.last_name}`.trim() || updatedData.username,
        role: updatedData.role || 'User',
        date_joined: updatedData.date_joined ? updatedData.date_joined.split('.')[0] : null,
        interviewsCompleted: updatedData.interviewsCompleted || 0,
        averageScore: updatedData.averageScore || 0,
        lastInterview: updatedData.lastInterview || null,
        interviewHistory: updatedData.interviewHistory || [],
        preferences: updatedData.preferences || profile.preferences
      };
      
      setProfile(formattedData);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <AlertCircle className="h-12 w-12 mx-auto" />
          </div>
          <p className="text-gray-800">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const renderProfileInfo = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <User className="h-6 w-6 text-blue-600" />
              Personal Information
            </CardTitle>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-md transition-colors"
                >
                  <Save className="h-4 w-4" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{profile.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <p className="mt-1 text-gray-900 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {profile.email}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Role</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.role}
                    onChange={(e) => setEditedProfile({ ...editedProfile, role: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <p className="mt-1 text-gray-900 flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    {profile.role}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Member Since</label>
                <p className="mt-1 text-gray-900 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {profile.date_joined ? new Date(profile.date_joined).toLocaleDateString() !== 'Invalid Date' ? new Date(profile.date_joined).toLocaleDateString() : 'N/A' : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Average Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {profile.averageScore !== undefined && profile.averageScore !== null ? (profile.averageScore * 100).toFixed(1) + '%' : 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <History className="h-5 w-5 text-purple-600" />
              Interviews Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">
              {profile.interviewsCompleted !== undefined && profile.interviewsCompleted !== null ? profile.interviewsCompleted : 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="h-5 w-5 text-orange-600" />
              Last Interview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">
              {profile.lastInterview ? new Date(profile.lastInterview).toLocaleDateString() !== 'Invalid Date' ? new Date(profile.lastInterview).toLocaleDateString() : 'N/A' : 'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderInterviewHistory = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Interview Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <LineChart
              data={profile.interviewHistory.map(interview => ({
                date: new Date(interview.date).toLocaleDateString(),
                score: interview.score * 100
              }))}
              xField="date"
              yField="score"
              color="#3B82F6"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Interviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interview Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sentiment Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {profile.interviewHistory.map((interview, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(interview.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {interview.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        interview.interview_score >= 0.8 ? 'bg-green-100 text-green-800' :
                        interview.interview_score >= 0.6 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {(interview.interview_score * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        interview.score >= 0.8 ? 'bg-green-100 text-green-800' :
                        interview.score >= 0.6 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {(interview.score * 100).toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-6 w-6 text-gray-600" />
          Account Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
              <p className="text-sm text-gray-500">Receive email updates about your interviews</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={profile.preferences.emailUpdates}
                onChange={(e) => setProfile({
                  ...profile,
                  preferences: {
                    ...profile.preferences,
                    emailUpdates: e.target.checked
                  }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Push Notifications</h3>
              <p className="text-sm text-gray-500">Receive push notifications for updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={profile.preferences.notifications}
                onChange={(e) => setProfile({
                  ...profile,
                  preferences: {
                    ...profile.preferences,
                    notifications: e.target.checked
                  }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Dark Mode</h3>
              <p className="text-sm text-gray-500">Switch between light and dark theme</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={profile.preferences.darkMode}
                onChange={(e) => setProfile({
                  ...profile,
                  preferences: {
                    ...profile.preferences,
                    darkMode: e.target.checked
                  }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Language</label>
            <select
              value={profile.preferences.language}
              onChange={(e) => setProfile({
                ...profile,
                preferences: {
                  ...profile.preferences,
                  language: e.target.value
                }
              })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="mt-2 text-gray-600">Manage your account settings and view your interview history</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="history">Interview History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            {renderProfileInfo()}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            {renderInterviewHistory()}
          </TabsContent>

          <TabsContent value="settings">
            {renderSettings()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ProfilePage; 