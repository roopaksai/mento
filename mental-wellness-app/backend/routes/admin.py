from flask import Blueprint, request, jsonify
from models import User, Assessment
import json

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/admin/students', methods=['GET'])
def get_all_students():
    """Get all students for admin dashboard"""
    try:
        from app import db
        user_model = User(db)
        
        students = user_model.get_all_students()
        
        return jsonify({
            'students': students,
            'total': len(students)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/assessments', methods=['GET'])
def get_all_assessments():
    """Get all student assessments for admin dashboard"""
    try:
        from app import db
        assessment_model = Assessment(db)
        
        # Check for email filter
        email_filter = request.args.get('email')
        
        if email_filter:
            assessments = assessment_model.get_assessments_by_email(email_filter)
        else:
            assessments = assessment_model.get_all_assessments()
        
        # Parse responses JSON for better display
        for assessment in assessments:
            if assessment.get('responses'):
                try:
                    assessment['responses'] = json.loads(assessment['responses'])
                except:
                    pass
        
        return jsonify({
            'assessments': assessments,
            'total': len(assessments),
            'filtered_by': email_filter if email_filter else None
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/create', methods=['POST'])
def create_admin_user():
    """Create a new admin user"""
    try:
        data = request.json
        name = data.get('name')
        email = data.get('email')
        
        if not name or not email:
            return jsonify({'error': 'Name and email are required'}), 400
        
        from app import db
        user_model = User(db)
        
        # Create admin user
        admin_id = user_model.create_admin_user(name, email)
        
        return jsonify({
            'message': 'Admin user created successfully',
            'admin_id': admin_id,
            'name': name,
            'email': email
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/student/<user_id>/assessments', methods=['GET'])
def get_student_assessments(user_id):
    """Get all assessments for a specific student"""
    try:
        from app import db
        assessment_model = Assessment(db)
        user_model = User(db)
        
        # Get student info
        student = user_model.get_user_by_id(user_id)
        if not student:
            return jsonify({'error': 'Student not found'}), 404
        
        # Get assessments
        assessments = assessment_model.get_user_assessments(user_id)
        
        # Parse responses JSON
        for assessment in assessments:
            if assessment.get('responses'):
                try:
                    assessment['responses'] = json.loads(assessment['responses'])
                except:
                    pass
        
        return jsonify({
            'student': student,
            'assessments': assessments,
            'total_assessments': len(assessments)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/analytics', methods=['GET'])
def get_analytics():
    """Get comprehensive analytics data for admin dashboard"""
    try:
        from app import db
        import sqlite3
        from datetime import datetime, timedelta
        from collections import defaultdict
        
        user_model = User(db)
        assessment_model = Assessment(db)
        
        # Get all students and assessments
        students = user_model.get_all_students()
        assessments = assessment_model.get_all_assessments()
        
        # Basic metrics
        total_students = len(students)
        total_assessments = len(assessments)
        
        # Severity distribution
        severity_counts = {'Low': 0, 'Moderate': 0, 'High': 0, 'Severe': 0}
        severity_colors = {
            'Low': '#10B981',      # Green
            'Moderate': '#F59E0B', # Yellow
            'High': '#EF4444',     # Red
            'Severe': '#7C3AED'    # Purple
        }
        
        # Score distribution for histogram
        score_ranges = {
            '0-10': 0, '11-20': 0, '21-30': 0, '31-40': 0, 
            '41-50': 0, '51-60': 0, '61-70': 0, '71+': 0
        }
        
        # Monthly assessment trends (last 6 months)
        monthly_data = defaultdict(int)
        
        # Assessment completion rates
        students_with_assessments = set()
        
        # Process assessments
        total_score = 0
        for assessment in assessments:
            # Severity distribution
            severity = assessment.get('severity_level', 'low').title()
            if severity == 'Moderately-severe':
                severity = 'Severe'
            if severity in severity_counts:
                severity_counts[severity] += 1
            
            # Score distribution
            score = assessment.get('total_score', 0)
            total_score += score
            
            if score <= 10:
                score_ranges['0-10'] += 1
            elif score <= 20:
                score_ranges['11-20'] += 1
            elif score <= 30:
                score_ranges['21-30'] += 1
            elif score <= 40:
                score_ranges['31-40'] += 1
            elif score <= 50:
                score_ranges['41-50'] += 1
            elif score <= 60:
                score_ranges['51-60'] += 1
            elif score <= 70:
                score_ranges['61-70'] += 1
            else:
                score_ranges['71+'] += 1
            
            # Monthly trends
            created_at = assessment.get('created_at', '')
            if created_at:
                try:
                    # Parse date and get month-year
                    date_obj = datetime.strptime(created_at, '%Y-%m-%d %H:%M:%S')
                    month_key = date_obj.strftime('%Y-%m')
                    monthly_data[month_key] += 1
                except:
                    pass
            
            # Track students with assessments
            students_with_assessments.add(assessment.get('user_id'))
        
        # Calculate completion rate
        completion_rate = (len(students_with_assessments) / total_students * 100) if total_students > 0 else 0
        
        # Calculate average score
        average_score = (total_score / len(assessments)) if assessments else 0
        
        # Prepare monthly trend data (last 6 months)
        monthly_labels = []
        monthly_values = []
        current_date = datetime.now()
        
        for i in range(5, -1, -1):  # Last 6 months
            date = current_date - timedelta(days=30*i)
            month_key = date.strftime('%Y-%m')
            month_label = date.strftime('%b %Y')
            monthly_labels.append(month_label)
            monthly_values.append(monthly_data.get(month_key, 0))
        
        # Risk level insights
        high_risk_students = len([a for a in assessments if a.get('severity_level') in ['high', 'moderately-severe']])
        
        # Recent activity (last 7 days)
        week_ago = datetime.now() - timedelta(days=7)
        recent_assessments = 0
        for assessment in assessments:
            try:
                created_at = datetime.strptime(assessment.get('created_at', ''), '%Y-%m-%d %H:%M:%S')
                if created_at >= week_ago:
                    recent_assessments += 1
            except:
                pass
        
        return jsonify({
            # Overview metrics
            'overview': {
                'total_students': total_students,
                'total_assessments': total_assessments,
                'average_score': round(average_score, 2),
                'completion_rate': round(completion_rate, 1),
                'high_risk_students': high_risk_students,
                'recent_assessments': recent_assessments
            },
            
            # Charts data
            'charts': {
                # Pie chart - Severity distribution
                'severity_distribution': {
                    'labels': list(severity_counts.keys()),
                    'data': list(severity_counts.values()),
                    'colors': [severity_colors.get(k, '#6B7280') for k in severity_counts.keys()]
                },
                
                # Bar chart - Score distribution
                'score_distribution': {
                    'labels': list(score_ranges.keys()),
                    'data': list(score_ranges.values())
                },
                
                # Line chart - Monthly trends
                'monthly_trends': {
                    'labels': monthly_labels,
                    'data': monthly_values
                },
                
                # Completion vs Non-completion
                'completion_stats': {
                    'labels': ['Completed Assessment', 'No Assessment'],
                    'data': [len(students_with_assessments), total_students - len(students_with_assessments)],
                    'colors': ['#10B981', '#EF4444']
                }
            },
            
            # Additional insights
            'insights': {
                'most_common_severity': max(severity_counts.items(), key=lambda x: x[1])[0] if assessments else 'None',
                'assessment_participation': f"{completion_rate:.1f}%",
                'average_monthly_assessments': round(sum(monthly_values) / 6, 1),
                'trend': 'increasing' if len(monthly_values) >= 2 and monthly_values[-1] > monthly_values[-2] else 'stable'
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500