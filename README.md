                    Documentation

A. Introduction:

Smart Task Manager API is a simple backend project using Node.js with Express as a backend framework. It allows creating and listing the users and checking the server health, where the users are stored temporarily.

B. What express does

Express is a web framework that handles HTTP requests and responses.

C. Request Flow

This is how the application flows:

. Client sends request  
. Express receives it
. Router decides which controller to run
. Controller handles the request and sends a response
. Server listens and keeps everything running
. Response is sent back

D. Folders Structure

Folders are structured by functionality to make code clean and organized

i. routes/:  It connects URLs to controller functions.

This is how it is done: When someone visits an endpoint, the route calls the correct controller function.

ii. controller/: It controls what happens when a request comes in(creating a user, listing all users, and checking if the server is running well).

iii. data/: This stores temporarily the created users.

E. How to run the project:

1. Clone the repository:

https://github.com/Uwineza99/smart-task-manager-api.git

2. Install dependencies

npm install

3. Start the server

npm run dev

4. You will see that the server is running on 3000 port

5. Use Postman to create and list users
