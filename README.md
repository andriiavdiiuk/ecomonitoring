## About The Project

This is a university project focused on eco-monitoring. The application collects and tracks environmental data.

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

Before running this project, ensure you have the following installed:

* Node.js (v22.20.0 LTS or later)
* MongoDB (v8.0 or later)

### Installation

1. #### Clone the repo
   ```sh
   git clone https://github.com/andriiavdiiuk/ecomonitoring.git
   ```
2. #### Install NPM packages
   ```sh
   npm install
   ```
3. #### Set up your environment variables
   ```env
    ALLOWED_ORIGINS=http://localhost:3000,http://example.com
    ENVIRONMENT=development
    JWT_SECRET=your_secret_key
    DB_CONNECTION_STRING=your_db_connection_string
    PORT=3000
    VITE_API_URL=http://localhost:3000/api
    ```

4. #### Run the project

    To start the project in development mode:
    ```sh
    npm run dev
    ```
   To build the production version:
    ```sh
   npm run build
    ```
   To run the production version:
    ```sh
    npm run run
    ```