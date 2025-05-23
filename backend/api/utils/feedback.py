import json
import google.generativeai as genai
import os
from django.conf import settings

def generate_feedback(transcript, sentiment_score, emotion_scores, pause_analytics, interview_score):
    """Generates detailed interview feedback using a generative model."""
    try:
        genai.configure(api_key=settings.GOOGLE_API_KEY)
        model = genai.GenerativeModel('models/gemini-1.5-flash')

        prompt = f"""Analyze the following interview transcript and provide detailed feedback based on the provided analysis data. 

Transcript: {transcript}

Analysis Data:
- Overall Interview Score (out of 1): {interview_score:.2f}
- Sentiment Score (typically -1 to 1): {sentiment_score:.2f}
- Emotion Scores: {json.dumps(emotion_scores)}
- Pause Analytics: {json.dumps(pause_analytics)}

Provide constructive feedback covering:
1.  Overall performance based on the interview score.
2.  Analysis of sentiment and emotional expression, suggesting areas for improvement if needed.
3.  Feedback on pauses, including frequency and duration, with tips for better pacing.
4.  Suggestions for improving clarity, confidence, and overall communication based on the transcript and analysis.
5.  Format the feedback as a well-structured paragraph or bullet points for easy reading.
"""

        response = model.generate_content(prompt)
        return response.text

    except Exception as e:
        print(f"Error generating feedback with Gemini API: {e}")
        # Fallback to basic feedback or return an error message
        return "Could not generate detailed feedback at this time. Please try again later."
