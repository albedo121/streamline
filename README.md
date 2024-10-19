# Video Upload and HLS Conversion Application

This application is a simple web server built with Express that allows users to upload video files and converts them into HLS (HTTP Live Streaming) format.

## Key Features

1. **Video Upload**:
   - Users can upload video files via a POST request to the `/upload` endpoint. The application uses Multer middleware to handle file uploads.

2. **File Storage**:
   - Uploaded videos are saved in a designated `uploads` directory on the server, with each file renamed using a unique identifier (UUID) to avoid naming conflicts.

3. **Video Processing**:
   - Upon receiving an uploaded video, the application generates an HLS stream using FFmpeg, a powerful multimedia processing tool. The video is segmented into smaller parts suitable for streaming.

4. **Output Directory**:
   - The processed video files (including the HLS playlist file `index.m3u8` and segments) are stored in an `output` directory, organized by a unique trailer ID.

5. **CORS Configuration**:
   - The application is configured to handle CORS, allowing requests from specified origins, which is useful for frontend applications interacting with this backend.

6. **Serving Processed Files**:
   - The server serves the processed video files through static file serving, allowing clients to access the generated HLS stream.

7. **Response Handling**:
   - After processing the video, the application responds with a JSON object containing a message, the URL of the generated HLS stream, and the unique trailer ID.

## Summary

This application provides a way to upload videos and convert them into a format suitable for web streaming, making it easy to integrate video playback in web applications.
