from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import InterviewAnalysis
from django.contrib.auth.models import User

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name', 'date_joined')
        read_only_fields = ('id', 'date_joined')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class InterviewAnalysisSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    interview_score = serializers.FloatField(read_only=True)

    class Meta:
        model = InterviewAnalysis
        fields = ('id', 'user', 'candidate_name', 'video_file', 'transcript',
                 'sentiment_score', 'emotion_scores', 'pause_analytics',
                 'feedback', 'interview_score', 'created_at', 'updated_at')
        read_only_fields = ('id', 'user', 'interview_score',
                          'created_at', 'updated_at')
        extra_kwargs = {
            'feedback': {'required': False}
        } 