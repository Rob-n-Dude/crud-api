# CRUD API

## Project Description

This project is a CRUD API for managing users. The API allows creating, retrieving, updating, and deleting user records, as well as handling errors and scaling the application using the Node.js Cluster API.

## Features

The API provides the following endpoints:

### `GET /api/users`
- Retrieves a list of all users.
- Responses:
  - `200 OK`: An array of users.

### `GET /api/users/{userId}`
- Retrieves a user by their `userId`.
- Responses:
  - `200 OK`: The user object.
  - `400 Bad Request`: Invalid `userId` (not a UUID).
  - `404 Not Found`: No user found with the specified `userId`.

### `POST /api/users`
- Creates a new user.
- Request body must include:
  - `username` (string, required).
  - `age` (number, required).
  - `hobbies` (array of strings or an empty array, required).
- Responses:
  - `201 Created`: The newly created user object.
  - `400 Bad Request`: Missing required fields.

### `PUT /api/users/{userId}`
- Updates an existing user with the specified `userId`.
- Responses:
  - `200 OK`: The updated user object.
  - `400 Bad Request`: Invalid `userId` (not a UUID).
  - `404 Not Found`: No user found with the specified `userId`.

### `DELETE /api/users/{userId}`
- Deletes a user with the specified `userId`.
- Responses:
  - `204 No Content`: User successfully deleted.
  - `400 Bad Request`: Invalid `userId` (not a UUID).
  - `404 Not Found`: No user found with the specified `userId`.

### Error Handling
- Requests to non-existent endpoints return:
  - `404 Not Found`: A message indicating the resource was not found.
- Internal server errors return:
  - `500 Internal Server Error`: A message indicating an internal error.

## Installation and Usage

### Requirements
- Node.js version `22.14.0` or higher.
- NPM.

### Installation
1. Clone the repository:
  ```bash
  git clone <repository-url>
  ```
2. Install dependencies:
  ```bash
  npm install
  ```

### Configuration
- Modify an .env file in the root directory with the port for the application:
  ```bash
  PORT=4000
  ```

### Running the Application
- Development Mode:
  ```bash
  npm run start:dev
  ```

- Production Mode:
  ```bash
  npm run start:prod
  ```
  Builds the application using Webpack and runs the bundled file.

- Cluster Scaling Mode:
  ```bash
  npm run start:multi
  ```
  Starts the application using Node.js Cluster API.

- Prod Cluster Scaling Mode:
  ```bash
  npm run start:prod:multi
  ```
  Builds the application using Webpack and runs the bundled file using Node.js Cluster API.
