# WixBank - P2P Currency Exchange

This project is a Proof of Concept (PoC) for a Peer-to-Peer Currency Exchange Platform, built for a university thesis.

## Tech Stack

*   **Frontend**: React (Vite), TypeScript, Tailwind CSS, Shadcn/UI, React Query.
*   **Backend**: Django, Django REST Framework, Postgres (simulated with SQLite for dev), Celery (configured).
*   **Architecture**: Decoupled Client-Server.

## Project Structure

```text
WixBank/
├── backend/                # Django Project
│   ├── exchange/           # Main App (Models, Logic)
│   │   ├── models.py       # Wallet, Order, Transaction
│   │   ├── services.py     # Matching Engine (Atomic Transactions)
│   │   └── views.py        # API Endpoints
│   ├── wixbank/            # Project Settings
│   └── manage.py
├── frontend/               # React App
│   ├── src/
│   │   ├── components/     # UI Components (OrderBook, Forms)
│   │   ├── hooks/          # React Query Hooks
│   │   └── services/       # Axios API Client
│   └── package.json
```

## Setup Instructions

### 1. Backend Setup

1.  Navigate to the backend:
    ```bash
    cd backend
    ```
2.  Create and activate a virtual environment (Recommended):
    ```bash
    python -m venv venv
    # Windows:
    .\venv\Scripts\activate
    # Mac/Linux:
    source venv/bin/activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Apply database migrations:
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```
5.  Create a superuser (for admin access):
    ```bash
    python manage.py createsuperuser
    ```
6.  Run the server:
    ```bash
    python manage.py runserver
    ```

### 2. Frontend Setup

1.  Navigate to the frontend:
    ```bash
    cd frontend
    ```
2.  Install dependencies (if not already installed):
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```

## Key Features Implemented

*   **Atomic Matching Engine**: `backend/exchange/services.py` uses `select_for_update()` to lock order rows preventing race conditions when multiple users try to buy the same order simultaneously.
*   **Real-time UI**: The Order Book updates automatically (hooks ready for polling/invalidation).
*   **Currency Support**: Hardcoded for USD/KHR as requested, but extensible.
