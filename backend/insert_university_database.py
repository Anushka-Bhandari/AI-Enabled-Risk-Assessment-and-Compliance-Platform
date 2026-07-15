import pandas as pd
import mysql.connector

df = pd.read_csv("universities_cleaned.csv")

conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="@kunalBH31%8==7Pras19%10==9",
    database="risk_platform"
)

cursor = conn.cursor()

for _, row in df.iterrows():
    cursor.execute(
        "INSERT INTO university (university_name) VALUES (%s)",
        (row["university_name"],)
    )

conn.commit()
cursor.close()
conn.close()

print("Universities imported successfully!")