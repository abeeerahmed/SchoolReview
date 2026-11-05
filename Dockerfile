FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

# Download and decompress database from GitHub release
RUN python -c "
import urllib.request, gzip, os, shutil
url = 'https://github.com/abeeerahmed/SchoolReview/releases/download/v1.0/bd_education.db.gz'
print('Downloading compressed database...')
urllib.request.urlretrieve(url, '/tmp/bd_education.db.gz')
print('Downloaded. Decompressing...')
with gzip.open('/tmp/bd_education.db.gz', 'rb') as f_in:
    with open('/app/schoolreview.db', 'wb') as f_out:
        shutil.copyfileobj(f_in, f_out)
os.remove('/tmp/bd_education.db.gz')
print('Database ready:', os.path.getsize('/app/schoolreview.db') / 1024 / 1024, 'MB')
"

ENV DB_PATH=/app/schoolreview.db

EXPOSE 8000

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]