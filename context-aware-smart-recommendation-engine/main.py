# main.py

import os
import argparse
from datetime import datetime
import csv
import sys

import numpy as np
import librosa
import requests
from tensorflow.keras.models import load_model

# ——— CONFIG ———
MOOD_LABELS = ['neutral','calm','happy','sad','angry','fearful','disgust','surprised']
EMO_TO_CODE = {
    'sad':      1,
    'happy':    2,
    'scared':   3,
    'surprised':4,
    'angry':    5,
    'disgusted':6,
    'neutral':  7
}
MOOD_CODE = {
    'happy':    1,
    'calm':     2,
    'neutral':  2,
    'surprised':2,
    'sad':      3,
    'angry':    3,
    'fearful':  3,
    'disgust':  3
}
WEATHER_CODES = {
    'Clear':       1,
    'Sunny':       1,
    'Clouds':      5,
    'Rain':        2,
    'Drizzle':     2,
    'Thunderstorm':3,
    'Snow':        4
}

def month_to_season(m):
    if m in (3,4,5):   return 1  # Spring
    if m in (6,7,8):   return 2  # Summer
    if m in (9,10,11): return 3  # Autumn
    return 4                 # Winter

def hour_to_timecode(h):
    if 5 <= h < 12:   return 1  # Morning
    if 12 <= h < 17:  return 2  # Afternoon
    if 17 <= h < 21:  return 3  # Evening
    return 4                   # Night

def date_to_daytype(d, holidays=()):
    key = d.strftime("%Y-%m-%d")
    if key in holidays:
        return 3  # Holiday
    if d.weekday() >= 5:
        return 2  # Weekend
    return 1      # Working day

# ——— HELPERS ———
def extract_audio_features(path, n_mfcc=40):
    try:
        y, sr = librosa.load(path, sr=None)
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)
        return np.mean(mfcc.T, axis=0).reshape(1, -1)
    except Exception as e:
        print(f"Error extracting audio features: {e}")
        sys.exit(1)

def fetch_weather(api_key, city):
    try:
        url = (
            f'https://api.openweathermap.org/data/2.5/weather'
            f'?q={city}&units=metric&appid={api_key}'
        )
        r = requests.get(url, timeout=10)
        r.raise_for_status()
        data = r.json()
        cond = data['weather'][0]['main']
        return WEATHER_CODES.get(cond, 5), data['main']['temp']
    except Exception as e:
        print(f"Error fetching weather data: {e}")
        print("Using default weather code: 5 (Clouds)")
        return 5, 20.0  # Default to cloudy, 20°C

def load_genre_mapping(path='code_text_genre.csv'):
    """
    Load a CSV with number-to-genre mapping.
    CSV format: <number>,<genre_label> per line (no header).
    """
    mapping = {}
    try:
        with open(path, newline='', encoding='utf-8') as f:
            reader = csv.reader(f)
            for row in reader:
                try:
                    key = int(row[0])
                    mapping[key] = row[1]
                except (ValueError, IndexError):
                    continue
        return mapping
    except FileNotFoundError:
        print(f"Warning: Genre mapping file '{path}' not found. Using default mapping.")
        return {i: f'Genre_{i}' for i in range(1, 21)}  # Default mapping for genres 1-20

def load_model_safe(model_path, model_name):
    """Safely load a model with error handling"""
    try:
        if not os.path.exists(model_path):
            print(f"Error: {model_name} file '{model_path}' not found.")
            print("Please ensure the model file exists in the current directory.")
            sys.exit(1)
        return load_model(model_path)
    except Exception as e:
        print(f"Error loading {model_name}: {e}")
        sys.exit(1)

def main(args):
    # 1) Load models
    emo_model = load_model_safe('Emotion_Voice_Detection_Model.h5', 'Emotion Voice Detection Model')
    genre_model = load_model_safe('model.weights.h5', 'Genre Model')

    # 2) Predict emotion
    feats = extract_audio_features(args.audio_file)
    probs = emo_model.predict(feats, verbose=0)[0]
    emo_idx = int(np.argmax(probs))
    emo_label = MOOD_LABELS[emo_idx]
    end_code = EMO_TO_CODE.get(emo_label, 7)
    dom_code = end_code
    mood_code = MOOD_CODE.get(emo_label, 2)

    # 3) Automatic context
    now = datetime.now()
    time_code   = hour_to_timecode(now.hour)
    day_code    = date_to_daytype(now, args.holidays or [])
    season_code = month_to_season(now.month)
    weather_code, temp = fetch_weather(args.weather_api_key, args.city)

    # 4) Parse provided context
    loc_code = {'home': 1, 'public place': 2, 'friends house': 3}.get(args.location.lower(), 1)
    social_code = {'alone': 1, 'my partner': 2, 'friends': 3, 'colleagues': 4,
                   'parents': 5, 'public': 6, 'my family': 7}.get(args.social.lower(), 1)
    phys_code = 1 if args.physical.lower() == 'healthy' else 2
    dec_code = 1 if args.decision.lower().startswith('user') else 2
    interact_code = args.interaction

    # 5) Build feature vector in DB order
    X = np.array([[
        time_code,
        day_code,
        season_code,
        loc_code,
        weather_code,
        social_code,
        end_code,
        dom_code,
        mood_code,
        phys_code,
        dec_code,
        interact_code
    ]], dtype=float)

    # 6) Load genre mapping
    GENRE_MAPPING = load_genre_mapping(args.genre_map)

    # 7) Predict genres
    pred = genre_model.predict(X, verbose=0)[0]
    top3 = np.argsort(pred)[::-1][:3]
    recs = [GENRE_MAPPING.get(i, f'Genre_{i}') for i in top3]

    # 8) Output
    print(f"Detected emotion: {emo_label}")
    print("Context vector:", X.tolist())
    print("Top-3 genres:", recs)


if __name__ == "__main__":
    p = argparse.ArgumentParser(
        description="Audio → Context → Genre pipeline"
    )
    p.add_argument("audio_file", help="Path to input WAV/MP3 sample")
    p.add_argument("--city",              required=True, help="City for weather lookup")
    p.add_argument("--weather_api_key",   required=True, help="OpenWeatherMap API key")
    p.add_argument("--location",          default="home", help="Home, Public place, Friends house")
    p.add_argument("--social",            default="alone", help="Alone, My partner, Friends, Colleagues, Parents, Public, My family")
    p.add_argument("--physical",          default="healthy", help="Healthy or Ill")
    p.add_argument("--decision",          default="user", help="User decided or given")
    p.add_argument("--interaction",       type=int, default=1, help="1 for first interaction, n for n-th")
    p.add_argument("--holidays",          nargs="*", help="List YYYY-MM-DD of extra holidays")
    p.add_argument("--genre_map",         default="code_text_genre.csv", help="CSV file for number→genre mapping")

    args = p.parse_args()
    main(args)
