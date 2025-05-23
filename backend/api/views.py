from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.http import StreamingHttpResponse
from django.core.files.storage import DefaultStorage
from django.core.files.base import ContentFile
from .models import InterviewAnalysis
from .serializers import (
    UserSerializer, UserLoginSerializer, InterviewAnalysisSerializer
)
from .utils.analyzer import extract_audio, transcribe_whisper, analyze_text, get_pause_analytics
from .utils.feedback import generate_feedback
import json
import os, uuid
from django.conf import settings
import google.generativeai as genai
from rest_framework.decorators import api_view, permission_classes
import re

User = get_user_model()
storage = DefaultStorage()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

class LoginView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = UserLoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            try:
                user = User.objects.get(email=serializer.validated_data['email'])
                if user.check_password(serializer.validated_data['password']):
                    refresh = RefreshToken.for_user(user)
                    return Response({
                        'access': str(refresh.access_token),
                        'refresh': str(refresh),
                        'user': UserSerializer(user).data
                    })
                else:
                    return Response(
                        {'error': 'Invalid credentials'}, 
                        status=status.HTTP_401_UNAUTHORIZED
                    )
            except User.DoesNotExist:
                return Response(
                    {'error': 'User not found'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AnalyzeVideoAPIView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InterviewAnalysisSerializer

    def post(self, request):
        try:
            video = request.FILES["video"]
            candidate_name = request.POST.get("candidate_name")

            # Save video temporarily for processing
            filename = f"{uuid.uuid4()}.mp4"
            temp_video_path = os.path.join("media", "interview_videos", filename)
            os.makedirs(os.path.dirname(temp_video_path), exist_ok=True)
            with open(temp_video_path, "wb+") as f:
                for chunk in video.chunks():
                    f.write(chunk)

            try:
                # Process video
                audio_path = extract_audio(temp_video_path)
                transcript, segments = transcribe_whisper(audio_path)
                try:
                    sentiment, emotions = analyze_text(transcript)
                    sentiment_score = float(sentiment.get('score', 0.0)) if isinstance(sentiment, dict) and sentiment.get('score') is not None else 0.0
                    if emotions is None:
                        emotions = {}
                except Exception as e:
                    sentiment_score = 0.0
                    emotions = {}
                    print("Sentiment analysis failed:", e)
                pause_data = get_pause_analytics(segments) if segments else {}

                analysis_data = {
                    'candidate_name': candidate_name,
                    'video_file': video,
                    'transcript': transcript,
                    'sentiment_score': sentiment_score,
                    'emotion_scores': emotions,
                    'pause_analytics': pause_data,
                    # Feedback will be generated after score calculation
                }

                print("Analysis data to be saved:", analysis_data)

                serializer = self.serializer_class(data=analysis_data)
                if serializer.is_valid():
                    analysis = serializer.save(user=request.user)
                    # Calculate and save interview score
                    analysis.calculate_interview_score()
                    analysis.save()
                    # Update serializer data with calculated score
                    serializer = self.serializer_class(analysis)

                    # Now generate feedback using the calculated score and analysis data
                    feedback = generate_feedback(
                        transcript,
                        sentiment_score,
                        emotions,
                        pause_data,
                        analysis.interview_score # Pass the calculated score
                    )
                    # Update the analysis instance with the generated feedback
                    analysis.feedback = feedback
                    analysis.save()

                    # Return the updated serialized data
                    serializer = self.serializer_class(analysis)
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                print("Serializer errors:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            finally:
                if os.path.exists(temp_video_path):
                    os.remove(temp_video_path)
                if os.path.exists("temp.wav"):
                    os.remove("temp.wav")

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UserAnalysesView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InterviewAnalysisSerializer

    def get_queryset(self):
        return InterviewAnalysis.objects.filter(user=self.request.user)

class AnalysisDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InterviewAnalysisSerializer

    def get_queryset(self):
        return InterviewAnalysis.objects.filter(user=self.request.user)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get(self, request):
        """Get user profile data"""
        user = request.user
        analyses = InterviewAnalysis.objects.filter(user=user)
        
        # Calculate average score and other stats
        total_score = sum(analysis.interview_score for analysis in analyses)
        avg_score = total_score / len(analyses) if analyses else 0
        
        profile_data = {
            **UserSerializer(user).data,
            'interviewsCompleted': len(analyses),
            'averageScore': avg_score,
            'lastInterview': analyses.first().created_at if analyses else None,
            'interviewHistory': [
                {
                    'date': analysis.created_at,
                    'score': analysis.interview_score,
                    'role': analysis.candidate_name,
                    'interview_score': analysis.interview_score,
                    'sentiment_score': analysis.sentiment_score
                }
                for analysis in analyses[:5]  # Get last 5 interviews
            ],
            'skills': [],  # This would come from a separate model in a real app
            'preferences': {
                'notifications': True,  # These would come from user preferences in a real app
                'emailUpdates': True,
                'darkMode': False,
                'language': 'English'
            }
        }
        return Response(profile_data)

    def put(self, request):
        """Update user profile data"""
        user = request.user
        serializer = self.serializer_class(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_interview_questions(request):
    """
    Search for interview questions using Google's Gemini API.
    Returns AI-generated questions and answers based on the role query.
    """
    print("Entering search_interview_questions view")
    query = request.GET.get('query', '').strip()
    print(f"Received query: {query}")
    if not query:
        print("Query parameter is missing")
        return Response({'error': 'Query parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        print("Attempting to configure Gemini API")
        # Configure Gemini API
        genai.configure(api_key=settings.GOOGLE_API_KEY)
        print("Gemini API configured")
        model = genai.GenerativeModel('models/gemini-1.5-flash')
        print("Gemini model loaded")

        # Create a prompt for the AI
        prompt = f"""Generate 3 interview questions and detailed answers for a {query} role.
        Format the response as a JSON array with the following structure:
        [
            {{
                "role": "{query}",
                "category": "technical",
                "difficulty": "intermediate",
                "question": "question text",
                "answer": "detailed answer with examples"
            }}
        ]
        Make sure the questions are relevant to the role and include code examples where appropriate.
        The difficulty should be one of: beginner, intermediate, advanced.
        The category should be one of: technical, behavioral, system_design, problem_solving, leadership."""

        print("Prompt created, calling Gemini API")
        # Generate response from Gemini
        response = model.generate_content(prompt)
        print("Received response from Gemini API")
        
        # Parse the response and convert to proper format
        try:
            print("Attempting to parse Gemini response as JSON")
            import json
            questions = json.loads(response.text)
            print("Successfully parsed JSON response")
            print('Backend returning questions (from JSON parse):', questions)
            return Response(questions)
        except json.JSONDecodeError:
            print("Failed to parse JSON, attempting text extraction")
            print('Raw Gemini API text response:', response.text)
            
            # Attempt to extract JSON from markdown code block
            json_match = re.search(r'```json\n(.*?)\n```', response.text, re.DOTALL)
            if json_match:
                json_string = json_match.group(1)
                print('Extracted potential JSON string from markdown:', json_string)
                try:
                    questions = json.loads(json_string)
                    print("Successfully parsed JSON from extracted markdown")
                    print('Backend returning questions (from markdown JSON parse):', questions)
                    return Response(questions)
                except json.JSONDecodeError:
                    print("Failed to parse JSON from extracted markdown, falling back to line extraction")
            
            # Fallback to line-by-line text extraction (if markdown extraction failed or no markdown found)
            questions = []
            current_question = None # Initialize as None
            lines = response.text.strip().split('\n')
            
            for line in lines:
                line = line.strip()
                if not line:
                    continue # Skip empty lines

                # More flexible pattern matching for questions
                # Look for lines that might be questions (e.g., ends with ?, starts with a number/bullet point, or contains common question words)
                is_potential_question = (
                    line.endswith('?') or
                    line[0].isdigit() or # Starts with a number
                    line.startswith('-') or line.startswith('*') or # Starts with a bullet point
                    any(line.lower().startswith(word) for word in ['what', 'how', 'why', 'describe', 'explain', 'tell'])
                )

                if is_potential_question:
                    if current_question:
                        # Append the previous question if found
                        questions.append({
                            'role': query,
                            'category': 'technical', # Default category
                            'difficulty': 'intermediate', # Default difficulty
                            'question': current_question['question'].strip(),
                            'answer': current_question['answer'].strip() if 'answer' in current_question else ''
                        })
                    # Start a new question
                    current_question = {
                        'question': line,
                        'answer': ''
                    }
                elif current_question is not None:
                    # Append line to the current question's answer
                    if current_question['answer']:
                        current_question['answer'] += '\n' + line
                    else:
                        current_question['answer'] = line

            # Append the last question after the loop
            if current_question:
                 questions.append({
                     'role': query,
                     'category': 'technical', # Default category
                     'difficulty': 'intermediate', # Default difficulty
                     'question': current_question['question'].strip(),
                     'answer': current_question['answer'].strip() if 'answer' in current_question else ''
                 })

            print(f"Successfully extracted {len(questions)} questions from text (line by line fallback)")
            print('Backend returning questions (from line extraction fallback):', questions)
            return Response(questions)

    except Exception as e:
        print(f"An error occurred in search_interview_questions: {e}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
