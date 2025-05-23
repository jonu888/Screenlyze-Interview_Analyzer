from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, LoginView, AnalyzeVideoAPIView,
    UserAnalysesView, AnalysisDetailView, UserProfileView,
    search_interview_questions
)

urlpatterns = [
    # Authentication endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Profile endpoint
    path('profile/', UserProfileView.as_view(), name='user-profile'),

    # Analysis endpoints
    path('analyze/', AnalyzeVideoAPIView.as_view(), name='analyze-video'),
    path('analyses/', UserAnalysesView.as_view(), name='user-analyses'),
    path('analyses/<int:pk>/', AnalysisDetailView.as_view(), name='analysis-detail'),

    # Interview questions endpoint
    path('interview-questions/search/', search_interview_questions, name='search-interview-questions'),
]
