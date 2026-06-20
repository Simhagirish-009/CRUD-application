# CRUD-application
This is a simple product inventory which allows you to perform CRUD operations
# Product Inventory Management System

## Overview

A full-stack Product Inventory Management System developed using React.js, Django REST Framework, and PostgreSQL. The application allows users to manage products through Create, Read, Update, and Delete (CRUD) operations.

## Features

* Add new products
* View product list
* Update product details
* Delete products
* Responsive user interface
* REST API integration
* PostgreSQL database support

## Tech Stack

### Frontend

* React.js
* Bootstrap React-Bootstrap 
* Axios

### Backend

* Django
* Django REST Framework

### Database

* PostgreSQL

### Deployment

* Netlify (Frontend)
* Render (Backend & Database)

## Project Structure

frontend/
├── src/
├── public/
└── package.json

backend/
├── backend/
├── myapp/
├── manage.py
└── requirements.txt

## Installation

### Backend Setup

```bash
git clone <repository-url>
cd backend

pip install -r requirements.txt

python manage.py migrate

python manage.py runserver
```

### Frontend Setup

```bash
cd frontend

npm install

npm start
```

## API Endpoints

| Method | Endpoint            | Description      |
| ------ | ------------------- | ---------------- |
| GET    | /api/products/      | Get all products |
| POST   | /api/products/      | Add product      |
| PUT    | /api/products/{id}/ | Update product   |
| DELETE | /api/products/{id}/ | Delete product   |

## Screenshots

Add screenshots here.

## Live Demo

Frontend: [[Frontendd URL](https://crudaplly.netlify.app)]

Backend API: [[Backend URL](https://crud-application-rxyd.onrender.com)]

## Future Enhancements

* Product image upload
* Export to Excel/PDF
* Dashboard analytics
* Search and filtering

## Author

Simha Girish Botta 
