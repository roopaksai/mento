import sqlite3
import uuid
from datetime import datetime

class Database:
    def __init__(self, db_path='database.db'):
        self.db_path = db_path
        self.init_database()
    
    def get_connection(self):
        """Get database connection"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row  # Enable dict-like access
        return conn
    
    def init_database(self):
        """Initialize database with required tables"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Assessment responses table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS assessments (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                user_email TEXT NOT NULL,
                responses TEXT NOT NULL,  -- JSON string of responses
                total_score INTEGER,
                severity_level TEXT,
                completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Institutions table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS institutions (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                domain TEXT UNIQUE NOT NULL,  -- email domain like 'university.edu'
                contact_email TEXT,
                is_active BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Counselor session requests table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS counselor_requests (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                assessment_id TEXT,
                severity_level TEXT NOT NULL,
                anonymous_data TEXT,  -- JSON string
                status TEXT DEFAULT 'pending',  -- pending, assigned, completed
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (assessment_id) REFERENCES assessments (id)
            )
        ''')
        
        # Insert sample institutions
        cursor.execute('''
            INSERT OR IGNORE INTO institutions (id, name, domain, contact_email)
            VALUES 
                (?, 'Mental Health University', 'university.edu', 'counseling@university.edu'),
                (?, 'Wellness College', 'college.org', 'support@college.org'),
                (?, 'Care Institute', 'institute.ac.in', 'help@institute.ac.in')
        ''', (str(uuid.uuid4()), str(uuid.uuid4()), str(uuid.uuid4())))
        
        conn.commit()
        conn.close()

# User model
class User:
    def __init__(self, db):
        self.db = db
    
    def create_or_get_user(self, name, email):
        """Create new user or get existing user"""
        conn = self.db.get_connection()
        cursor = conn.cursor()
        
        # Check if user exists
        cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
        user = cursor.fetchone()
        
        if user:
            # Update last login
            cursor.execute(
                'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE email = ?',
                (email,)
            )
            user_id = user['id']
        else:
            # Create new user
            user_id = str(uuid.uuid4())
            cursor.execute(
                'INSERT INTO users (id, name, email) VALUES (?, ?, ?)',
                (user_id, name, email)
            )
        
        conn.commit()
        conn.close()
        return user_id
    
    def get_user_by_id(self, user_id):
        """Get user by ID"""
        conn = self.db.get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
        user = cursor.fetchone()
        conn.close()
        return dict(user) if user else None

# Assessment model
class Assessment:
    def __init__(self, db):
        self.db = db
    
    def save_assessment(self, user_id, user_email, responses):
        """Save assessment responses and calculate score"""
        import json
        
        # Calculate total score
        total_score = sum(answer['answer'] for answer in responses.values())
        
        # Determine severity level
        severity_level = self.calculate_severity(total_score)
        
        conn = self.db.get_connection()
        cursor = conn.cursor()
        
        assessment_id = str(uuid.uuid4())
        cursor.execute('''
            INSERT INTO assessments 
            (id, user_id, user_email, responses, total_score, severity_level)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            assessment_id,
            user_id,
            user_email,
            json.dumps(responses),
            total_score,
            severity_level
        ))
        
        conn.commit()
        conn.close()
        
        return {
            'assessment_id': assessment_id,
            'total_score': total_score,
            'severity_level': severity_level
        }
    
    def calculate_severity(self, total_score):
        """Calculate severity based on total score (0-30 scale)"""
        if total_score <= 9:
            return 'low'
        elif total_score <= 19:
            return 'moderate'
        else:
            return 'high'
    
    def get_user_assessments(self, user_id):
        """Get all assessments for a user"""
        conn = self.db.get_connection()
        cursor = conn.cursor()
        cursor.execute(
            'SELECT * FROM assessments WHERE user_id = ? ORDER BY completed_at DESC',
            (user_id,)
        )
        assessments = cursor.fetchall()
        conn.close()
        return [dict(assessment) for assessment in assessments]

# Institution model
class Institution:
    def __init__(self, db):
        self.db = db
    
    def check_institution_by_email(self, email):
        """Check if email belongs to partner institution"""
        domain = email.split('@')[1] if '@' in email else None
        if not domain:
            return None
        
        conn = self.db.get_connection()
        cursor = conn.cursor()
        cursor.execute(
            'SELECT * FROM institutions WHERE domain = ? AND is_active = 1',
            (domain,)
        )
        institution = cursor.fetchone()
        conn.close()
        return dict(institution) if institution else None

# Counselor request model
class CounselorRequest:
    def __init__(self, db):
        self.db = db
    
    def create_request(self, user_id, assessment_id, severity_level, anonymous_data):
        """Create counselor session request"""
        import json
        
        conn = self.db.get_connection()
        cursor = conn.cursor()
        
        request_id = str(uuid.uuid4())
        cursor.execute('''
            INSERT INTO counselor_requests 
            (id, user_id, assessment_id, severity_level, anonymous_data)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            request_id,
            user_id,
            assessment_id,
            severity_level,
            json.dumps(anonymous_data)
        ))
        
        conn.commit()
        conn.close()
        
        return request_id