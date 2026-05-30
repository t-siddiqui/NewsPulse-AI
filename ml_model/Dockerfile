# ── Stage 1: Build ──────────────────────────────────────────────────────────
# Use a slim Python 3.10 base to minimize container size
FROM python:3.10-slim

# Install system dependencies needed for lxml, newspaper3k
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libxml2-dev \
    libxslt-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory inside the container
WORKDIR /app

# Copy requirements first (leverages Docker layer caching)
COPY requirements.txt .

# Install PyTorch CPU-only first (saves ~1.5 GB vs GPU version)
# Then install the rest of the requirements
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu && \
    pip install --no-cache-dir -r requirements.txt

# Copy all remaining source files
COPY . .

# HuggingFace Spaces runs on port 7860 by default
# We map our FastAPI service to that port
EXPOSE 7860

# Set the PORT env var so main.py uses 7860 on HuggingFace
ENV PORT=7860

# Start the FastAPI inference service
CMD ["python", "main.py"]
