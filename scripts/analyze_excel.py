import pandas as pd
import json
import os

# Read the Excel file - the headers are in row 2
df = pd.read_excel('docs/resources/Senarai Sekolah Rendah dan Menengah Jun 2022.xlsx', 
                   sheet_name=0, 
                   header=2)  # Headers are in row index 2

# Rename columns based on the actual structure
column_mapping = {
    'Unnamed: 0': 'NO',
    'PERAK': 'NEGERI',  # This varies by row, actually
}

# The columns we can identify from the data:
# Based on the output, the columns are:
# NO, NEGERI, PPD, PERINGKAT, JENIS/LABEL, KODSEKOLAH, NAMASEKOLAH, 
# ALAMATSURAT, POSKODSURAT, BANDARSURAT, NOTELEFON, NOFAX, EMAIL, 
# LOKASI, BANTUAN, MURID, GURU, PRASEKOLAH, INTEGRASI, KOORDINATXX, KOORDINATYY

# Rename columns properly
df.columns = ['NO', 'NEGERI', 'PPD', 'PERINGKAT', 'JENIS', 'KODSEKOLAH', 
              'NAMASEKOLAH', 'ALAMATSURAT', 'POSKODSURAT', 'BANDARSURAT',
              'NOTELEFON', 'NOFAX', 'EMAIL', 'LOKASI', 'BANTUAN', 
              'MURID', 'GURU', 'PRASEKOLAH', 'INTEGRASI', 'KOORDINAT_X', 'KOORDINAT_Y']

# Remove rows where KODSEKOLAH is NaN
df = df[df['KODSEKOLAH'].notna()]

print(f"Total schools: {len(df)}")
print("\n" + "="*80 + "\n")

# Show unique states
print("States (NEGERI):")
states = df['NEGERI'].dropna().unique()
print(f"Total: {len(states)}")
print(f"Sample: {list(states[:10])}")
print("\n" + "="*80 + "\n")

# Show unique education levels
print("Education Levels (PERINGKAT):")
levels = df['PERINGKAT'].dropna().unique()
print(list(levels))
print("\n" + "="*80 + "\n")

# Show unique school types
print("School Types (JENIS):")
types = df['JENIS'].dropna().unique()
print(list(types))
print("\n" + "="*80 + "\n")

# Sample data
print("Sample schools:")
print(df[['KODSEKOLAH', 'NAMASEKOLAH', 'NEGERI', 'PERINGKAT', 'JENIS']].head(10).to_string())

# Save analysis
os.makedirs('docs/school-directory', exist_ok=True)

analysis = {
    "total_schools": int(len(df)),
    "states": list(states),
    "education_levels": list(levels),
    "school_types": list(types),
    "columns": df.columns.tolist(),
    "sample_schools": df.head(5).fillna('').astype(str).to_dict('records')
}

with open('docs/school-directory/data_analysis.json', 'w', encoding='utf-8') as f:
    json.dump(analysis, f, indent=2, ensure_ascii=False)

# Save full dataset as CSV for reference
df.to_csv('docs/school-directory/all_schools.csv', index=False, encoding='utf-8')

print("\n[SAVED] Analysis saved to docs/school-directory/data_analysis.json")
print("[SAVED] Full data saved to docs/school-directory/all_schools.csv")
