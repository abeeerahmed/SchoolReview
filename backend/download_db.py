import os, sys, re

url = os.environ.get("DB_DOWNLOAD_URL", "")
if not url:
    print("No DB_DOWNLOAD_URL provided. Backend will start with empty database.")
    sys.exit(0)

print(f"Downloading database from {url}...")

# Google Drive file ID
file_id = None
if "drive.google.com" in url:
    import re
    m = re.search(r'/d/([a-zA-Z0-9_-]+)', url)
    if m:
        file_id = m.group(1)
    m = re.search(r'id=([a-zA-Z0-9_-]+)', url)
    if m:
        file_id = m.group(1)

if file_id:
    # Use Google Drive direct download with confirmation
    import urllib.request
    download_url = f"https://drive.google.com/uc?export=download&id={file_id}"
    try:
        resp = urllib.request.urlopen(download_url)
        data = resp.read()
        # Check if we got a confirmation page
        if b'<!DOCTYPE html>' in data[:200] or b'<html' in data[:200]:
            # Extract confirmation token
            text = data.decode('utf-8', errors='ignore')
            import re
            token_match = re.search(r'confirm=([0-9A-Za-z_-]+)', text)
            if token_match:
                confirm = token_match.group(1)
                download_url = f"https://drive.google.com/uc?export=download&id={file_id}&confirm={confirm}"
                data = urllib.request.urlopen(download_url).read()
            else:
                # Try with confirm=t
                download_url = f"https://drive.google.com/uc?export=download&id={file_id}&confirm=t"
                data = urllib.request.urlopen(download_url).read()
        with open('/app/schoolreview.db', 'wb') as f:
            f.write(data)
        print('Database size:', os.path.getsize('/app/schoolreview.db') / 1024 / 1024, 'MB')
    except Exception as e:
        print('Download failed:', e)
        sys.exit(1)
else:
    # Direct URL download
    import urllib.request
    try:
        urllib.request.urlretrieve(url, '/app/schoolreview.db')
        print('Database size:', os.path.getsize('/app/schoolreview.db') / 1024 / 1024, 'MB')
    except Exception as e:
        print('Download failed:', e)
        sys.exit(1)