# 🚀 Smart Lead Agent

[![Next.js](https://img.shields.io/badge/Next.js-15%2B-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0%2B-000000?style=for-the-badge&logo=flask)](https://flask.palletsprojects.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0%2B-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

An AI-powered, full-stack lead generation and outreach platform. **Smart Lead Agent** automates the process of discovering, enriching, and contacting potential leads using cutting-edge LLMs and background processing.

---

## 🏗️ Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 19, Radix UI
- **Styling:** Tailwind CSS 4.0
- **Animations:** Framer Motion
- **State Management:** TanStack Query (React Query)
- **Icons:** Lucide React

### Backend
- **Framework:** Flask
- **ORM:** Flask-SQLAlchemy (PostgreSQL/SQLite)
- **Task Queue:** Celery & Redis
- **Authentication:** Flask-JWT-Extended
- **Email:** Flask-Mail

### AI & Infrastructure
- **LLMs:** Groq (Llama 3.1), OpenAI
- **Search Tool:** Tavily API
- **Auth Service:** Supabase (Social Login)
- **Workflow:** LangChain
- **Environment:** Python Dotenv

---

## 🚀 Key Features

- **🔍 Intelligent Discovery:** Automatically find leads based on custom criteria using AI-driven search.
- **💎 Lead Enrichment:** Gather deep insights (LinkedIn, Company info, Roles) for every lead.
- **✉️ Automated Outreach:** Schedule and send personalized emails directly from the dashboard.
- **📊 Real-time Dashboard:** Monitor your lead pipeline, outreach success, and system health.
- **⚡ Background Processing:** Hand off heavy research and mailing tasks to Celery workers.
- **🔒 Secure Workspace:** JWT-protected authentication & Supabase Social Login (Google).

---

## 📂 Project Structure

```text
smart-lead-agent/
├── backend/                # Flask Backend
│   ├── app/                # Application Core
│   │   ├── routes/         # API Blueprints
│   │   ├── services/       # Business Logic (Storage, AI, Mail)
│   │   ├── agents/         # AI Agent Logic
│   │   └── models.py       # Database Schemas
│   ├── requirements.txt    # Python Dependencies
│   └── run.py              # Backend Entry Point
├── frontend/               # Next.js Frontend
│   ├── app/                # Pages & Layouts
│   ├── components/         # Reusable UI Components
│   ├── lib/                # Utilities & Hooks
│   └── package.json        # Frontend Dependencies
├── .env                    # Environment Variables (Root)
├── start_app.bat           # One-click Start Script
└── README.md               # You are here!
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- Redis Server (for Celery)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/smart-lead-agent.git
cd smart-lead-agent
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Configuration
Create a `.env` file in the root (or copy from the backend template):
```env
# AI Keys
GROQ_API_KEY=your_groq_key
OPENAI_API_KEY=your_openai_key
TAVILY_API_KEY=your_tavily_key

# Email
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password

# Database & Security
SECRET_KEY=your_super_secret_key
DATABASE_URL=sqlite:///app.db
```

---

## ▶️ Running the Application

### Automated (Windows)
Run the provided batch script:
```bash
./start_app.bat
```

### Manual
1. **Start Redis:** `redis-server`
2. **Start Backend:** `cd backend && python run.py`
3. **Start Frontend:** `cd frontend && npm run dev`
4. **Start Celery Worker:** `cd backend && celery -A app.celery worker --loglevel=info`

---

## 📡 API Endpoints

| Category | Endpoint | Method | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `/auth/register` | `POST` | Create a new account |
| **Auth** | `/auth/login` | `POST` | Authenticate and get JWT |
| **Leads** | `/leads/` | `GET` | Fetch all saved leads |
| **Discovery** | `/discovery/` | `POST` | Trigger AI lead search |
| **Email** | `/email/send` | `POST` | Send personalized outreach |

---

## 🎨 Screenshots

### 🔑 Login & Welcome
![Welcome Page](frontend/public/screenshots/welcome.png)

### 📊 Interactive Dashboard
![Dashboard](frontend/public/screenshots/dashboard.png)

### 🔍 Lead Discovery
![Discovery](frontend/public/screenshots/discovery.png)

### 📋 Leads Management
![Leads](frontend/public/screenshots/leads.png)

> [!TIP]
> Use the Dashboard to track your lead conversion in real-time!

---

## 🤝 Contributing
Contributions are welcome! Please follow these steps:
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author
**N SAIASHISH** - [@saiashish13](https://github.com/saiashish13)
Project Link: [https://github.com/saiashish13/smart-lead-agent.git](https://github.com/saiashish13/smart-lead-agent.git)
