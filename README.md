React.js application that takes a user-submitted image URL and draws bounding boxes around the faces detected by the Clarafai API (https://www.clarifai.com/).

Uses Postgres and Redis (on Heroku server) to store user credentials and generate JWT for session logins.

## Installation
```>npm run install```

Download and run associated API (https://github.com/j-guerrero/react-face-recognition-brain-api) to launch Node.js server.

## Running
```>npm run start```. Uses `react-scripts` to deploy on localhost:3000 (or prompt for different if port 3000 is in use)
