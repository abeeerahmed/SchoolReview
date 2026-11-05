import os, sqlite3

DB_PATH = os.environ.get("DB_PATH", os.path.join(os.path.dirname(__file__), "schoolreview.db"))

def get_conn():
    if not os.path.exists(DB_PATH):
        # Create empty DB with schema
        conn = sqlite3.connect(DB_PATH, timeout=30)
        conn.row_factory = sqlite3.Row
        conn.execute('''CREATE TABLE IF NOT EXISTS all_institutes_clean (
            id INTEGER, eiin_or_code TEXT, institute_name TEXT, institute_name_local TEXT,
            id_type TEXT, level TEXT, division TEXT, district TEXT, upazila TEXT,
            union_name TEXT, institute_type TEXT, management TEXT, email TEXT,
            is_mpo TEXT, total_teacher INTEGER, total_student INTEGER,
            education_level TEXT, area_status TEXT, source TEXT, teacher_count INTEGER DEFAULT 0,
            mobile TEXT, geo_status TEXT, mauza_name TEXT, address TEXT, post TEXT,
            student_type TEXT, affiliation TEXT, thana TEXT, image_url TEXT,
            website TEXT, description TEXT, established_year INTEGER
        )''')
        conn.execute('''CREATE TABLE IF NOT EXISTS teachers (
            eiin TEXT, teacher_name TEXT, designation TEXT, date_of_birth TEXT,
            first_joining_date TEXT, institute_name TEXT, district TEXT
        )''')
        conn.execute('''CREATE TABLE IF NOT EXISTS primary_schools (
            school_code TEXT, school_name TEXT, division TEXT, district TEXT,
            total_teacher INTEGER, total_student INTEGER
        )''')
        conn.execute('''CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL,
            name TEXT, avatar TEXT, google_id TEXT UNIQUE, facebook_id TEXT UNIQUE,
            role TEXT DEFAULT 'user', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )''')
        conn.execute('''CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT, institute_id TEXT NOT NULL,
            user_id INTEGER NOT NULL, rating_overall REAL NOT NULL,
            rating_teaching REAL, rating_facilities REAL, rating_treatment REAL,
            rating_environment REAL, rating_value REAL, title TEXT, body TEXT NOT NULL,
            is_anonymous INTEGER DEFAULT 0, is_verified INTEGER DEFAULT 0,
            helpful_count INTEGER DEFAULT 0, not_helpful_count INTEGER DEFAULT 0,
            status TEXT DEFAULT 'approved', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )''')
        conn.execute('''CREATE TABLE IF NOT EXISTS review_votes (
            id INTEGER PRIMARY KEY AUTOINCREMENT, review_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL, vote INTEGER NOT NULL, UNIQUE(review_id, user_id)
        )''')
        conn.execute('''CREATE TABLE IF NOT EXISTS school_likes (
            id INTEGER PRIMARY KEY AUTOINCREMENT, institute_id TEXT NOT NULL,
            user_id INTEGER NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(institute_id, user_id)
        )''')
        conn.commit()
        return conn
    conn = sqlite3.connect(DB_PATH, timeout=30)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA cache_size=-65536")
    conn.execute("PRAGMA synchronous=NORMAL")
    conn.execute("PRAGMA temp_store=MEMORY")
    return conn

def dict_row(row):
    return {k: row[k] for k in row.keys()} if row else None