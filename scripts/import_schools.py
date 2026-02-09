#!/usr/bin/env python3
"""
School Data Importer
Imports Malaysian school data from Excel file to MySQL database
Usage: python import_schools.py [excel_file_path]
"""

import pandas as pd
import mysql.connector
from mysql.connector import Error
import sys
import os
from datetime import datetime
import uuid

def get_db_connection():
    """Get database connection from environment variables"""
    try:
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            user=os.getenv('DB_USER', 'root'),
            password=os.getenv('DB_PASSWORD', ''),
            database=os.getenv('DB_NAME', 'mantap_work_db')
        )
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        sys.exit(1)

def read_excel_file(file_path):
    """Read and parse the Excel file"""
    print(f"Reading Excel file: {file_path}")
    
    # Read with header in row 3 (index 2)
    df = pd.read_excel(file_path, sheet_name=0, header=2)
    
    # Rename columns
    df.columns = ['NO', 'NEGERI', 'PPD', 'PERINGKAT', 'JENIS', 'KODSEKOLAH', 
                  'NAMASEKOLAH', 'ALAMATSURAT', 'POSKODSURAT', 'BANDARSURAT',
                  'NOTELEFON', 'NOFAX', 'EMAIL', 'LOKASI', 'BANTUAN', 
                  'MURID', 'GURU', 'PRASEKOLAH', 'INTEGRASI', 'KOORDINAT_X', 'KOORDINAT_Y']
    
    # Remove rows where KODSEKOLAH is NaN
    df = df[df['KODSEKOLAH'].notna()].reset_index(drop=True)
    
    print(f"Total schools to import: {len(df)}")
    return df

