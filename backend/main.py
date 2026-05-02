from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))
    
    # Expected CSV columns: StudentName, Mathematics, English, Science, History, Physical Education, Art
    
    subjects = ["Mathematics", "English", "Science", "History", "Physical Education", "Art"]
    
    subject_stats = []
    for i, subj in enumerate(subjects):
        if subj in df.columns:
            mean = np.round(df[subj].mean(), 1)
            median = np.round(df[subj].median(), 1)
            std = np.round(df[subj].std(), 1)
            if pd.isna(std): std = 0
            subject_stats.append({
                "id": i+1,
                "name": subj,
                "mean": float(mean),
                "median": float(median),
                "stdDev": float(std)
            })
    
    # Calculate GPA proxy if not present
    if "GPA" not in df.columns:
        # Assuming scores are out of 100, simple proxy
        df["GPA"] = (df[subjects].mean(axis=1) / 100) * 4.0

    # At Risk Students will be calculated below alongside All Students
        
    # Score distribution of the overall average
    if "Average" not in df.columns:
        df["Average"] = df[subjects].mean(axis=1)
        
    dist_counts = {
        '0–20': int(((df["Average"] >= 0) & (df["Average"] <= 20)).sum()),
        '21–40': int(((df["Average"] > 20) & (df["Average"] <= 40)).sum()),
        '41–60': int(((df["Average"] > 40) & (df["Average"] <= 60)).sum()),
        '61–80': int(((df["Average"] > 60) & (df["Average"] <= 80)).sum()),
        '81–100': int(((df["Average"] > 80) & (df["Average"] <= 100)).sum())
    }
    
    score_distribution = [
        { "range": '0–20',   "count": dist_counts['0–20'],  "color": '#f09595' },
        { "range": '21–40',  "count": dist_counts['21–40'], "color": '#888780' },
        { "range": '41–60',  "count": dist_counts['41–60'], "color": '#1a1a2e' },
        { "range": '61–80',  "count": dist_counts['61–80'], "color": '#1a1a2e' },
        { "range": '81–100', "count": dist_counts['81–100'],"color": '#e07b3a' },
    ]
    
    # Cluster Data (Mathematics vs English)
    cluster_data = []
    if "Mathematics" in df.columns and "English" in df.columns:
        for idx, row in df.head(50).iterrows():
            avg = (row["Mathematics"] + row["English"]) / 2
            tier = "Excellent" if avg >= 85 else "Good" if avg >= 75 else "Fair" if avg >= 60 else "AtRisk"
            cluster_data.append({
                "x": float(row["Mathematics"]),
                "y": float(row["English"]),
                "tier": tier
            })
            
    # All Students and At Risk Calculation
    all_students = []
    at_risk = []
    for i, row in df.iterrows():
        scores = {s: float(row[s]) for s in subjects if s in df.columns and not pd.isna(row[s])}
        failures = sum(1 for score in scores.values() if score < 50)
        gpa = float(np.round(row["GPA"], 2))
        
        # Enhanced Risk Logic
        if gpa < 2.5 or failures >= 2:
            risk_level = "High"
        elif gpa < 3.0 or failures == 1:
            risk_level = "Medium"
        else:
            risk_level = "Low"
            
        student_data = {
            "id": i+1,
            "name": row.get("StudentName", f"Student {i+1}"),
            "gpa": gpa,
            "risk": risk_level,
            "scores": scores
        }
        all_students.append(student_data)
        
        if risk_level in ["High", "Medium"]:
            at_risk_item = student_data.copy()
            at_risk_item["lastAlert"] = "Today" if risk_level == "High" else "2 days ago"
            at_risk.append(at_risk_item)
            
    # Sort at_risk by GPA (lowest first)
    at_risk = sorted(at_risk, key=lambda x: x["gpa"])

    # KPIs
    avg_gpa = np.round(df["GPA"].mean(), 2)
    at_risk_count = len(at_risk)
    
    subj_means = {s: df[s].mean() for s in subjects if s in df.columns}
    top_subject = max(subj_means, key=subj_means.get) if subj_means else "N/A"
    top_subject_val = np.round(subj_means[top_subject], 1) if top_subject != "N/A" else 0
    
    pass_rate = np.round((df["Average"] >= 50).mean() * 100, 1)
    
    kpi_cards = [
        {
            "id": 'gpa',
            "label": 'Average GPA',
            "value": f"{avg_gpa}",
            "unit": '/ 4.0',
            "change": '0%',
            "changeUp": True,
            "iconBg": '#e8eeff',
            "iconColor": '#3b5bdb',
        },
        {
            "id": 'atrisk',
            "label": 'At-Risk Students',
            "value": f"{at_risk_count}",
            "unit": 'students',
            "change": '0%',
            "changeUp": False,
            "iconBg": '#fce8e8',
            "iconColor": '#a32d2d',
        },
        {
            "id": 'topsubject',
            "label": 'Top Performing Subject',
            "value": top_subject,
            "unit": f"{top_subject_val}%",
            "change": '0%',
            "changeUp": True,
            "iconBg": '#faeeda',
            "iconColor": '#633806',
        },
        {
            "id": 'passrate',
            "label": 'Pass Rate',
            "value": f"{pass_rate}",
            "unit": '%',
            "change": '0%',
            "changeUp": True,
            "iconBg": '#eaf3de',
            "iconColor": '#27500a',
        }
    ]

    return {
        "SUBJECTS": subject_stats,
        "AT_RISK_STUDENTS": at_risk,
        "ALL_STUDENTS": all_students,
        "SCORE_DISTRIBUTION": score_distribution,
        "CLUSTER_DATA": cluster_data,
        "KPI_CARDS": kpi_cards
    }
