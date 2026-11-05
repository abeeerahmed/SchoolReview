import urllib.request, os, re, sys

url = os.environ.get("DB_DOWNLOAD_URL", "")
if not url:
    print("No DB_DOWNLOAD_URL provided. Backend will start with empty database.")
    sys.exit(0)

print(f"Downloading database from {url}...")
try:
    resp = urllib.request.urlopen(url)
    data = resp.read()
    # Handle Google Drive large file download (needs confirmation token)
    if b'<!DOCTYPE html>' in data[:200] or b'<html' in data[:200]:
        token_match = re.search(rb'confirm=([0-9A-Za-z_-]+)', data)
        if token_match:
            confirm = token_match.group(1).decode()
            url = url + '&confirm=' + confirm
            data = urllib.request.urlopen(url).read()
    with open('/app/schoolreview.db', 'wb') as f:
        f.write(data)
    print('Database size:', os.path.getsize('/app/schoolreview.db') / 1024 / 1024, 'MB')
except Exception as e:
    print('Download failed:', e)
    sys.exit(1)