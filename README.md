# Node.js Streams Demo

## Overview

This project demonstrates how to use Node.js streams and web streams to process and display large amounts of data efficiently. We will convert a CSV file to JSON and stream the data to the client, which will then render the data in a user-friendly UI.

## Features

- **Stream large CSV files to JSON**: Convert large CSV files to JSON and stream the data to the client without loading the entire file into memory.
- **Handle client-side streaming**: Use web streams to process and display data on the frontend incrementally.
- **Abort streaming**: Ability to stop the stream on the client side.

## Use Case

When dealing with large datasets, it’s inefficient and impractical to load the entire dataset into memory. Using Node.js streams and web streams allows for efficient processing and rendering of data by handling it in smaller, manageable chunks. This approach is particularly useful for applications that need to display real-time data or work with large files.

## Getting Started

### Prerequisites

- Node.js (version 14 or above)
- NPM (version 6 or above)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/SJ22032003/massive-data-streaming-nodejs
    ```

2. Navigate to the project directory:

    ```bash
    cd massive-data-streaming-nodejs
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

### Running the Application

1. Ensure you have a CSV file named `metadata.csv` in the root directory of the project. You can replace this file with any other CSV file of your choice.

2. Start the server:

    ```bash
    npm start
    ```

3. Open your browser and navigate to `http://localhost:3001` to see the frontend.

## Project Structure

- `index.js`: The main server file that sets up the Express application and defines the routes for streaming data.
- `public/index.html`: The frontend of the application where data is displayed.
- `public/script.js`: The JavaScript file handling the frontend logic for streaming data and updating the UI.
- `public/styles.css`: Basic styles for the frontend.

## How It Works

### Backend

1. **Express Server**: Serves the frontend and handles API routes.
2. **Streaming Data**: Uses Node.js streams to read a CSV file, convert it to JSON, and stream the data to the client.
3. **Abort Handling**: Listens for client disconnection and aborts the stream if the client disconnects.

### Frontend

1. **Fetching Data**: Initiates a fetch request to the server to start streaming data.
2. **Processing Streamed Data**: Uses web streams to decode and parse JSON data incrementally.
3. **Updating UI**: Renders the parsed data to the UI in real-time and provides controls to start and stop the stream.