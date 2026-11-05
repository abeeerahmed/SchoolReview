import os, sys, re, urllib.request, urllib.parse

url = os.environ.get("DB_DOWNLOAD_URL", "")
if not url:
    print("No DB_DOWNLOAD_URL provided. Backend will start with empty database.")
    sys.exit(0)

# Extract file ID from Google Drive URL
file_id = None
m = re.search(r'/d/([a-zA-Z0-9_-]+)', url)
if m:
    file_id = m.group(1)
m = re.search(r'id=([a-zA-Z0-9_-]+)', url)
if m:
    file_id = m.group(1)

if not file_id:
    print("Could not extract file ID from URL")
    sys.exit(1)

print(f"Downloading database from Google Drive (file_id={file_id})...")

# Google Drive download URL
download_url = f"https://drive.google.com/uc?export=download&id={file_id}"

try:
    # First request - may return confirmation page
    req = urllib.request.Request(download_url, headers={'User-Agent': 'Mozilla/5.0'})
    resp = urllib.request.urlopen(req)
    data = resp.read()
    
    # Check if we got HTML (confirmation page) instead of the file
    if data[:100].lower().find(b'<!doctype html>') >= 0 or data[:100].lower().find(b'<html') >= 0:
        print("Got confirmation page, extracting download link...")
        text = data.decode('utf-8', errors='ignore')
        # Find the download link with confirm token
        # Google Drive puts it in a form action or href
        confirm_match = re.search(r'confirm=([0-9A-Za-z_-]+)', text)
        if confirm_match:
            confirm = confirm_match.group(1)
            download_url = f"https://drive.google.com/uc?export=download&id={file_id}&confirm={confirm}"
            print(f"Using confirm token: {confirm}")
            data = urllib.request.urlopen(download_url).read()
        else:
            # Try with confirm=t
            download_url = f"https://drive.google.com/uc?export=download&id={file_id}&confirm=t"
            data = urllib.request.urlopen(download_url).read()
    
    # Verify we got binary data (not HTML)
    if data[:100].lower().find(b'<!doctype html>') >= 0 or data[:100].lower().find(b'<html') >= 0:
        print("ERROR: Still got HTML page instead of file")
        sys.exit(1)
    
    with open('/app/schoolreview.db', 'wb') as f:
        f.write(data)
    print('Database size:', os.path.getsize('/app/schoolreview.db') / 1024 / 1024, 'MB')
except Exception as e:
    print('Download failed:', e)
    sys.exit(1)