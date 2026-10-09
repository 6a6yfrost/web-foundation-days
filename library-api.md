# Library Books API

This REST API allows users to manage books in a library system. The API uses the `/books` resource to create, read, update, delete, and search for books.

## Endpoints

### 1. List all books

- **Method:** GET
- **Path:** `/books`
- **Description:** Returns a list of all books.
- **Success status:** `200 OK`

Example:

```http
GET /books