def import_schools(df, batch_id=None):
    """Import schools into database"""
    if batch_id is None:
        batch_id = f"BATCH_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    
    connection = get_db_connection()
    cursor = connection.cursor()
    
    imported = 0
    updated = 0
    errors = []
    
    print("\nImporting schools...")
    
    for index, row in df.iterrows():
        try:
            # Prepare data
            kod_sekolah = str(row['KODSEKOLAH']).strip()
            nama_sekolah = str(row['NAMASEKOLAH']).strip()
            negeri = str(row['NEGERI']).strip() if pd.notna(row['NEGERI']) else ''
            ppd = str(row['PPD']).strip() if pd.notna(row['PPD']) else ''
            peringkat = str(row['PERINGKAT']).strip() if pd.notna(row['PERINGKAT']) else 'Rendah'
            jenis = str(row['JENIS']).strip() if pd.notna(row['JENIS']) else ''
            
            # Contact info
            alamat = str(row['ALAMATSURAT']).strip() if pd.notna(row['ALAMATSURAT']) else ''
            poskod = str(row['POSKODSURAT']).strip() if pd.notna(row['POSKODSURAT']) else ''
            bandar = str(row['BANDARSURAT']).strip() if pd.notna(row['BANDARSURAT']) else ''
            telefon = str(row['NOTELEFON']).strip() if pd.notna(row['NOTELEFON']) else ''
            faks = str(row['NOFAX']).strip() if pd.notna(row['NOFAX']) else ''
            email = str(row['EMAIL']).strip() if pd.notna(row['EMAIL']) else ''
            
            # Location
            lokasi = str(row['LOKASI']).strip() if pd.notna(row['LOKASI']) else 'Bandar'
            koordinat_x = float(row['KOORDINAT_X']) if pd.notna(row['KOORDINAT_X']) else None
            koordinat_y = float(row['KOORDINAT_Y']) if pd.notna(row['KOORDINAT_Y']) else None
            
            # Stats
            murid = int(row['MURID']) if pd.notna(row['MURID']) else 0
            guru = int(row['GURU']) if pd.notna(row['GURU']) else 0
            prasekolah = str(row['PRASEKOLAH']).strip() if pd.notna(row['PRASEKOLAH']) else 'TIADA'
            integrasi = str(row['INTEGRASI']).strip() if pd.notna(row['INTEGRASI']) else 'TIADA'
            bantuan = str(row['BANTUAN']).strip() if pd.notna(row['BANTUAN']) else ''
            
            # Check if school exists
            cursor.execute("SELECT id FROM schools WHERE kod_sekolah = %s", (kod_sekolah,))
            existing = cursor.fetchone()
            
            if existing:
                # Update existing school
                update_query = """
                    UPDATE schools SET
                        nama_sekolah = %s,
                        negeri = %s,
                        ppd = %s,
                        peringkat = %s,
                        jenis = %s,
                        alamat_surat = %s,
                        poskod = %s,
                        bandar = %s,
                        no_telefon = %s,
                        no_faks = %s,
                        email = %s,
                        lokasi = %s,
                        koordinat_x = %s,
                        koordinat_y = %s,
                        jumlah_murid = %s,
                        jumlah_guru = %s,
                        prasekolah = %s,
                        integrasi = %s,
                        bantuan = %s,
                        import_batch = %s,
                        imported_at = NOW()
                    WHERE kod_sekolah = %s
                """
                cursor.execute(update_query, (
                    nama_sekolah, negeri, ppd, peringkat, jenis,
                    alamat, poskod, bandar, telefon, faks, email,
                    lokasi, koordinat_x, koordinat_y, murid, guru,
                    prasekolah, integrasi, bantuan, batch_id, kod_sekolah
                ))
                updated += 1
            else:
                # Insert new school
                insert_query = """
                    INSERT INTO schools (
                        kod_sekolah, nama_sekolah, negeri, ppd, peringkat, jenis,
                        alamat_surat, poskod, bandar, no_telefon, no_faks, email,
                        lokasi, koordinat_x, koordinat_y, jumlah_murid, jumlah_guru,
                        prasekolah, integrasi, bantuan, import_batch, status_claim
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'UNCLAIMED')
                """
                cursor.execute(insert_query, (
                    kod_sekolah, nama_sekolah, negeri, ppd, peringkat, jenis,
                    alamat, poskod, bandar, telefon, faks, email,
                    lokasi, koordinat_x, koordinat_y, murid, guru,
                    prasekolah, integrasi, bantuan, batch_id
                ))
                imported += 1
            
            # Progress update every 1000 schools
            if (imported + updated) % 1000 == 0:
                print(f"  Progress: {imported + updated} schools processed...")
                connection.commit()
                
        except Exception as e:
            errors.append(f"Row {index + 1} ({kod_sekolah}): {str(e)}")
            print(f"  Error at row {index + 1}: {str(e)}")
    
    # Final commit
    connection.commit()
    
    # Log import
    log_query = """
        INSERT INTO school_import_logs 
        (batch_id, filename, total_records, imported_records, updated_records, failed_records, errors)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    cursor.execute(log_query, (
        batch_id, 
        'Senarai Sekolah Rendah dan Menengah Jun 2022.xlsx',
        len(df),
        imported,
        updated,
        len(errors),
        '\n'.join(errors[:50]) if errors else None  # Limit error log
    ))
    connection.commit()
    
    cursor.close()
    connection.close()
    
    print(f"\n{'='*60}")
    print(f"Import Complete!")
    print(f"{'='*60}")
    print(f"Batch ID: {batch_id}")
    print(f"Total schools: {len(df)}")
    print(f"New imports: {imported}")
    print(f"Updated: {updated}")
    print(f"Failed: {len(errors)}")
    
    if errors:
        print(f"\nFirst 5 errors:")
        for error in errors[:5]:
            print(f"  - {error}")
    
    return batch_id

if __name__ == "__main__":
    # Default file path
    default_path = 'docs/resources/Senarai Sekolah Rendah dan Menengah Jun 2022.xlsx'
    
    # Get file path from command line or use default
    file_path = sys.argv[1] if len(sys.argv) > 1 else default_path
    
    if not os.path.exists(file_path):
        print(f"Error: File not found: {file_path}")
        print(f"Usage: python import_schools.py [path_to_excel_file]")
        sys.exit(1)
    
    # Read and import
    df = read_excel_file(file_path)
    import_schools(df)
