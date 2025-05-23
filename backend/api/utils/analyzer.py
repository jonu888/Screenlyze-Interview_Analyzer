import whisper
import ffmpeg
from transformers import pipeline
import uuid, os

whisper_model = whisper.load_model("base")
sentiment_model = pipeline("sentiment-analysis")
emotion_model = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base", top_k=None)

def extract_audio(video_path):
    audio_path = "temp.wav"
    try:
        (
            ffmpeg
            .input(video_path)
            .output(audio_path, format='wav', acodec='pcm_s16le', ac=1, ar='16k')
            .overwrite_output()
            .run(capture_stdout=True, capture_stderr=True)
        )
        if not os.path.exists(audio_path):
            raise Exception("No audio stream found in the uploaded video. Please upload a video with audio.")
        return audio_path
    except ffmpeg.Error as e:
        error_message = e.stderr.decode()
        if 'Output file does not contain any stream' in error_message or 'Invalid argument' in error_message:
            raise Exception("No audio stream found in the uploaded video. Please upload a video with audio.")
        raise Exception(f"Error extracting audio: {error_message}")

def transcribe_whisper(audio_path):
    result = whisper_model.transcribe(audio_path)
    return result['text'], result['segments']

def get_pause_analytics(segments):
    pauses = []
    for i in range(1, len(segments)):
        prev_end = segments[i - 1].get('end')
        curr_start = segments[i].get('start')
        if prev_end is not None and curr_start is not None:
            pause = curr_start - prev_end
            if pause > 0.5:
                pauses.append(round(pause, 2))
    total_pauses = len(pauses)
    avg_pause = round(sum(pauses) / total_pauses, 2) if pauses else 0
    return {"total_pauses": total_pauses, "avg_pause": avg_pause, "pauses": pauses}

def analyze_text(text):
    sentiment = sentiment_model(text[:512])
    emotions = emotion_model(text[:512])
    emotion_scores = {e['label']: e['score'] for e in emotions[0]}
    return sentiment[0], emotion_scores
