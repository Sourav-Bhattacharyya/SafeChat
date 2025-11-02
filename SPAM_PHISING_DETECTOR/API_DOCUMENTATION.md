# **API Documentation: Message Classification Service**

This document provides instructions on setting up and running the local development server, as well as the detailed documentation for the message classification API endpoint.

## **1\. Project Setup and Startup**

This application requires a **Gemini API Key** to function, which must be stored securely in an environment file.

### **1.1. Create the Environment File**

Create a file named **.env** in the root directory of your project. This file will store your secret key.

**.env content:**

GEMINI\_API\_KEY \= your\_api\_key\_here

Replace your\_api\_key\_here with your actual key.

### **1.2. Running the Server**

Once the .env file is configured, you can start the FastAPI server using uvicorn.

Open your terminal in the project directory and execute the following command:

uvicorn app:app \--reload \--port 8080

| Parameter | Description |
| :---- | :---- |
| app:app | Specifies the application instance (app variable) within the Python file (app.py or similar). |
| \--reload | Enables hot-reloading (server restarts automatically on code changes). Ideal for development. |
| \--port 8080 | Sets the port the server listens on (you can change 8080 to any desired port). |

**Expected Output:**

The server should start, typically showing output similar to:

INFO:     Uvicorn running on \[http://127.0.0.1:8080\](http://127.0.0.1:8080) (Press CTRL+C to quit)  
INFO:     Started reloader process \[12345\]  
INFO:     Started server process \[67890\]  
INFO:     Waiting for application startup.  
INFO:     Application startup complete.

The API is now accessible at http://127.0.0.1:8080.

## **2\. API Endpoint Documentation**

The classification service exposes a single endpoint for analyzing a text message and determining its likelihood of being a phishing attempt or spam.

### **Endpoint: /classify (Suggested)**

Analyzes a message to determine if it is spam or phishing.

| Detail | Value |
| :---- | :---- |
| **Method** | POST |
| **URL** | http://127.0.0.1:8080/classify |
| **Content Type** | application/json |

### **2.1. Request Body**

The request body is a JSON object containing the message text to be classified.

**Schema:**

| Field | Type | Description |
| :---- | :---- | :---- |
| message | string | The text content of the message to analyze. |

**Example Request:**

{  
    "message": "Hey friend, you won a $1000 gift card\! Click here immediately to claim it before it expires."  
}

### **2.2. Response Body**

The response body is a JSON object containing the boolean results of the classification process.

**Schema:**

| Field | Type | Description |
| :---- | :---- | :---- |
| is\_phishing | boolean | true if the message is classified as a phishing attempt; false otherwise. |
| is\_spam | boolean | true if the message is classified as general spam; false otherwise. |

**Example Response (Success):**

{  
    "is\_phishing": true,  
    "is\_spam": false  
}

