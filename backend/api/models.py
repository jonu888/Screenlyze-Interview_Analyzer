from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _

class InterviewAnalysis(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='analyses')
    candidate_name = models.CharField(max_length=255)
    video_file = models.FileField(upload_to='interview_videos/')
    transcript = models.TextField()
    sentiment_score = models.FloatField(default=0.0)
    emotion_scores = models.JSONField(default=dict)
    pause_analytics = models.JSONField(default=dict)
    feedback = models.TextField()
    interview_score = models.FloatField(default=0.0, help_text="Overall interview performance score")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Analysis for {self.candidate_name} by {self.user.username}"

    def calculate_interview_score(self):
        """Calculate overall interview score based on various factors"""
        # Base score starts with sentiment
        score = self.sentiment_score * 0.4  # 40% weight for sentiment

        # Add emotion scores (30% weight)
        if self.emotion_scores:
            positive_emotions = ['joy', 'confidence', 'enthusiasm']
            emotion_score = sum(
                self.emotion_scores.get(emotion, 0) * 0.1
                for emotion in positive_emotions
            )
            score += emotion_score

        # Add pause analytics (30% weight)
        if self.pause_analytics:
            total_pauses = self.pause_analytics.get('total_pauses', 0)
            avg_pause = self.pause_analytics.get('avg_pause', 0)
            
            # Penalize for too many pauses or long pauses
            pause_score = 1.0
            if total_pauses > 5:
                pause_score -= (total_pauses - 5) * 0.05
            if avg_pause > 2.0:
                pause_score -= (avg_pause - 2.0) * 0.1
            
            pause_score = max(0.0, pause_score)  # Ensure score doesn't go below 0
            score += pause_score * 0.3

        # Normalize score to be between 0 and 1
        self.interview_score = max(0.0, min(1.0, score))
        return self.interview_score
