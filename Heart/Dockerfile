FROM python:3.10-slim

# Install only the runtime dependencies for XGBoost (not build tools)
RUN apt-get update && apt-get install -y \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Upgrade pip & wheel so numpy/xgboost install binary wheels (small!)
RUN pip install --upgrade pip wheel

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Explicitly copy your model file
COPY xgb_model.pkl /app/xgb_model.pkl

EXPOSE 8000

CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:8000", "--workers", "2", "--threads", "2", "--timeout", "200"]
