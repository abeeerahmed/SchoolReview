FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

# Download database if DB_DOWNLOAD_URL is provided
ARG DB_DOWNLOAD_URL=""
ENV DB_DOWNLOAD_URL=${DB_DOWNLOAD_URL}
RUN python download_db.py

ENV DB_PATH=/app/schoolreview.db

EXPOSE 8000

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]