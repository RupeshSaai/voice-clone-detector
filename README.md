# AI Voice-Cloning Detection Engine (Backend)

The **Detection Engine** is the brain of the AI voice-cloning detection system. It analyzes uploaded audio clips using acoustic signal processing with `librosa`, extracts key biological and synthetic voice artifacts, and calculates a normalized 0–1 confidence score to classify voices as **`genuine`** or **`cloned`**.

---

## ⚡ Quick Start (Setup & Run)

### 1. Installation

Install all required dependencies:

```bash
pip install flask flask-cors librosa numpy soundfile
```

*(Alternatively, if using `requirements.txt`: `pip install -r requirements.txt`)*

### 2. Run the Detection Engine Backend

```bash
python app.py
```

The Flask server will start at **`http://localhost:5000`**.

---

## 🛰️ Shared Contract & API Specification

### `POST /analyze`

- **Content-Type**: `multipart/form-data`
- **Field Name**: `audio` (WAV, MP3, FLAC, OGG, M4A)
- **CORS**: Enabled (`*`) for direct browser call access.

#### Example Request (`curl`)

```bash
curl -X POST http://localhost:5000/analyze \
  -F "audio=@samples/cloned_speaker1.wav"
```

#### Example Response (JSON)

```json
{
  "verdict": "cloned",
  "confidence": 0.87,
  "features": {
    "spectral_flatness_mean": 0.003421,
    "mfcc_variance": 32.41,
    "pitch_jitter": 0.004125,
    "zcr_mean": 0.045123,
    "high_freq_energy_ratio": 0.021054
  }
}
```

- Verdict is `"cloned"` if `confidence > 0.50`, otherwise `"genuine"`.

---

## 🎛️ Calibration Script (`calibrate.py`)

Save your demo audio clips in `./samples/` with naming convention:
- `real_speaker1.wav`
- `cloned_speaker1.wav`
- `real_speaker2.wav`
- `cloned_speaker2.wav`

Then run:

```bash
python calibrate.py
```

This will run feature extraction across all sample clips, output a feature comparison matrix, print accuracy checks `[OK] / [FAIL]`, and display average feature separation so you can fine-tune feature weights/thresholds in `app.py`.

---

## 🔬 30-Second Science Pitch for Judges

> **"Our detection engine doesn't just look at text—it analyzes the fundamental physical physics of human vocal production versus synthetic neural rendering.**
>
> 1. **Spectral Flatness**: Neural vocoders (like HiFi-GAN) generate smoother, flatter spectral noise distributions compared to complex vocal tract resonances.
> 2. **MFCC Variance**: Human speech constantly fluctuates across frames due to breath support and articulation; synthetic audio displays unnaturally low temporal variance.
> 3. **Pitch (F0) Jitter**: Using `librosa.pyin`, we measure micro-instability in pitch. Human vocal cords naturally vibrate with micro-jitter, whereas AI models output hyper-stable or artificial step pitch contours.
> 4. **Zero-Crossing Rate (ZCR)**: Tracks rapid sign changes at unvoiced boundaries to spot synthetic noise floor artifacts.
> 5. **High-Frequency Energy Ratio**: Measures energy above 4kHz. Synthetic voice generators trained on band-limited audio exhibit sharp high-frequency roll-offs or phase distortion."**
