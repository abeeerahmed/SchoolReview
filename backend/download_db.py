import os, sys

url = os.environ.get("DB_DOWNLOAD_URL", "")
if not url:
    print("No DB_DOWNLOAD_URL provided. Backend will start with empty database.")
    sys.exit(0)

print(f"Downloading database from {url}...")

# Try gdown first (handles Google Drive large files)
try:
    import gdown
    # Extract file ID
    import re
    file_id = None
    m = re.search(r'/d/([a-zA-Z0-9_-]+)', url)
    if m:
        file_id = m.group(1)
    m = re.search(r'id=([a-zA-Z0-9_-]+)', url)
    if m:
        file_id = m.group(1)
    if file_id:
        gdown.download(f"https://drive.google.com/uc?id={file_id}", '/app/schoolreview.db', quiet=False)
        print('Database size:', os.path.getsize('/app/schoolreview.db') / 1024 / 1024, 'MB')
        sys.exit(0)
except ImportError:
    pass
except Exception as e:
    print('gdown failed:', e)

# Fallback: try direct download
import urllib.request
try:
    urllib.request.urlretrieve(url, '/app/schoolreview.db')
    print('Database size:', os.path.getsize('/app/schoolreview.db') / 1024 / 1024, 'MB')
except Exception as e:
    print('Download failed:', e)
    sys.exit(1)