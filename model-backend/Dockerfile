# Use official Node.js image with python
FROM node:20-slim

# Install python3, pip, and required system libraries
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    python-is-python3 \
    && rm -rf /var/lib/apt/lists/*

# Set up working directory
WORKDIR /app

# Copy package files and install Node.js dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy Python dependencies file and install Python libraries
COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt --break-system-packages || pip3 install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the port (Render will automatically detect this or bind to PORT env)
EXPOSE 3000

# Start the Node.js Express server
CMD ["node", "server.js"]
