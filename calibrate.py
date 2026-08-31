import os
import sys
import glob
import librosa
import numpy as np
from app import extract_audio_features, calculate_cloned_confidence, CONFIG

def calibrate_samples(sample_dir="./samples"):
    """
    Scans sample_dir for audio files starting with 'real_' or 'cloned_'.
    Extracts features, evaluates classification against current rules,
    and displays a detailed feature comparison matrix.
    """
    print("=================================================================================")
    print(f"       AI VOICE DETECTION ENGINE CALIBRATOR — scanning: '{sample_dir}'")
    print("=================================================================================")

    if not os.path.exists(sample_dir):
        print(f"Creating sample directory at '{sample_dir}'...")
        os.makedirs(sample_dir, exist_ok=True)
        print(f"Place your hackathon demo audio files here with naming convention:")
        print("  - real_speaker1.wav\n  - cloned_speaker1.wav\n  - real_speaker2.wav\n  - cloned_speaker2.wav")
        return

    audio_extensions = ("*.wav", "*.mp3", "*.flac", "*.ogg", "*.m4a")
    files = []
    for ext in audio_extensions:
        files.extend(glob.glob(os.path.join(sample_dir, ext)))

    if not files:
        print(f"No audio files found in '{sample_dir}'. Supported extensions: .wav, .mp3, .flac, .ogg, .m4a")
        print("Save your sample clips in this directory and re-run python calibrate.py")
        return

    real_results = []
    cloned_results = []

    print(f"\nProcessing {len(files)} audio sample(s)...\n")
    header = f"{'Filename':<24} | {'Label':<8} | {'Verdict':<12} | {'Conf':<5} | {'Flatness':<9} | {'MFCC Var':<9} | {'Jitter':<8} | {'ZCR':<7} | {'HF Ratio':<8}"
    print(header)
    print("-" * len(header))

    for filepath in sorted(files):
        fname = os.path.basename(filepath)
        label = "genuine" if fname.lower().startswith("real") else ("cloned" if fname.lower().startswith("cloned") else "unknown")

        try:
            y, sr = librosa.load(filepath, sr=22050, mono=True)
            duration = len(y) / sr
            if duration < 0.5:
                print(f"{fname:<24} | SKIP: Audio duration ({duration:.2f}s) < 0.5s")
                continue

            features = extract_audio_features(y, sr)
            conf = calculate_cloned_confidence(features)
            verdict = "cloned" if conf > CONFIG["decision_threshold"] else "genuine"

            row = {
                "file": fname,
                "label": label,
                "verdict": verdict,
                "conf": conf,
                "features": features
            }

            if label == "genuine":
                real_results.append(row)
            elif label == "cloned":
                cloned_results.append(row)

            match_str = "[OK]" if label == "unknown" or label == verdict else "[FAIL]"
            verdict_disp = f"{verdict} {match_str}"
            print(f"{fname:<24} | {label:<8} | {verdict_disp:<12} | {conf:<5.2f} | {features['spectral_flatness_mean']:<9.5f} | {features['mfcc_variance']:<9.2f} | {features['pitch_jitter']:<8.5f} | {features['zcr_mean']:<7.4f} | {features['high_freq_energy_ratio']:<8.4f}")

        except Exception as e:
            print(f"{fname:<24} | ERROR: {str(e)}")

    print("\n---------------------------------------------------------------------------------")
    print("AVERAGE FEATURE COMPARISON & SEPARATION:")
    print("---------------------------------------------------------------------------------")
    if real_results:
        avg_flat_real = float(np.mean([r["features"]["spectral_flatness_mean"] for r in real_results]))
        avg_mfcc_real = float(np.mean([r["features"]["mfcc_variance"] for r in real_results]))
        avg_jit_real = float(np.mean([r["features"]["pitch_jitter"] for r in real_results]))
        avg_conf_real = float(np.mean([r["conf"] for r in real_results]))
        print(f"GENUINE Samples ({len(real_results)} files):")
        print(f"  - Average Confidence Score : {avg_conf_real:.2f}")
        print(f"  - Average Spectral Flatness: {avg_flat_real:.6f}")
        print(f"  - Average MFCC Variance    : {avg_mfcc_real:.2f}")
        print(f"  - Average Pitch Jitter     : {avg_jit_real:.6f}")

    if cloned_results:
        avg_flat_clone = float(np.mean([r["features"]["spectral_flatness_mean"] for r in cloned_results]))
        avg_mfcc_clone = float(np.mean([r["features"]["mfcc_variance"] for r in cloned_results]))
        avg_jit_clone = float(np.mean([r["features"]["pitch_jitter"] for r in cloned_results]))
        avg_conf_clone = float(np.mean([r["conf"] for r in cloned_results]))
        print(f"\nCLONED Samples ({len(cloned_results)} files):")
        print(f"  - Average Confidence Score : {avg_conf_clone:.2f}")
        print(f"  - Average Spectral Flatness: {avg_flat_clone:.6f}")
        print(f"  - Average MFCC Variance    : {avg_mfcc_clone:.2f}")
        print(f"  - Average Pitch Jitter     : {avg_jit_clone:.6f}")

    print("=================================================================================")

if __name__ == "__main__":
    target_dir = sys.argv[1] if len(sys.argv) > 1 else "./samples"
    calibrate_samples(target_dir)
