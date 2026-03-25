import os
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
try:
    print("Attempting to import torch...")
    import torch
    print(f"Torch version: {torch.__version__}")
    print("Torch imported successfully!")
except Exception as e:
    print(f"Torch import failed: {e}")
except OSError as e:
    print(f"OS Error during import: {e}")
