FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

# Download database from Google Drive
ARG DB_DOWNLOAD_URL="https://drive.google.com/uc?export=download&id=1i-s7um8QP7uPhw_p1Zr0qVmrv-dL23EE"
RUN if [ -n "$DB_DOWNLOAD_URL" ]; then \
        echo "Downloading database..."; \
        python -c "
import urllib.request, os, re
url = '$DB_DOWNLOAD_URL'
# Handle Google Drive large file download
try:
    resp = urllib.request.urlopen(url)
    data = resp.read()
    if b'<!DOCTYPE html>' in data[:100] or b'<html' in data[:100]:
        # Need confirmation token
        import re
        token = re.search(rb'confirm=([0-9A-Za-z_-]+)', data)
        if token:
            url = url + '&confirm=' + token.group(1).decode()
            data = urllib.request.urlopen(url).read()
    with open('/app/schoolreview.db', 'wb') as f:
        f.write(data)
    print('Database size:', os.path.getsize('/app/schoolreview.db') / 1024 / 1024, 'MB')
except Exception as e:
    print('Download failed:', e)
    "; \
    fi

ENV DB_PATH=/app/schoolreview.db

EXPOSE 8000

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]