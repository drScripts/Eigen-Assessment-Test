# Eigen Assesment Project

## Table of Contents

1. [Database ERD Design](#database-erd-design)
2. [Overview](#overview)
3. [Prerequisites](#prerequisites)
4. [Setup](#setup)
5. [Running the Service](#running-the-service)
6. [Running Tests](#running-tests)

## Database ERD Design

Below is the Entity Relationship Diagram (ERD) for the database design:

![Database ERD Design](https://i.ibb.co.com/4m86Kxt/ERD.png)

## Overview

Eigen Assesment Project

## Prerequisites

Before running the application, ensure you have the following installed:

- **Node v22.0.0**: [Download Node](https://nodejs.org/id/download/package-manager) **(optional)**
- **MySQL 8.0**: [Download MySQL](https://dev.mysql.com/downloads/mysql/) **(optional)**
- **Docker**: [Install Docker](https://docs.docker.com/get-docker/)
- **Make**: Install via package manager, e.g., `sudo apt-get install make`

## Setup

To set up and run the application:

1. **Install dependencies:**

   Run the following command to install all required dependencies:
   ```sh
   yarn
   ```

2. **Create the `.env` file:**

   Copy the `.env.example` file to `.env` and configure it with the appropriate settings.

   Example configuration for local setup:
   ```env
   HOST=0.0.0.0
   PORT=3000

   DB_USER=
   DB_PASSWORD=
   DB_NAME=
   DB_HOST=
   DB_PORT=
   ```

   Example configuration for Docker setup:
   ```env
   HOST=0.0.0.0
   PORT=3000

   DB_USER=eigen_user
   DB_PASSWORD=eigen_password
   DB_NAME=eigen_db
   DB_HOST=localhost
   DB_PORT=3306
   ```

3. **Start dependencies:**

   If using Docker, run:
   ```sh
   make start-dep
   ```

4. **Run migrations:**

   Execute the migration to set up the database schema:
   ```sh
   yarn migration:up
   ```

5. **Run the service:**

   To start the service and run the API backend, use:
   ```sh
   make start
   ```

6. **Access the API Documentation:**

   Open your browser and navigate to:
   ```
   http://localhost:3000/docs
   ```

   Use the following credentials to access the documentation:
   - **Username:** eigen
   - **Password:** eigen_password

7. **Interact with the API:**

   - **Create a member** and **create books** using the documentation.
   - **Borrow Books:**
     Use the `/members/{id}/borrow-books` endpoint. In the request body, specify the books to borrow:
     ```json
     {
       "bookIds": [
         "57e369cf-a578-4128-bf0d-710f8b52811e"
       ]
     }
     ```
     Note: If you try to borrow more than 2 books, you will receive an error message.

   - **Verify Borrowing:**
     Check the `/members` endpoint to see the updated `borrowedBooksCount` field for the specified member. Also, verify the `/books` endpoint to see the updated `available` field.

   - **Return Books:**
     Send a request to the `/members/{id}/return-books` endpoint with a similar structure to the borrowing request. If the return time exceeds 7 days, a penalty will be applied.

   - **Verify Returning:**
     Check the `/books` and `/members` endpoints again to verify updates to the `borrowedBooksCount` and `available` fields.

## Running Tests

To run the tests:

1. **Create the `.env.test` file:**

   Copy the `.env.example` file to `.env.test` and configure it with the following settings:
   ```env
   DB_USER=root
   DB_PASSWORD=password
   DB_NAME=eigen_test_db
   DB_HOST=localhost
   DB_PORT=3306
   ```

2. **Run the tests:**

   Execute the tests with:
   ```sh
   yarn test
   ```