FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

# Download database if DB_DOWNLOAD_URL is provided
ARG DB_DOWNLOAD_URL=""
RUN if [ -n "$DB_DOWNLOAD_URL" ]; then \
        echo "Downloading database from $DB_DOWNLOAD_URL..."; \
        python -c "import urllib.request; urllib.request.urlretrieve('$DB_DOWNLOAD_URL', '/app/schoolreview.db')"; \
        echo "Database downloaded successfully"; \
    else \
        echo "No DB_DOWNLOAD_URL provided. Backend will start with empty database."; \
    fi

ENV DB_PATH=/app/schoolreview.db

EXPOSE 8000

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]