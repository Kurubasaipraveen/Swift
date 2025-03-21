🌟 User, Post & Comment Management API
A RESTful API built with Node.js and Express for managing users, posts, and comments. This project demonstrates efficient data fetching, insertion, and management using MongoDB.

🚀 Features
✅ Load data from external APIs and store it in MongoDB
✅ CRUD operations for users, posts, and comments
✅ Efficient data fetching and upsert operations
✅ Proper error handling and validation
✅ Clean and scalable code structure

🛠️ Tech Stack
Backend: Node.js, Express.js
Database: MongoDB
External Data Source: JSONPlaceholder
HTTP Client: Axios


🌐 API Endpoints
1. Load Data from External API
GET /api/load

Fetches users, posts, and comments from JSONPlaceholder and inserts them into MongoDB.
If data already exists, it updates the records.
2. Get User by ID (with posts and comments)
GET /api/users/:userId

Retrieves a user along with their posts and comments.
Returns 404 if the user does not exist.
3. Add User
PUT /api/users

Inserts a new user into the database.
Returns 409 if the user already exists.
4. Delete All Users
DELETE /api/users

Deletes all users from the database.
5. Delete User by ID
DELETE /api/users/:userId

Deletes a user by ID.
Returns 404 if the user does not exist.

🌍 Sample Data (from JSONPlaceholder)
Users: /users
Posts: /posts
Comments: /comments
