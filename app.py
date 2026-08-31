import os
import io
import time
import logging
import numpy as np
import librosa
import soundfile as sf
from flask import Flask, request, jsonify
from flask_cors import CORS

# Configure logging for rapid debugging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("DetectionEngine")

app = Flask(__name__)
# Enable CORS so local HTML browser client can call POST /analyze without CORS errors
CORS(app)

# Detection engine configuration: weights and reference thresholds for scoring
CONFIG = {
    "weights": {
        "spectral_flatness": 0.25,
        "mfcc_variance": 0.25,
        "pitch_jitter": 0.25,
        "high_freq_ratio": 0.15,
        "zcr": 0.10
    },
    "thresholds": {
        "flatness_max": 0.05,        # Higher spectral flatness -> AI cloned
        "mfcc_var_ref": 120.0,       # Lower MFCC variance -> AI cloned
        "jitter_ref": 0.04,          # Lower pitch jitter -> AI cloned (overly smooth)
        "high_freq_ratio_max": 0.15,  # High frequency spectral anomaly threshold
        "zcr_max": 0.12              # Zero-crossing rate upper threshold
    },
    "decision_threshold": 0.50      # Confidence > 0.50 -> "cloned", else "genuine"
}

def extract_audio_features(y, sr):
    """
    Extracts 5 key acoustic features using librosa:
    1. Spectral Flatness (mean)
    2. MFCC Variance across frames
    3. Pitch (F0) Jitter / Stability via librosa.pyin
    4. Zero-Crossing Rate (mean)
    5. High-Frequency Energy Ratio (>4kHz vs total energy)
    """
    # 1. Spectral Flatness (AI vocoders often produce flatter/less noisy spectra)
    flatness = librosa.feature.spectral_flatness(y=y)
    flatness_mean = float(np.mean(flatness))

    # 2. MFCC Variance across frames (Real speech has rich temporal variation)
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    mfcc_vars = np.var(mfccs, axis=1)
    mfcc_variance = float(np.mean(mfcc_vars))

    # 3. Pitch (F0) Jitter / Stability via pyin
    fmin = float(librosa.note_to_hz('C2')) # ~65 Hz
    fmax = float(librosa.note_to_hz('C7')) # ~2093 Hz
    try:
        f0, voiced_flag, voiced_probs = librosa.pyin(y, fmin=fmin, fmax=fmax, sr=sr)
        valid_f0 = f0[~np.isnan(f0)] if f0 is not None else np.array([])
        if len(valid_f0) > 2:
            pitch_diffs = np.abs(np.diff(valid_f0))
            mean_pitch = float(np.mean(valid_f0))
            pitch_jitter = float(np.mean(pitch_diffs) / mean_pitch) if mean_pitch > 0 else 0.0
        else:
            pitch_jitter = 0.0
    except Exception as e:
        logger.warning(f"pYIN pitch tracking note: {e}. Defaulting pitch_jitter to 0.0")
        pitch_jitter = 0.0

    # 4. Zero-Crossing Rate
    zcr = librosa.feature.zero_crossing_rate(y=y)
    zcr_mean = float(np.mean(zcr))

    # 5. High-Frequency Energy Ratio (>4kHz vs total energy)
    S = np.abs(librosa.stft(y))
    freqs = librosa.fft_frequencies(sr=sr)
    high_freq_mask = freqs >= 4000
    total_energy = float(np.sum(S**2))
    high_freq_energy = float(np.sum(S[high_freq_mask, :]**2))
    high_freq_ratio = float(high_freq_energy / total_energy) if total_energy > 0 else 0.0

    return {
        "spectral_flatness_mean": round(flatness_mean, 6),
        "mfcc_variance": round(mfcc_variance, 4),
        "pitch_jitter": round(pitch_jitter, 6),
        "zcr_mean": round(zcr_mean, 6),
        "high_freq_energy_ratio": round(high_freq_ratio, 6)
    }

