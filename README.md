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
* Export as Excel Sheets
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
<img width="1918" height="853" alt="Screenshot 2026-06-20 184258" src="https://github.com/user-attachments/assets/2020d807-3244-4ce3-937d-649dcd04a4b1" />
<img width="1918" height="912" alt="Screenshot 2026-06-20 182311" src="https://github.com/user-attachments/assets/eff8815d-bb61-471a-9ff5-3de55d33f919" />
<img width="1918" height="913" alt="Screenshot 2026-06-20 182255" src="https://github.com/user-attachments/assets/15c14fa0-cab6-4eec-98ba-d205299ea660" />
<img width="1918" height="842" alt="image" src="https://github.com/user-attachments/assets/ce00ee6b-e728-4ca6-9e64-34dddc1b9124" />
<img width="1918" height="853" alt="Screenshot 2026-06-20 184313" src="https://github.com/user-attachments/assets/9173598a-8f59-4963-833e-1be69de73714" />

## Live Demo

Frontend: [[Frontendd URL](https://crudaplly.netlify.app)]

Backend API: [[Backend URL](https://crud-application-rxyd.onrender.com)]

## Future Enhancements

* Product image upload
* Export to Excel/PDF
* Dashboard analytics
* Search and filtering
* Email Authentication

## Author

Simha Girish Botta 
