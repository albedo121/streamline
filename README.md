# Video Upload and HLS Conversion Application PoC

This is a PoC application. It is a simple web server built with Express that allows users to upload video files and converts them into HLS (HTTP Live Streaming) format.

## Work flow of the application

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


## How to Use the Application

Follow these steps to set up and use the Video Upload and HLS Conversion Application:

### Prerequisites

- Ensure you have Node.js and Bun installed on your machine.
- Install FFmpeg. You can download it from [FFmpeg's official website](https://ffmpeg.org/download.html).

### Installation

1. **Clone the Repository**:

2. **Install Dependencies**:
   ```bash
   npm install
   ```

### Running the Application

1. **Start the Server**:
   ```bash
   npm start
   ```
   The server will start and listen on port 3000 (or the specified port in the code).

### Uploading a Video

1. **Use an API Client**:
   - You can use tools like [Postman](https://www.postman.com/) to send a POST request to the `/upload` endpoint.

2. **Set Up the Request**:
   - **URL**: `http://localhost:3000/upload`
   - **Method**: POST
   - **Body**: Form-data
     - Key: `file` (this should be the name of the file input in the code)
     - Value: Choose the video file you want to upload. A sample video file is present in test-video directory.

3. **Send the Request**:
   - After setting up the request, send it. The server will process the uploaded video.
   - The processing will take time depending on file size and how powerful your machine is. So please be patient as this process will take time.

### Receiving the Response

- Upon successful processing, you will receive a JSON response containing:
  - A message confirming the conversion.
  - The URL of the generated HLS stream.
  - The unique trailer ID for the uploaded video.

### Testing the HLS Stream using Video.js library

1. You can access the HLS stream using the URL provided in the response. This URL will point to the `index.m3u8` file that you can use for playback in compatible video players.
2. Navigate to the 'frontend' directory and open the app.jsx file.
3. Add the url received from json response under const 'videoLink'.
4. Run the react application using npm (Make sure u are in frontend directory)
   ```bash
   npm run dev
   ```
5. Click on the 'http://localhost:5173/' link in console which will open the video player in browser.
6. Click on play button. Under netowrk tab you can see the HLS stream responses named 'segmentxxx'
