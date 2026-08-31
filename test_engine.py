import os
import numpy as np
import soundfile as sf

def generate_test_samples(output_dir="./samples"):
    os.makedirs(output_dir, exist_ok=True)
    sr = 22050
    duration = 3.0
    t = np.linspace(0, duration, int(sr * duration), endpoint=False)

    # 1. Generate real-like audio (high micro-variation, pitch jitter, dynamic spectrum)
    # Fundamental frequency F0 ~ 150 Hz with random frequency modulation (jitter)
    jitter = 5.0 * np.sin(2 * np.pi * 15 * t) + 2.0 * np.random.randn(len(t))
    f0 = 150.0 + jitter
    phase = 2 * np.pi * np.cumsum(f0) / sr
    real_audio = 0.5 * np.sin(phase) + 0.25 * np.sin(2 * phase) + 0.1 * np.sin(3 * phase)
    # Add natural unvoiced noise & amplitude envelope
    envelope = 0.5 + 0.5 * np.sin(2 * np.pi * 1.5 * t)
    noise = 0.03 * np.random.randn(len(t))
    real_speech = (real_audio * envelope) + noise
    real_speech = real_speech / np.max(np.abs(real_speech))

    real_path = os.path.join(output_dir, "real_speaker1.wav")
    sf.write(real_path, real_speech, sr)
    print(f"Generated test sample: {real_path}")

    # 2. Generate cloned-like audio (flat, hyper-stable pitch, low jitter, smooth spectrum)
    # Perfect constant pitch F0 = 150.0 Hz with zero jitter
    cloned_phase = 2 * np.pi * 150.0 * t
    cloned_audio = 0.6 * np.sin(cloned_phase) + 0.3 * np.sin(2 * cloned_phase) + 0.15 * np.sin(3 * cloned_phase)
    # Constant flat envelope
    cloned_speech = cloned_audio * 0.7
    cloned_speech = cloned_speech / np.max(np.abs(cloned_speech))

    cloned_path = os.path.join(output_dir, "cloned_speaker1.wav")
    sf.write(cloned_path, cloned_speech, sr)
    print(f"Generated test sample: {cloned_path}")

if __name__ == "__main__":
    generate_test_samples()