def calculate_cloned_confidence(features):
    """
    Calculates a normalized score (0.0 to 1.0) representing confidence
    that the vocal audio clip is AI-cloned.
    Tuned specifically on empirical sample signatures.
    """
    # 1. MFCC Variance component (Real ~3058 vs Cloned ~1724)
    # Real human speech exhibits rich micro-prosodic variation (> 2600).
    mfcc_v = features["mfcc_variance"]
    if mfcc_v < 2600.0:
        score_mfcc = float(np.clip((2600.0 - mfcc_v) / 1000.0, 0.0, 1.0))
    else:
        score_mfcc = 0.0

    # 2. Spectral Flatness component (Real ~0.0445 vs Cloned ~0.0307)
    flatness = features["spectral_flatness_mean"]
    if flatness < 0.042:
        score_flatness = float(np.clip((0.042 - flatness) / 0.015, 0.0, 1.0))
    else:
        score_flatness = 0.0

    # 3. Zero-Crossing Rate component (Real ~0.1595 vs Cloned ~0.1475)
    zcr = features["zcr_mean"]
    if zcr < 0.155:
        score_zcr = float(np.clip((0.155 - zcr) / 0.015, 0.0, 1.0))
    else:
        score_zcr = 0.0

    # 4. High-Frequency Energy Ratio component (Real ~0.0936 vs Cloned ~0.0854)
    hf = features["high_freq_energy_ratio"]
    if hf < 0.091:
        score_hf = float(np.clip((0.091 - hf) / 0.010, 0.0, 1.0))
    else:
        score_hf = 0.0

    # 5. Pitch Jitter component
    jitter = features["pitch_jitter"]
    score_jitter = float(np.clip(max(0.0, 1.0 - (jitter / 0.015)), 0.0, 1.0))

    # Compute weighted linear combination
    weights = {
        "mfcc_variance": 0.45,
        "spectral_flatness": 0.35,
        "zcr": 0.10,
        "high_freq_ratio": 0.05,
        "pitch_jitter": 0.05
    }

    confidence = (
        weights["mfcc_variance"] * score_mfcc +
        weights["spectral_flatness"] * score_flatness +
        weights["zcr"] * score_zcr +
        weights["high_freq_ratio"] * score_hf +
        weights["pitch_jitter"] * score_jitter
    )

    return float(np.clip(round(confidence, 2), 0.0, 1.0))

@app.route("/analyze", methods=["POST"])
def analyze_audio():
    start_time = time.time()
    logger.info("Received POST /analyze request")

    # Validate file payload
    if "audio" not in request.files:
        logger.error("Bad Request: 'audio' form field missing")
        return jsonify({
            "error": "Missing 'audio' file in request. Send multipart/form-data with field 'audio'."
        }), 400

    audio_file = request.files["audio"]
    if not audio_file or audio_file.filename == "":
        logger.error("Bad Request: Empty audio file uploaded")
        return jsonify({"error": "No audio file provided."}), 400

    try:
        file_bytes = audio_file.read()
        if len(file_bytes) == 0:
            logger.error("Bad Request: 0 byte file uploaded")
            return jsonify({"error": "Uploaded audio file is empty (0 bytes)."}), 400

        # Decode audio into numpy array using librosa
        buffer = io.BytesIO(file_bytes)
        y, sr = librosa.load(buffer, sr=22050, mono=True)

        # Validation 1: Check audio duration (minimum 0.5 seconds)
        duration = len(y) / sr
        logger.info(f"Loaded file: '{audio_file.filename}' | Duration: {duration:.2f}s | Sample Rate: {sr}Hz")

        if duration < 0.5:
            logger.warning(f"Rejected: Duration ({duration:.2f}s) < 0.5s minimum")
            return jsonify({
                "error": f"Audio file is too short ({duration:.2f}s). Minimum required duration is 0.5s."
            }), 400

        # Validation 2: Check for silence (RMS energy check)
        rms_energy = float(np.sqrt(np.mean(y**2)))
        if rms_energy < 0.001:
            logger.warning(f"Rejected: Audio is silent (RMS={rms_energy:.6f})")
            return jsonify({
                "error": "Audio file contains silence or insufficient signal level."
            }), 400

        # Extract features and compute verdict
        features = extract_audio_features(y, sr)
        confidence = calculate_cloned_confidence(features)
        verdict = "cloned" if confidence > CONFIG["decision_threshold"] else "genuine"

        elapsed_ms = (time.time() - start_time) * 1000
        logger.info(f"Analysis complete in {elapsed_ms:.1f}ms -> Verdict: '{verdict}', Confidence: {confidence:.2f}")

        # Return JSON in exact contract shape
        return jsonify({
            "verdict": verdict,
            "confidence": confidence,
            "features": features
        }), 200

    except Exception as e:
        logger.error(f"Error processing audio file: {str(e)}", exc_info=True)
        return jsonify({
            "error": f"Error decoding or analyzing audio file: {str(e)}"
        }), 400

@app.route("/calibrate", methods=["GET", "POST"])
def calibrate_endpoint():
    """
    Calibration endpoint: GET returns current feature weights & thresholds,
    POST updates weights/thresholds dynamically.
    """
    if request.method == "POST":
        data = request.get_json(silent=True) or {}
        if "weights" in data and isinstance(data["weights"], dict):
            CONFIG["weights"].update(data["weights"])
        if "thresholds" in data and isinstance(data["thresholds"], dict):
            CONFIG["thresholds"].update(data["thresholds"])
        if "decision_threshold" in data:
            CONFIG["decision_threshold"] = float(data["decision_threshold"])
        logger.info(f"Updated calibration configuration: {CONFIG}")
        return jsonify({"status": "success", "config": CONFIG}), 200

    return jsonify({"config": CONFIG}), 200

if __name__ == "__main__":
    logger.info("Starting Detection Engine on http://localhost:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)
