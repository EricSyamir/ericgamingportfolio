# Drone Disaster Response System

A real-time human detection system for drone RTMP video feeds, designed to assist in disaster response scenarios. The system consists of a Python FastAPI backend for video processing and AI detection, and a web-based frontend for visualization and control.

## Features

- **Real-time RTMP Stream Processing**: Connect to any RTMP video feed from drones
- **AI-Powered Human Detection**: Uses YOLOv8 to detect humans in video frames
- **Live Visualization**: View processed video with detection bounding boxes
- **Detection Statistics**: Monitor human count and detection confidence in real-time
- **Responsive UI**: Modern interface that works on desktop and mobile devices

## System Architecture

The system consists of two main components:

1. **Python Backend (FastAPI)**
   - Processes RTMP video streams
   - Performs YOLOv8 object detection
   - Provides RESTful API endpoints

2. **Web Frontend (HTML/CSS/JavaScript)**
   - User interface for controlling the system
   - Real-time display of processed video
   - Detection statistics and logging

## Requirements

### Backend Requirements
- Python 3.8+
- OpenCV
- FastAPI
- Ultralytics YOLOv8
- Uvicorn
- Other dependencies listed in `requirements.txt`

### Frontend Requirements
- Web server (XAMPP/Apache)
- Modern web browser with JavaScript enabled

## Installation

### Step 1: Set up the Python Environment

```bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Set up the Web Frontend

1. Make sure XAMPP is installed and running
2. Copy the frontend files (`index.html`, `style.css`, `script.js`) to your XAMPP htdocs directory:
   ```
   C:\xampp\htdocs\dronedisaster\
   ```

## Running the System

### Step 1: Start the Backend Server

```bash
# Make sure your virtual environment is activated
# Navigate to the project directory
cd path/to/project

# Start the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Step 2: Start the Web Server

1. Start the Apache module in XAMPP Control Panel
2. Open a web browser and navigate to:
   ```
   http://localhost/dronedisaster/
   ```

## Usage Instructions

1. Enter an RTMP URL in the input field (e.g., `rtmp://example.com/live/stream`)
2. Click "Start Stream" to begin processing
3. The system will display the video feed with human detection bounding boxes
4. The dashboard will show the current human count and detection details
5. Click "Stop Stream" to end processing

## API Endpoints

- `POST /start-stream`: Start processing an RTMP stream
  - Payload: `{"rtmp_url": "rtmp://example.com/live/stream"}`

- `GET /stream-data`: Get the latest processing results
  - Returns: Human count, detections, and annotated frame

- `POST /stop-stream`: Stop the current stream processing

- `GET /health`: Check API health status

## Troubleshooting

- **Backend Connection Issues**: Ensure the FastAPI server is running on port 8000
- **RTMP Connection Failures**: Verify the RTMP URL is correct and accessible
- **Performance Issues**: Try reducing the video resolution or frame rate in the backend code
- **Model Loading Errors**: Ensure the YOLOv8 model file is correctly downloaded

## Notes

- The system is designed to run locally on a single machine
- For production use, additional security measures would be required
- The default YOLOv8 model (yolov8m.pt) provides a good balance of speed and accuracy

## License

This project is licensed under the MIT License - see the LICENSE file for details.
