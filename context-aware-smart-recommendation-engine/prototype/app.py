# app.py
import os
import uuid
import numpy as np
import pandas as pd
import librosa
import tempfile
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from sklearn.preprocessing import OneHotEncoder
import soundfile as sf

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# ─── Startup: load model + build encoder ───────────────────────────
MODEL_PATH    = 'Emotion_Voice_Detection_Model.h5'
FEATURES_CSV  = 'features.csv'           # place this next to app.py
EMOTION_MODEL = load_model(MODEL_PATH)

# Read the CSV and fit the encoder one time
df          = pd.read_csv(FEATURES_CSV)
labels_raw  = df['labels'].values.reshape(-1, 1)
encoder     = OneHotEncoder()
encoder.fit(labels_raw)

# You can still keep a Python list of labels if you want quick index lookups:
EMOTION_LABELS = [lab[0] for lab in encoder.categories_[0]]
print("Available emotion labels:", EMOTION_LABELS)
# ────────────────────────────────────────────────────────────────────

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    audio_file = request.files['file']
    if audio_file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Save upload to a real temp file with original extension
    original_filename = audio_file.filename
    file_extension = os.path.splitext(original_filename)[1] if '.' in original_filename else '.webm'
    fd, tmp_path = tempfile.mkstemp(suffix=file_extension)
    os.close(fd)
    audio_file.save(tmp_path)

    try:
        # Try to load audio with better error handling
        y = None
        sr = None
        
        # Method 1: Try librosa directly
        try:
            y, sr = librosa.load(tmp_path,
                                 sr=22050*2,
                                 duration=2.5,
                                 offset=0.5,
                                 res_type='kaiser_fast')
            print("Successfully loaded with librosa")
        except Exception as e:
            print(f"Librosa load failed: {e}")
            
            # Method 2: Try with soundfile
            try:
                y, sr = sf.read(tmp_path)
                # Convert to mono if stereo
                if len(y.shape) > 1:
                    y = np.mean(y, axis=1)
                # Resample to target sample rate
                y = librosa.resample(y, orig_sr=sr, target_sr=22050*2)
                sr = 22050*2
                # Trim to 2.5 seconds
                target_length = int(2.5 * sr)
                if len(y) > target_length:
                    y = y[:target_length]
                else:
                    # Pad with zeros if too short
                    y = np.pad(y, (0, target_length - len(y)), 'constant')
                print("Successfully loaded with soundfile")
            except Exception as sf_error:
                print(f"Soundfile load failed: {sf_error}")
                
                # Method 3: Try with pydub as last resort
                try:
                    from pydub import AudioSegment
                    audio = AudioSegment.from_file(tmp_path)
                    # Convert to mono
                    audio = audio.set_channels(1)
                    # Set sample rate
                    audio = audio.set_frame_rate(22050*2)
                    # Export as wav
                    wav_path = tmp_path + '.wav'
                    audio.export(wav_path, format='wav')
                    
                    # Load with librosa
                    y, sr = librosa.load(wav_path, sr=22050*2, duration=2.5, offset=0.5)
                    
                    # Clean up temporary wav file
                    try:
                        os.remove(wav_path)
                    except:
                        pass
                    print("Successfully loaded with pydub")
                except Exception as pydub_error:
                    print(f"Pydub load failed: {pydub_error}")
                    return jsonify({"error": "Unsupported audio format. Please try recording again."}), 400

        if y is None or sr is None:
            return jsonify({"error": "Failed to load audio file"}), 400

        # Extract MFCC features
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        features = np.mean(mfccs, axis=1).reshape(1, -1)

        # Predict and invert one-hot
        pred = EMOTION_MODEL.predict(features)
        
        # Debug: Print raw predictions
        print("Raw prediction probabilities:", pred[0])
        print("Prediction shape:", pred.shape)
        
        # Get the predicted class index
        predicted_class = np.argmax(pred[0])
        print("Predicted class index:", predicted_class)
        
        # Get the predicted label
        label_full = encoder.inverse_transform(pred)[0][0]
        print("Full predicted label:", label_full)
        
        # Split gender and emotion
        if '_' in label_full:
            gender, emotion = label_full.split('_')
        else:
            gender = "unknown"
            emotion = label_full
            
        print("Extracted gender:", gender)
        print("Extracted emotion:", emotion)
        
        # Get confidence for the predicted emotion
        confidence = pred[0][predicted_class]
        print("Confidence:", confidence)

        return jsonify({
            "gender": gender,
            "emotion": emotion,
            "label_raw": label_full,
            "probabilities": pred[0].tolist(),
            "confidence": float(confidence),
            "predicted_class": int(predicted_class)
        })
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({"error": "Failed to process audio. Please try again."}), 500
    finally:
        # Clean up temp file
        try:
            os.remove(tmp_path)
        except:
            pass

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
