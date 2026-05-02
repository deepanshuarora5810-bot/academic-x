# 📚 AcademiX — Student Analytics Dashboard

AcademiX is a full-stack academic analytics platform that provides real-time insights into student performance, risk assessment, and subject-level analytics. Upload a CSV dataset and instantly visualize KPIs, score distributions, at-risk students, and performance clusters.

---

## ✨ Features

- **📊 KPI Dashboard** — Average GPA, at-risk student count, top performing subject, and pass rate at a glance
- **📖 Subject Performance** — Mean, median, and standard deviation for each subject with sparkline trends
- **📈 Score Distribution** — Bar chart visualization of student counts per grade bracket
- **⚠️ At-Risk Detection** — Filterable table of students flagged by GPA and failure-based risk logic
- **🔬 Performance Clustering** — Scatter plot correlating student effort vs academic results by tier
- **👤 Student Directory** — Searchable list of all students with detailed score breakdowns
- **🔍 Student Search** — Search any student from the top bar and view their full profile in a modal
- **🌙 Dark Mode** — Full dark theme toggle from Settings, applied globally across all screens
- **📁 CSV Import** — Upload any compatible CSV to instantly populate the entire dashboard
- **⚙️ Settings** — Account login, notification preferences, and theme configuration

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| **Backend**  | Python, FastAPI, Pandas, NumPy     |
| **Frontend** | React Native (Expo Web), React     |
| **Charts**   | react-native-svg (custom SVG)      |
| **API**      | RESTful (POST /upload)             |

---

## 📂 Project Structure

```
academix/
├── backend/
│   ├── main.py              # FastAPI server with CSV processing & analytics
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── App.jsx              # Root app with dark mode theming
│   ├── DataContext.js        # Global state (data, user, dark mode)
│   ├── components/
│   │   ├── Sidebar.jsx       # Navigation sidebar
│   │   ├── TopBar.jsx        # Search bar, semester picker, CSV import
│   │   ├── KpiCard.jsx       # KPI metric cards
│   │   ├── SubjectCard.jsx   # Subject stats with sparkline
│   │   ├── ScoreDistribution.jsx  # Bar chart component
│   │   ├── AtRiskTable.jsx   # Filterable at-risk students table
│   │   ├── PerformanceCluster.jsx # Scatter plot component
│   │   └── RiskBadge.jsx     # Risk level badge
│   ├── screens/
│   │   ├── DashboardScreen.jsx
│   │   ├── StudentDirectoryScreen.jsx
│   │   ├── SubjectAnalysisScreen.jsx
│   │   ├── RiskReportsScreen.jsx
│   │   ├── TrendLogsScreen.jsx
│   │   └── SettingsScreen.jsx
│   ├── data/
│   │   └── index.js          # Default/zero-state data
│   ├── package.json
│   └── app.json
├── sample_data.csv           # Sample dataset (small)
├── sample_data_large.csv     # Sample dataset (larger)
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.8+**
- **Node.js 18+**
- **npm**

### 1. Clone the Repository

```bash
git clone https://github.com/deepanshuarora5810-bot/academic-x.git
cd academic-x
```

### 2. Start the Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`. Swagger docs at `http://localhost:8000/docs`.

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run web
```

The dashboard will open at `http://localhost:8081`.

### 4. Import Data

Click the **"Import Dataset"** button in the top bar and upload `sample_data.csv` or `sample_data_large.csv` from the project root.

---

## 📋 CSV Format

The CSV should contain the following columns:

| Column              | Type   | Description           |
|---------------------|--------|-----------------------|
| `StudentName`       | String | Name of the student   |
| `Mathematics`       | Number | Score (0–100)         |
| `English`           | Number | Score (0–100)         |
| `Science`           | Number | Score (0–100)         |
| `History`           | Number | Score (0–100)         |
| `Physical Education`| Number | Score (0–100)         |
| `Art`               | Number | Score (0–100)         |

---

## 🌙 Dark Mode

Navigate to **Settings → Preferences → Dark Mode** and toggle the switch. The theme is applied globally across the sidebar, top bar, dashboard, cards, and all screens.

---

## 📝 API Endpoints

| Method | Endpoint   | Description                        |
|--------|------------|------------------------------------|
| POST   | `/upload`  | Upload CSV, returns full analytics |

### Response Schema

```json
{
  "SUBJECTS": [...],
  "AT_RISK_STUDENTS": [...],
  "ALL_STUDENTS": [...],
  "SCORE_DISTRIBUTION": [...],
  "CLUSTER_DATA": [...],
  "KPI_CARDS": [...]
}
```

---

## 👤 Author

**Deepanshu Arora**

---

## 📄 License

This project is for educational purposes.
