"""
backend/seed/seed_exams.py
Run: python seed_exams.py
Requires: pip install pymongo
"""
from pymongo import MongoClient
from datetime import datetime

client = MongoClient("mongodb://localhost:27017/")
db = client["ExamPrep360"]

def ts():
    return datetime.utcnow()

EXAMS = [

# ─────────────────────────────────────────
# ENGINEERING
# ─────────────────────────────────────────
{
    "name": "JEE Main",
    "slug": "jee-main",
    "category": "Engineering",
    "conducting_body": "National Testing Agency (NTA)",
    "official_website": "https://jeemain.nta.nic.in",
    "exam_mode": "Computer Based Test (CBT)",
    "exam_level": "National",
    "tabs": {
        "overview": (
            "• Conducted By: National Testing Agency (NTA)\n"
            "• Purpose: Gateway to NITs, IIITs, CFTIs and qualifying exam for JEE Advanced (IITs)\n"
            "• Frequency: Twice a year — January and April sessions\n"
            "• Exam Level: National\n\n"
            "JEE Main is India's premier undergraduate engineering entrance exam. "
            "Over 10 lakh students appear annually, competing for seats in 31 NITs, 26 IIITs, and 28 CFTIs across India.\n\n"
            "• Subjects Tested: Physics, Chemistry, Mathematics (Class 11 & 12 level)\n"
            "• Normalisation: NTA uses percentile-based normalisation across sessions\n"
            "• Attempts: Maximum 6 attempts (2 per year for 3 consecutive years)\n"
            "• Best Score: Best of January and April scores is considered for final merit"
        ),
        "application": (
            "• Mode: Online only at jeemain.nta.nic.in\n\n"
            "Step-by-Step Process:\n"
            "1. Visit jeemain.nta.nic.in and click 'New Registration'\n"
            "2. Register with valid email ID and mobile number\n"
            "3. Fill personal details: name, DOB, gender, nationality, category\n"
            "4. Fill academic details: Class 12 marks, board name, passing year\n"
            "5. Upload photograph (10–200 KB, JPG) and signature (4–30 KB, JPG)\n"
            "6. Choose up to 4 preferred exam cities\n"
            "7. Pay application fee via net banking, credit/debit card, or UPI\n"
            "8. Download and save the confirmation page\n\n"
            "• Fee: General/OBC ₹1000 | SC/ST/PwD/Girls ₹500 (Paper 1)\n"
            "• Helpdesk: 011-40759000 | jeemain@nta.ac.in"
        ),
        "eligibility": (
            "• Age Limit: No upper age limit (as per latest NTA guidelines)\n\n"
            "Educational Qualification:\n"
            "• Passed Class 12 or equivalent with Physics, Chemistry, and Mathematics\n"
            "• Appearing candidates in the current year are also eligible\n"
            "• Minimum 75% in Class 12 (65% for SC/ST) for NIT/IIIT admission\n\n"
            "• Attempts: Maximum 6 (2 per year for 3 consecutive years)\n"
            "• Year of Passing: Class 12 in last two years or current year\n"
            "• Nationality: Indian nationals and OCI/PIO candidates"
        ),
        "exam_pattern": {
            "description": "JEE Main Paper 1 (B.E./B.Tech) — Computer Based Test",
            "sections": [
                {"subject": "Physics", "questions": 30, "marks": 100, "type": "MCQ + Numerical"},
                {"subject": "Chemistry", "questions": 30, "marks": 100, "type": "MCQ + Numerical"},
                {"subject": "Mathematics", "questions": 30, "marks": 100, "type": "MCQ + Numerical"},
            ],
            "total_marks": 300,
            "duration": "3 Hours",
            "marking_scheme": "+4 for correct MCQ, -1 for wrong MCQ, +4 for correct Numerical (no negative for numerical)",
        },
        "syllabus": {
            "pdf_link": "https://jeemain.nta.nic.in/webinfo/syllabus.pdf",
            "subjects": [
                {"name": "Physics", "topics": ["Kinematics", "Laws of Motion", "Work, Energy and Power", "Rotational Motion", "Gravitation", "Properties of Solids & Liquids", "Thermodynamics", "Oscillations and Waves", "Electrostatics", "Current Electricity", "Magnetic Effects of Current", "Electromagnetic Induction", "Optics", "Dual Nature of Matter", "Atoms and Nuclei", "Electronic Devices"]},
                {"name": "Chemistry", "topics": ["Some Basic Concepts of Chemistry", "States of Matter", "Atomic Structure", "Chemical Bonding", "Thermodynamics", "Equilibrium", "Redox Reactions", "Electrochemistry", "Chemical Kinetics", "Surface Chemistry", "Organic Chemistry Basics", "Hydrocarbons", "Polymers", "Biomolecules", "Chemistry in Everyday Life"]},
                {"name": "Mathematics", "topics": ["Sets, Relations & Functions", "Complex Numbers", "Matrices & Determinants", "Permutations & Combinations", "Sequences & Series", "Differential Calculus", "Integral Calculus", "Differential Equations", "Coordinate Geometry", "Three Dimensional Geometry", "Vector Algebra", "Statistics & Probability", "Trigonometry", "Mathematical Reasoning", "Binomial Theorem"]},
            ],
        },
        "preparation_tips": [
            "Start with NCERT books — they form the base of 40–50% questions in JEE Main.",
            "Create a realistic timetable allocating more time to your weaker subjects.",
            "Practice previous 10 years' question papers to understand question patterns.",
            "Attempt at least 2 full mock tests per week and thoroughly analyse mistakes.",
            "Focus on high-weightage chapters: Calculus (Maths), Mechanics (Physics), Organic Chemistry.",
            "Use revision notes and formula sheets for quick revision in the last 30 days.",
            "Avoid studying new topics in the last two weeks — focus on consolidation.",
            "Maintain your health: adequate sleep, nutrition, and short breaks are essential.",
        ],
        "important_dates": [
            {"event": "Application Form Release (Session 1)", "date": "October 2024"},
            {"event": "Last Date to Apply (Session 1)", "date": "November 2024"},
            {"event": "Admit Card (Session 1)", "date": "December 2024"},
            {"event": "Exam Date (Session 1)", "date": "January 2025"},
            {"event": "Result (Session 1)", "date": "February 2025"},
            {"event": "Application Form Release (Session 2)", "date": "February 2025"},
            {"event": "Exam Date (Session 2)", "date": "April 2025"},
            {"event": "Final Result & Merit List", "date": "April 2025"},
        ],
        "pyqs": {
            "availability": "Previous year papers from 2014 to 2024 are freely available on the NTA official website and platforms like Allen, Resonance, and Embibe.",
            "difficulty_trend": "Difficulty has increased steadily from 2019 onwards. Mathematics section is consistently the toughest. 2021 onwards saw more numerical-type questions.",
            "recommended_sources": [
                "NTA Official Website (jeemain.nta.nic.in)",
                "Embibe — Free PYQ Practice with Analysis",
                "Allen JEE PYQ Booklet",
                "Arihant 40 Years Chapterwise PYQs",
                "FIITJEE Question Bank",
            ],
        },
        "mock_tests": {
            "importance": "Mock tests are essential for JEE Main success. They build exam temperament, improve time management, and help identify weak areas before the actual exam.",
            "recommended_platforms": [
                "NTA Official Mock Tests — jeemain.nta.nic.in/nta/WebInfo/Public/Home/frmHome.aspx",
                "Embibe — AI-powered adaptive mocks",
                "Allen Online Test Series",
                "Resonance e-Study",
                "Physics Wallah Mocks",
            ],
            "recommended_count": "Attempt minimum 25–30 full-length mocks before the exam. Start 3 months before the exam date.",
        },
    },
    "created_at": ts(), "updated_at": ts(),
},

{
    "name": "JEE Advanced",
    "slug": "jee-advanced",
    "category": "Engineering",
    "conducting_body": "IIT (rotates annually)",
    "official_website": "https://jeeadv.ac.in",
    "exam_mode": "Computer Based Test (CBT)",
    "exam_level": "National",
    "tabs": {
        "overview": (
            "• Conducted By: IITs (on rotation basis)\n"
            "• Purpose: Sole gateway for admission to 23 IITs across India\n"
            "• Frequency: Once a year\n"
            "• Exam Level: National\n\n"
            "JEE Advanced is widely regarded as one of the toughest undergraduate entrance exams in the world. "
            "Only top 2.5 lakh JEE Main qualifiers are eligible.\n\n"
            "• Papers: Two compulsory papers (Paper 1 & Paper 2), each 3 hours\n"
            "• Subjects: Physics, Chemistry, Mathematics\n"
            "• Question Types: MCQ (single/multi correct), Numerical, Matching\n"
            "• Seats: ~16,000 across all IITs\n"
            "• Additional: B.Arch candidates must also clear AAT (Architecture Aptitude Test)"
        ),
        "application": (
            "• Mode: Online only at jeeadv.ac.in\n\n"
            "Step-by-Step Process:\n"
            "1. Qualify JEE Main with rank within top 2.5 lakh\n"
            "2. Register at jeeadv.ac.in using JEE Main roll number and DOB\n"
            "3. Fill personal, academic, and contact details\n"
            "4. Upload photograph, signature, and Class 10/12 mark sheets\n"
            "5. Pay registration fee and choose exam centre preference\n"
            "6. Print the registration confirmation slip\n\n"
            "• Fee: Female candidates (all categories) ₹1400 | SC/ST/PwD ₹1400 | All others ₹2800\n"
            "• Foreign nationals: USD 75"
        ),
        "eligibility": (
            "• JEE Main Performance: Must be in top 2.5 lakh (all categories combined)\n"
            "• Age Limit: Born on or after October 1, 2000 (5-year relaxation for SC/ST/PwD)\n"
            "• Attempts: Maximum 2 in consecutive years\n"
            "• Prior IIT Admission: Must not have accepted admission at any IIT previously\n"
            "• Class 12: Must have first appeared in Class 12 in the JEE Advanced year or preceding year\n"
            "• Minimum 75% aggregate in Class 12 (65% for SC/ST/PwD)"
        ),
        "exam_pattern": {
            "description": "Two compulsory papers — Paper 1 and Paper 2, each 3 hours",
            "sections": [
                {"subject": "Physics", "questions": "18–20 per paper", "marks": "~60 per paper", "type": "MCQ (single/multi), Numerical, Matching"},
                {"subject": "Chemistry", "questions": "18–20 per paper", "marks": "~60 per paper", "type": "MCQ (single/multi), Numerical, Matching"},
                {"subject": "Mathematics", "questions": "18–20 per paper", "marks": "~60 per paper", "type": "MCQ (single/multi), Numerical, Matching"},
            ],
            "total_marks": "~360 (combined both papers)",
            "duration": "3 Hours per paper",
            "marking_scheme": "Varies by section — partial marking for multi-correct MCQs, no negative for numerical answers",
        },
        "syllabus": {
            "pdf_link": "https://jeeadv.ac.in/syllabi.html",
            "subjects": [
                {"name": "Physics", "topics": ["General Physics & Measurement", "Kinematics", "Laws of Motion", "Work and Energy", "Rotational Dynamics", "Simple Harmonic Motion", "Gravitation", "Fluid Mechanics", "Thermal Physics", "Electrostatics", "Capacitors", "Current Electricity", "Magnetic Fields", "Electromagnetic Induction", "Optics & Wave Optics", "Modern Physics"]},
                {"name": "Chemistry", "topics": ["Atomic Structure", "Chemical Bonding & Molecular Structure", "Energetics (Thermodynamics)", "Chemical Equilibrium", "Electrochemistry", "Chemical Kinetics", "Solid State", "Solutions", "Surface Chemistry", "Isolation of Elements", "p-Block Elements", "d-Block Elements", "Coordination Compounds", "Organic Chemistry – General Principles", "Hydrocarbons & Substitution Reactions", "Biomolecules & Polymers"]},
                {"name": "Mathematics", "topics": ["Algebra – Complex Numbers", "Quadratic Equations", "Sequences & Series", "Matrices & Determinants", "Probability", "Trigonometry", "Coordinate Geometry – Straight Lines", "Circles & Conics", "3D Geometry & Vectors", "Differential Calculus – Limits", "Continuity & Differentiability", "Applications of Derivatives", "Integral Calculus", "Differential Equations", "Mathematical Induction"]},
            ],
        },
        "preparation_tips": [
            "Deeply understand every concept — JEE Advanced rewards thinking, not memorisation.",
            "Solve problems from HC Verma (Physics), J.D. Lee (Chemistry), and Arihant (Maths).",
            "Practice multi-correct MCQs heavily — these carry partial marking and are tricky.",
            "Attempt previous 15 years' JEE Advanced papers under strict time conditions.",
            "Form a study group or study with peers to discuss difficult problems.",
            "Do not neglect Paper 2 — it is equally important in determining your All India Rank.",
            "Focus on problem-solving speed in the last 2 months with timed sectional tests.",
            "Revise physical chemistry formulae and organic reaction mechanisms regularly.",
        ],
        "important_dates": [
            {"event": "JEE Main Result (Eligibility basis)", "date": "February 2025"},
            {"event": "JEE Advanced Registration Opens", "date": "Late April 2025"},
            {"event": "Last Date to Register", "date": "May 2025"},
            {"event": "Admit Card Download", "date": "Late May 2025"},
            {"event": "JEE Advanced Exam (Paper 1 & 2)", "date": "1st Sunday of June 2025"},
            {"event": "Answer Key Release", "date": "June 2025"},
            {"event": "Result Declaration", "date": "Mid June 2025"},
            {"event": "Seat Allotment (JoSAA Counselling)", "date": "June–July 2025"},
        ],
        "pyqs": {
            "availability": "PYQs from 2006 to 2024 are available on jeeadv.ac.in and coaching institute portals like Resonance, FIITJEE, and Allen.",
            "difficulty_trend": "One of the world's toughest entrance exams. Difficulty remains consistently high. Multi-correct MCQs and integer-type questions are the most challenging.",
            "recommended_sources": [
                "Official JEE Advanced Archive — jeeadv.ac.in",
                "Arihant 42 Years Chapterwise PYQs",
                "FIITJEE Grand Masters Package",
                "Resonance DPPs (Daily Practice Problems)",
                "Allen JEE Advanced PYQ Booklets",
            ],
        },
        "mock_tests": {
            "importance": "Mock tests for JEE Advanced must simulate the exact paper format including multi-correct MCQs and integer types. They are critical for building accuracy under pressure.",
            "recommended_platforms": [
                "JEE Advanced Official Mock — jeeadv.ac.in",
                "Allen Test Series",
                "FIITJEE AITS (All India Test Series)",
                "Resonance TPTS",
                "Embibe JEE Advanced Mocks",
            ],
            "recommended_count": "Minimum 20 full-length mocks. Analyse each mock for at least 2 hours after attempting.",
        },
    },
    "created_at": ts(), "updated_at": ts(),
},

{
    "name": "BITSAT",
    "slug": "bitsat",
    "category": "Engineering",
    "conducting_body": "BITS Pilani",
    "official_website": "https://www.bitsadmission.com",
    "exam_mode": "Computer Based Test (CBT)",
    "exam_level": "University Level",
    "tabs": {
        "overview": (
            "• Conducted By: Birla Institute of Technology and Science (BITS), Pilani\n"
            "• Purpose: Admissions to B.E./B.Pharm programs at BITS Pilani, Goa, and Hyderabad campuses\n"
            "• Frequency: Once a year (May–June window)\n"
            "• Exam Level: University Level\n\n"
            "BITSAT is a unique online entrance test with a bonus question feature — students who finish 130 questions before time get 12 extra questions.\n\n"
            "• Subjects: Physics, Chemistry, Mathematics/Biology, English Proficiency, Logical Reasoning\n"
            "• Campuses: Pilani, Goa, Hyderabad\n"
            "• Seats: ~2,200 across all three campuses\n"
            "• Known For: Industry connections, liberal grading, strong CS and ECE programs"
        ),
        "application": (
            "• Mode: Online at bitsadmission.com\n\n"
            "Step-by-Step Process:\n"
            "1. Register at bitsadmission.com during the application window\n"
            "2. Fill personal and academic details\n"
            "3. Upload photograph and signature as per specifications\n"
            "4. Select preferred test dates and centres\n"
            "5. Pay application fee\n"
            "6. Download admit card before the exam date\n"
            "7. Report to the centre 30 minutes before scheduled time\n\n"
            "• Fee: Male ₹3400 | Female ₹2900"
        ),
        "eligibility": (
            "• Class 12 Performance: Minimum 75% aggregate in PCM\n"
            "• Subject Requirement: Physics, Chemistry, and Mathematics (for B.E.) or Biology (for B.Pharm)\n"
            "• Minimum 60% in each of Physics, Chemistry, and Mathematics\n"
            "• Age Limit: No specified upper age limit\n"
            "• Appearing students in Class 12 in the same year are eligible"
        ),
        "exam_pattern": {
            "description": "Online CBT — 130 questions in 3 hours with bonus question option",
            "sections": [
                {"subject": "Physics", "questions": 40, "marks": 120, "type": "MCQ"},
                {"subject": "Chemistry", "questions": 40, "marks": 120, "type": "MCQ"},
                {"subject": "Mathematics/Biology", "questions": 45, "marks": 135, "type": "MCQ"},
                {"subject": "English Proficiency", "questions": 15, "marks": 45, "type": "MCQ"},
                {"subject": "Logical Reasoning", "questions": 10, "marks": 30, "type": "MCQ"},
            ],
            "total_marks": 450,
            "duration": "3 Hours",
            "marking_scheme": "+3 for correct, -1 for incorrect",
        },
        "syllabus": {
            "pdf_link": "https://www.bitsadmission.com/syllabus.aspx",
            "subjects": [
                {"name": "Physics", "topics": ["Mechanics", "Thermodynamics", "Electrostatics", "Current Electricity", "Magnetism", "Electromagnetic Induction", "Optics", "Modern Physics", "Electronic Devices", "Electromagnetic Waves"]},
                {"name": "Chemistry", "topics": ["Atomic Structure", "Chemical Bonding", "Thermodynamics", "Chemical Equilibrium", "Electrochemistry", "Organic Chemistry Basics", "Hydrocarbons", "Polymers", "Biomolecules", "d-Block Elements"]},
                {"name": "Mathematics", "topics": ["Algebra", "Trigonometry", "Coordinate Geometry", "Calculus", "Vectors", "Probability", "Matrices", "Differential Equations", "Statistics", "Mathematical Reasoning"]},
                {"name": "English Proficiency", "topics": ["Grammar", "Vocabulary", "Reading Comprehension", "Verbal Reasoning", "Sentence Completion"]},
                {"name": "Logical Reasoning", "topics": ["Verbal Reasoning", "Non-Verbal Reasoning", "Data Interpretation", "Analytical Reasoning", "Puzzle Solving"]},
            ],
        },
        "preparation_tips": [
            "Master the English Proficiency and Logical Reasoning sections — they are easy scoring areas.",
            "Maintain speed: BITSAT requires completing 130 questions in 3 hours.",
            "Practice online mock tests on the BITS portal for familiarity with the interface.",
            "The bonus 12 questions can change your rank drastically — aim to finish before time.",
            "NCERT + standard coaching material is sufficient for Physics and Chemistry.",
            "For Mathematics, focus on speed-based problem-solving and shortcuts.",
            "Attempt chapter-wise tests before moving to full-length mocks.",
            "Review your mistakes after each mock and maintain an error log.",
        ],
        "important_dates": [
            {"event": "Application Opens", "date": "January 2025"},
            {"event": "Last Date to Apply", "date": "March 2025"},
            {"event": "Test Centre Slot Booking", "date": "April 2025"},
            {"event": "Admit Card Download", "date": "May 2025"},
            {"event": "BITSAT Exam Window", "date": "May–June 2025"},
            {"event": "Iteration 1 Result", "date": "June 2025"},
            {"event": "Final Admission Offers", "date": "July 2025"},
        ],
        "pyqs": {
            "availability": "BITSAT does not officially release previous year papers. However, memory-based papers from 2010–2024 are available on coaching platforms.",
            "difficulty_trend": "Moderate difficulty. English and Logical Reasoning are consistently easy. Physics and Maths are moderately tough. Speed is the key differentiator.",
            "recommended_sources": [
                "Arihant BITSAT Previous Year Papers",
                "BITS Pilani Official Practice Tests",
                "Career Point BITSAT Question Bank",
                "Disha Publication BITSAT Mock Papers",
            ],
        },
        "mock_tests": {
            "importance": "Speed is everything in BITSAT. Mock tests train you to complete 130 questions within 3 hours and still attempt bonus questions.",
            "recommended_platforms": [
                "BITS Official Practice Platform — bitsadmission.com",
                "Career Point Online Test Series",
                "Embibe BITSAT Mocks",
                "Allen BITSAT Test Series",
            ],
            "recommended_count": "Attempt 20–25 full-length mocks. Focus on completing the paper in under 150 minutes to qualify for bonus questions.",
        },
    },
    "created_at": ts(), "updated_at": ts(),
},

{
    "name": "VITEEE",
    "slug": "viteee",
    "category": "Engineering",
    "conducting_body": "VIT University",
    "official_website": "https://viteee.vit.ac.in",
    "exam_mode": "Computer Based Test (CBT)",
    "exam_level": "University Level",
    "tabs": {
        "overview": (
            "• Conducted By: VIT University (Vellore Institute of Technology)\n"
            "• Purpose: Admissions to B.Tech programs at VIT Vellore, Chennai, Bhopal, and AP\n"
            "• Frequency: Once a year (April window)\n"
            "• Exam Level: University Level\n\n"
            "VITEEE attracts over 2 lakh applicants annually. VIT is ranked among India's top 10 private engineering universities.\n\n"
            "• Subjects: Physics, Chemistry, Mathematics/Biology, English, Aptitude\n"
            "• Total Seats: 5,000+ across all campuses\n"
            "• No Negative Marking — attempt all questions\n"
            "• Slot-based online test conducted over multiple days"
        ),
        "application": (
            "• Mode: Online at viteee.vit.ac.in\n\n"
            "Step-by-Step Process:\n"
            "1. Visit viteee.vit.ac.in and fill the online application form\n"
            "2. Upload photograph, signature, and qualifying exam mark sheet\n"
            "3. Pay application fee: ₹1350 (online) or ₹1250 (post)\n"
            "4. Book exam slot from available dates and cities\n"
            "5. Download admit card one week before the exam\n"
            "6. Report to centre with admit card and valid photo ID"
        ),
        "eligibility": (
            "• Educational Qualification: Passed or appearing in Class 12 with Physics, Chemistry, and Mathematics/Biology\n"
            "• Minimum Marks: 60% aggregate in PCM/PCB\n"
            "• SC/ST Candidates: 50% aggregate\n"
            "• Age Limit: Born on or after 1 July 2002 (for 2025 admissions)\n"
            "• NRI/PIO/OCI: May apply under special quota"
        ),
        "exam_pattern": {
            "description": "Online CBT — 125 questions in 2 hours 30 minutes",
            "sections": [
                {"subject": "Physics", "questions": 35, "marks": 35, "type": "MCQ"},
                {"subject": "Chemistry", "questions": 35, "marks": 35, "type": "MCQ"},
                {"subject": "Mathematics/Biology", "questions": 40, "marks": 40, "type": "MCQ"},
                {"subject": "English", "questions": 5, "marks": 5, "type": "MCQ"},
                {"subject": "Aptitude", "questions": 10, "marks": 10, "type": "MCQ"},
            ],
            "total_marks": 125,
            "duration": "2 Hours 30 Minutes",
            "marking_scheme": "+1 for correct, no negative marking",
        },
        "syllabus": {
            "pdf_link": "https://viteee.vit.ac.in/syllabus",
            "subjects": [
                {"name": "Physics", "topics": ["Laws of Motion", "Work and Energy", "Rotational Motion", "Gravitation", "Properties of Matter", "Oscillations", "Electrostatics", "Current Electricity", "Magnetism", "Optics", "Dual Nature of Radiation", "Atomic Models", "Nuclear Physics", "Semiconductor Devices"]},
                {"name": "Chemistry", "topics": ["Atomic Structure", "p-Block Elements", "d-Block Elements", "Coordination Chemistry", "Thermodynamics", "Electrochemistry", "Isomerism", "Carbonyl Compounds", "Carboxylic Acids", "Biomolecules", "Polymers", "Chemistry of Everyday Life"]},
                {"name": "Mathematics", "topics": ["Matrices & Determinants", "Trigonometry", "Differential Calculus", "Integral Calculus", "Vector Algebra", "Analytical Geometry 3D", "Probability Distributions", "Discrete Mathematics", "Complex Numbers", "Sequences & Series"]},
                {"name": "English", "topics": ["Comprehension", "Grammar", "Vocabulary"]},
                {"name": "Aptitude", "topics": ["Data Interpretation", "Quantitative Aptitude", "Reasoning Ability", "Numerical Ability"]},
            ],
        },
        "preparation_tips": [
            "VITEEE has no negative marking — attempt all questions confidently.",
            "English and Aptitude sections are scoring and require minimal preparation.",
            "Focus on NCERT-level Physics and Chemistry for straightforward questions.",
            "Practice VITEEE previous year papers — questions often repeat in similar form.",
            "The Mathematics section is moderately tough — focus on Calculus and Algebra.",
            "Complete the exam well within time to review all answers.",
            "Use VIT's official mock test portal for realistic practice.",
            "Slot booking strategy matters — choose less competitive days if possible.",
        ],
        "important_dates": [
            {"event": "Application Opens", "date": "November 2024"},
            {"event": "Last Date to Apply", "date": "March 2025"},
            {"event": "Hall Ticket Download", "date": "March 2025"},
            {"event": "VITEEE Exam Window", "date": "April 2025"},
            {"event": "Results Announcement", "date": "April 2025"},
            {"event": "Counselling Round 1", "date": "May 2025"},
        ],
        "pyqs": {
            "availability": "VITEEE previous year papers from 2014–2024 are available on coaching platforms. VIT does not officially release papers.",
            "difficulty_trend": "Moderate difficulty. Questions are mostly NCERT-level. No negative marking makes it high-scoring. English and Aptitude are easy.",
            "recommended_sources": [
                "Arihant VITEEE Previous Year Papers",
                "Disha VITEEE Question Bank",
                "VIT Official Practice Portal",
                "Embibe VITEEE Mocks",
            ],
        },
        "mock_tests": {
            "importance": "Mock tests help build speed and confidence for VITEEE. Since there's no negative marking, completing all questions is the goal.",
            "recommended_platforms": [
                "VIT Official Mock Tests — viteee.vit.ac.in",
                "Embibe VITEEE Mock Tests",
                "Career360 Mock Tests",
                "Testbook VITEEE Practice",
            ],
            "recommended_count": "Attempt 15–20 full-length mocks. Focus on completing within 2 hours 30 minutes.",
        },
    },
    "created_at": ts(), "updated_at": ts(),
},

{
    "name": "SRMJEEE",
    "slug": "srmjeee",
    "category": "Engineering",
    "conducting_body": "SRM Institute of Science and Technology",
    "official_website": "https://www.srmist.edu.in",
    "exam_mode": "Computer Based Test (CBT)",
    "exam_level": "University Level",
    "tabs": {
        "overview": (
            "• Conducted By: SRM Institute of Science and Technology\n"
            "• Purpose: Admissions to B.Tech programs at SRM campuses — Kattankulathur, Ramapuram, Delhi-NCR, and Amaravati\n"
            "• Frequency: Two phases per year\n"
            "• Exam Level: University Level\n\n"
            "SRM is ranked among India's top private engineering universities in QS rankings. "
            "SRMJEEE offers 7,000+ seats across all campuses.\n\n"
            "• Subjects: Physics, Chemistry, Mathematics/Biology, English\n"
            "• Mode: Remote proctored (home-based) or centre-based\n"
            "• No Negative Marking\n"
            "• Known For: Strong industry ties, CS and Biotechnology programs"
        ),
        "application": (
            "• Mode: Online at srmist.edu.in\n\n"
            "Step-by-Step Process:\n"
            "1. Register at srmist.edu.in and fill the online application form\n"
            "2. Choose between Phase 1 (remote proctor) or Phase 2 (centre-based)\n"
            "3. Upload photo, signature, Class 10 & 12 mark sheets\n"
            "4. Pay fee: ₹1100 (online mode)\n"
            "5. Receive login credentials for the remote proctor platform\n"
            "6. Appear from home using laptop/desktop with webcam on chosen date"
        ),
        "eligibility": (
            "• Educational Qualification: Class 12 passed or appearing with PCM or PCB\n"
            "• Minimum Marks: 50% in Physics, Chemistry, and Mathematics/Biology\n"
            "• Age Limit: No specific age restriction\n"
            "• Nationality: Indian nationals and NRIs are eligible"
        ),
        "exam_pattern": {
            "description": "Online remote/centre-based test — 125 questions in 2 hours 30 minutes",
            "sections": [
                {"subject": "Physics", "questions": 35, "marks": 35, "type": "MCQ"},
                {"subject": "Chemistry", "questions": 35, "marks": 35, "type": "MCQ"},
                {"subject": "Mathematics/Biology", "questions": 40, "marks": 40, "type": "MCQ"},
                {"subject": "English", "questions": 15, "marks": 15, "type": "MCQ"},
            ],
            "total_marks": 125,
            "duration": "2 Hours 30 Minutes",
            "marking_scheme": "+1 for correct, no negative marking",
        },
        "syllabus": {
            "pdf_link": "https://www.srmist.edu.in/admissions/engineering/srmjeee-syllabus",
            "subjects": [
                {"name": "Physics", "topics": ["Units & Measurements", "Kinematics", "Dynamics", "Thermal Physics", "Electrostatics", "Current Electricity", "Magnetic Effects", "Optics", "Nuclear Physics", "Semiconductor Electronics", "Communication Systems"]},
                {"name": "Chemistry", "topics": ["s-Block Elements", "p-Block Elements", "Transition Metals", "Organic Chemistry", "Polymers", "Biomolecules", "Environmental Chemistry", "Electrochemistry", "Chemical Kinetics", "Solutions"]},
                {"name": "Mathematics", "topics": ["Sets & Relations", "Complex Numbers", "Algebra", "Calculus", "Trigonometry", "Coordinate Geometry", "Probability", "Statistics", "Vectors", "Differential Equations"]},
                {"name": "English", "topics": ["Reading Comprehension", "Vocabulary", "Grammar", "Verbal Ability", "Error Correction"]},
            ],
        },
        "preparation_tips": [
            "SRMJEEE is a moderate difficulty exam — NCERT + standard reference books are sufficient.",
            "English section is easy — score full marks here with basic preparation.",
            "No negative marking: attempt every single question.",
            "Focus on speed — 125 questions in 150 minutes means ~1.2 minutes per question.",
            "Take remote proctored mock tests to get comfortable with the exam environment.",
            "Practise Maths problems from past SRMJEEE papers — geometry and calculus dominate.",
            "Study Chemistry reactions and mechanisms for organic chemistry questions.",
            "Revise formulae and constants one day before the exam.",
        ],
        "important_dates": [
            {"event": "Application Opens", "date": "October 2024"},
            {"event": "Last Date to Apply", "date": "April 2025"},
            {"event": "SRMJEEE Phase 1 Exam", "date": "March–April 2025"},
            {"event": "SRMJEEE Phase 2 Exam", "date": "May 2025"},
            {"event": "Results", "date": "May 2025"},
            {"event": "Counselling Begins", "date": "June 2025"},
        ],
        "pyqs": {
            "availability": "Memory-based SRMJEEE papers from 2015–2024 available on coaching portals. Official release is not done by SRM.",
            "difficulty_trend": "Easy to moderate. Questions are mostly NCERT-based. English and aptitude are straightforward. Speed is the differentiator.",
            "recommended_sources": [
                "Arihant SRMJEEE Practice Papers",
                "SRM Official Mock Portal",
                "Testbook SRMJEEE Mocks",
            ],
        },
        "mock_tests": {
            "importance": "Remote proctored mock tests are essential to get comfortable with the home-based exam setup. Practice on similar platforms beforehand.",
            "recommended_platforms": [
                "SRM Official Portal Mock Tests",
                "Embibe SRMJEEE Mocks",
                "Testbook Practice Tests",
            ],
            "recommended_count": "10–15 full-length mocks are sufficient for SRMJEEE preparation.",
        },
    },
    "created_at": ts(), "updated_at": ts(),
},

{
    "name": "COMEDK UGET",
    "slug": "comedk-uget",
    "category": "Engineering",
    "conducting_body": "Consortium of Medical, Engineering and Dental Colleges of Karnataka",
    "official_website": "https://www.comedk.org",
    "exam_mode": "Computer Based Test (CBT)",
    "exam_level": "State Level",
    "tabs": {
        "overview": (
            "• Conducted By: COMEDK (Consortium of Medical, Engineering and Dental Colleges of Karnataka)\n"
            "• Purpose: Admissions to engineering programs in 190+ private colleges in Karnataka\n"
            "• Frequency: Once a year (May)\n"
            "• Exam Level: State Level\n\n"
            "COMEDK offers 20,000+ engineering seats across Karnataka. "
            "Students from outside Karnataka are also eligible.\n\n"
            "• Subjects: Physics, Chemistry, Mathematics\n"
            "• No Negative Marking\n"
            "• Accepted by top private colleges like RNS Institute, BMS College of Engineering, etc."
        ),
        "application": (
            "• Mode: Online at comedk.org\n\n"
            "Step-by-Step Process:\n"
            "1. Register at comedk.org with a valid email and mobile number\n"
            "2. Fill personal, academic, and contact details\n"
            "3. Upload photograph, signature, Class 10 & 12 certificates\n"
            "4. Pay fee: ₹1800 (COMEDK only) or ₹2800 (COMEDK + UniGAUGE)\n"
            "5. Download admit card from the official website before the exam\n"
            "6. Report to exam centre with admit card and original ID"
        ),
        "eligibility": (
            "• Nationality: Indian national\n"
            "• Educational Qualification: Class 12 passed with Physics, Chemistry, and Mathematics\n"
            "• Minimum Marks: 45% in PCM (40% for SC/ST from Karnataka)\n"
            "• Age Limit: Minimum 17 years as on 31st December of admission year\n"
            "• Both Karnataka and non-Karnataka students can apply"
        ),
        "exam_pattern": {
            "description": "Single paper CBT — 180 questions in 3 hours",
            "sections": [
                {"subject": "Physics", "questions": 60, "marks": 60, "type": "MCQ"},
                {"subject": "Chemistry", "questions": 60, "marks": 60, "type": "MCQ"},
                {"subject": "Mathematics", "questions": 60, "marks": 60, "type": "MCQ"},
            ],
            "total_marks": 180,
            "duration": "3 Hours",
            "marking_scheme": "+1 for correct, no negative marking",
        },
        "syllabus": {
            "pdf_link": "https://www.comedk.org/syllabus",
            "subjects": [
                {"name": "Physics", "topics": ["Physical World & Measurement", "Kinematics", "Laws of Motion", "Work & Energy", "Systems of Particles", "Oscillations", "Electrostatics", "Electromagnetic Waves", "Current Electricity", "Optics", "Magnetism", "Radiation & Matter", "Semiconductor Electronics"]},
                {"name": "Chemistry", "topics": ["Basic Concepts", "States of Matter", "Thermodynamics", "Equilibrium", "Redox Reactions", "Organic Chemistry", "Hydrocarbons", "Aromatic Compounds", "Polymers", "Biomolecules", "Environmental Chemistry", "Chemistry in Daily Life"]},
                {"name": "Mathematics", "topics": ["Relations & Functions", "Inverse Trigonometry", "Matrices", "Determinants", "Continuity & Differentiability", "Integrals", "Differential Equations", "Vectors", "3D Geometry", "Probability", "Linear Programming"]},
            ],
        },
        "preparation_tips": [
            "COMEDK syllabus closely follows Karnataka PUC (Class 11–12) curriculum.",
            "NCERT books are the primary resource — master them thoroughly.",
            "No negative marking — attempt all questions and never leave any blank.",
            "Practice Karnataka state board previous papers along with COMEDK past papers.",
            "Physics and Maths require maximum attention — they have higher weightage.",
            "Manage time effectively: 3 hours for 180 questions requires discipline.",
            "Solve at least 5 full-length mock tests in the last month before the exam.",
            "Chemistry is usually the most scoring section — prepare it well for easy marks.",
        ],
        "important_dates": [
            {"event": "Application Opens", "date": "January 2025"},
            {"event": "Last Date to Apply", "date": "March 2025"},
            {"event": "Admit Card Download", "date": "April 2025"},
            {"event": "COMEDK UGET Exam", "date": "May 2025"},
            {"event": "Answer Key Release", "date": "May 2025"},
            {"event": "Result Declaration", "date": "June 2025"},
            {"event": "Counselling Rounds", "date": "June–July 2025"},
        ],
        "pyqs": {
            "availability": "COMEDK PYQs from 2012–2024 are available on comedk.org and coaching institute portals.",
            "difficulty_trend": "Moderate difficulty, easier than JEE Main. Questions are mostly direct and formula-based. Mathematics section is slightly tougher.",
            "recommended_sources": [
                "COMEDK Official Website Archive",
                "MTG COMEDK Previous Year Papers",
                "Embibe COMEDK Practice",
            ],
        },
        "mock_tests": {
            "importance": "Mock tests for COMEDK help develop the habit of attempting 180 questions in 3 hours. Speed and accuracy both matter.",
            "recommended_platforms": [
                "COMEDK Official Practice Portal",
                "Embibe COMEDK Mocks",
                "Testbook COMEDK Tests",
            ],
            "recommended_count": "15–20 full-length mocks are sufficient.",
        },
    },
    "created_at": ts(), "updated_at": ts(),
},

{
    "name": "WBJEE",
    "slug": "wbjee",
    "category": "Engineering",
    "conducting_body": "West Bengal Joint Entrance Examinations Board",
    "official_website": "https://wbjeeb.nic.in",
    "exam_mode": "OMR-Based (Offline)",
    "exam_level": "State Level",
    "tabs": {
        "overview": (
            "• Conducted By: West Bengal Joint Entrance Examinations Board (WBJEEB)\n"
            "• Purpose: Admissions to B.Tech/B.E./B.Arch/B.Pharm programs in WB government and private colleges\n"
            "• Frequency: Once a year (April)\n"
            "• Exam Level: State Level\n\n"
            "Notable institutions include Jadavpur University (top 10 nationally), IIEST Shibpur, and several reputed private colleges.\n\n"
            "• Subjects: Mathematics, Physics, Chemistry\n"
            "• Format: Pen-and-paper OMR based — one of the few offline engineering exams\n"
            "• Unique Feature: Three question categories with different marking schemes"
        ),
        "application": (
            "• Mode: Online at wbjeeb.nic.in\n\n"
            "Step-by-Step Process:\n"
            "1. Register at wbjeeb.nic.in and complete the online form\n"
            "2. Fill personal and academic details carefully\n"
            "3. Upload photo and signature in specified formats\n"
            "4. Pay application fee: ₹700 (single paper) or ₹1300 (WBJEE + JENPAS)\n"
            "5. Download system-generated application form\n"
            "6. Collect admit card from the official website before the exam"
        ),
        "eligibility": (
            "• Domicile: West Bengal students or those who studied Class 11 & 12 from a WB institution\n"
            "• Students from other states may also appear\n"
            "• Educational Qualification: Class 12 with Physics, Chemistry, and Mathematics\n"
            "• Minimum Marks: 45% in PCM aggregate (40% for SC/ST/OBC/PwD from WB)\n"
            "• Age Limit: Minimum 17 years as of 31st December. No upper age limit."
        ),
        "exam_pattern": {
            "description": "OMR-based exam — two papers on the same day",
            "sections": [
                {"subject": "Mathematics (Paper 1)", "questions": 75, "marks": 100, "type": "Category 1 (1 mark), Category 2 (2 marks), Category 3 (2 marks)"},
                {"subject": "Physics (Paper 2)", "questions": 40, "marks": 50, "type": "Category 1 (1 mark), Category 2 (2 marks), Category 3 (2 marks)"},
                {"subject": "Chemistry (Paper 2)", "questions": 40, "marks": 50, "type": "Category 1 (1 mark), Category 2 (2 marks), Category 3 (2 marks)"},
            ],
            "total_marks": 200,
            "duration": "2 Hours each paper",
            "marking_scheme": "Category 1: +1/-0.25 | Category 2: +2/-0.5 | Category 3: +2, no negative marking",
        },
        "syllabus": {
            "pdf_link": "https://wbjeeb.nic.in/syllabus",
            "subjects": [
                {"name": "Mathematics", "topics": ["Algebra", "Logarithms", "Complex Numbers", "Quadratic Equations", "Permutations & Combinations", "Calculus", "Statistics", "Trigonometry", "Coordinate Geometry", "Statics & Dynamics", "Probability", "Matrices", "Sets & Relations", "Sequence & Series"]},
                {"name": "Physics", "topics": ["Physical World & Measurement", "Kinematics", "Laws of Motion", "Work, Energy & Power", "Bulk Properties", "Viscosity", "Thermodynamics", "Oscillations", "Waves", "Electrostatics", "Current Electricity", "Magnetic Effect of Current", "Electromagnetic Induction", "Optics", "Particle Physics"]},
                {"name": "Chemistry", "topics": ["Atoms & Molecules", "Atomic Structure", "Chemical Bonding", "Redox Reactions", "Energy Changes", "Rate of Chemical Reactions", "Equilibrium", "Hydrolysis", "Electrochemistry", "Organic Chemistry", "Aliphatic Compounds", "Aromatic Compounds", "Polymers", "Biomolecules"]},
            ],
        },
        "preparation_tips": [
            "Category 3 questions in WBJEE have no negative marking — always attempt them.",
            "Jadavpur University (top 10 in India) admits through WBJEE — it's worth serious effort.",
            "Practice OMR-based answering — avoid common bubbling mistakes.",
            "Focus heavily on Mathematics as it has 75 questions and high total marks.",
            "Previous year WBJEE papers are the best preparation resource for this exam.",
            "Physics questions in WBJEE are often conceptual and application-based.",
            "Chemistry requires a mix of theory and numerical — balance your preparation.",
            "Study the special Category 2 and 3 question formats — they differ from standard MCQ.",
        ],
        "important_dates": [
            {"event": "Application Opens", "date": "December 2024"},
            {"event": "Last Date to Apply", "date": "January 2025"},
            {"event": "Admit Card Available", "date": "April 2025"},
            {"event": "WBJEE Exam", "date": "April 2025"},
            {"event": "Answer Key Release", "date": "April 2025"},
            {"event": "Result Declaration", "date": "May 2025"},
            {"event": "Counselling Begins", "date": "June 2025"},
        ],
        "pyqs": {
            "availability": "WBJEE PYQs from 2007–2024 are available on wbjeeb.nic.in and coaching portals.",
            "difficulty_trend": "Moderate to high difficulty. Mathematics is the hardest section. Category 2 and 3 questions require deep conceptual understanding.",
            "recommended_sources": [
                "WBJEEB Official Website",
                "Arihant WBJEE Previous Year Papers",
                "MTG WBJEE Question Bank",
            ],
        },
        "mock_tests": {
            "importance": "OMR-based mock tests are essential. Bubbling practice is as important as content preparation for offline exams.",
            "recommended_platforms": [
                "Embibe WBJEE Mocks",
                "Career360 WBJEE Practice",
                "Allen WBJEE Test Series",
            ],
            "recommended_count": "15–20 full-length mocks including OMR practice tests.",
        },
    },
    "created_at": ts(), "updated_at": ts(),
},

{
    "name": "MHT CET",
    "slug": "mht-cet",
    "category": "Engineering",
    "conducting_body": "State Common Entrance Test Cell, Maharashtra",
    "official_website": "https://cetcell.mahacet.org",
    "exam_mode": "Computer Based Test (CBT)",
    "exam_level": "State Level",
    "tabs": {
        "overview": (
            "• Conducted By: State Common Entrance Test Cell, Maharashtra\n"
            "• Purpose: Admissions to B.E./B.Tech programs in Maharashtra government and private colleges\n"
            "• Frequency: Once a year (April–May window)\n"
            "• Exam Level: State Level\n\n"
            "MHT CET is one of India's largest state engineering exams with 4 lakh+ candidates annually. "
            "Top institutions include COEP Pune, VJTI Mumbai, ICT Mumbai.\n\n"
            "• Subjects: Physics, Chemistry, Mathematics\n"
            "• Mathematics carries double marks compared to Physics/Chemistry\n"
            "• No Negative Marking\n"
            "• Maharashtra domicile: 85% seats | Other states: 15% seats"
        ),
        "application": (
            "• Mode: Online at cetcell.mahacet.org\n\n"
            "Step-by-Step Process:\n"
            "1. Register at cetcell.mahacet.org\n"
            "2. Fill personal and academic details\n"
            "3. Upload photo, signature, and caste/income certificate if applicable\n"
            "4. Pay fee: ₹800 (General) | ₹600 (Reserved categories from Maharashtra)\n"
            "5. Download hall ticket from the portal\n"
            "6. Carry admit card with valid photo ID to exam centre"
        ),
        "eligibility": (
            "• Educational Qualification: Class 12 passed/appearing with Physics, Chemistry, and Mathematics\n"
            "• Minimum Marks: 50% in PCM (45% for reserved categories from Maharashtra)\n"
            "• Maharashtra domicile students: Priority for 85% seats\n"
            "• Age Limit: Born on or before December 31, 2007 (for 2025 admissions)\n"
            "• Other state students: Eligible for 15% all-India seats"
        ),
        "exam_pattern": {
            "description": "Group A (PCM) — CBT conducted over multiple days and shifts",
            "sections": [
                {"subject": "Physics", "questions": 50, "marks": 100, "type": "MCQ"},
                {"subject": "Chemistry", "questions": 50, "marks": 100, "type": "MCQ"},
                {"subject": "Mathematics", "questions": 50, "marks": 200, "type": "MCQ"},
            ],
            "total_marks": 400,
            "duration": "3 Hours (90 min each for Math & PChem separately)",
            "marking_scheme": "+2 for Physics/Chemistry correct | +2 for Math correct | No negative marking",
        },
        "syllabus": {
            "pdf_link": "https://cetcell.mahacet.org/syllabus.pdf",
            "subjects": [
                {"name": "Physics", "topics": ["Circular Motion", "Gravitation", "Rotational Motion", "Oscillations", "Elasticity", "Surface Tension", "Wave Motion", "Stationary Waves", "Kinetic Theory", "Wave Optics", "Interference & Diffraction", "Electrostatics", "Current Electricity", "Magnetic Fields", "Electromagnetic Induction", "Electronics"]},
                {"name": "Chemistry", "topics": ["Solid State", "Solutions", "Chemical Thermodynamics", "Electrochemistry", "Chemical Kinetics", "p-Block Elements", "d and f Block Elements", "Coordination Compounds", "Halogen Derivatives", "Alcohols & Ethers", "Aldehydes & Ketones", "Carboxylic Acids", "Amines", "Biomolecules", "Polymers"]},
                {"name": "Mathematics", "topics": ["Mathematical Logic", "Matrices", "Trigonometric Functions", "Pairs of Straight Lines", "Circles", "Conics", "Vectors", "Three Dimensional Geometry", "Line & Plane", "Linear Programming", "Continuity", "Differentiation", "Applications of Derivatives", "Integration", "Applications of Integrals", "Differential Equations", "Probability Distribution"]},
            ],
        },
        "preparation_tips": [
            "MHT CET syllabus is based on Maharashtra State Board Class 11 and 12 curriculum.",
            "Maharashtra State Board textbooks are the primary and most important resource.",
            "Mathematics has double the marks compared to Physics/Chemistry — prioritise it.",
            "No negative marking — attempt all 150 questions without hesitation.",
            "Practice previous 5 years' MHT CET papers extensively.",
            "Join online test series specifically designed for MHT CET.",
            "Revise all formulae, chemical reactions, and theorems one week before the exam.",
            "Time management is key: 3 hours for 150 questions requires practice.",
        ],
        "important_dates": [
            {"event": "Application Opens", "date": "February 2025"},
            {"event": "Last Date to Apply", "date": "March 2025"},
            {"event": "Admit Card Download", "date": "April 2025"},
            {"event": "MHT CET Exam (PCM Group)", "date": "April–May 2025"},
            {"event": "Answer Key Release", "date": "May 2025"},
            {"event": "Result Declaration", "date": "June 2025"},
            {"event": "CAP Rounds (Counselling)", "date": "July–August 2025"},
        ],
        "pyqs": {
            "availability": "MHT CET PYQs from 2010–2024 are available on cetcell.mahacet.org and coaching portals.",
            "difficulty_trend": "Moderate difficulty based on Maharashtra State Board syllabus. Mathematics is consistently tougher than Physics/Chemistry.",
            "recommended_sources": [
                "Nikita Publication MHT CET Papers",
                "MTG MHT CET Question Bank",
                "Target MHT CET Books",
            ],
        },
        "mock_tests": {
            "importance": "MHT CET mock tests familiarise you with the CBT interface and help you practise the split paper format (Maths + PChem separately).",
            "recommended_platforms": [
                "MHT CET Official Mock Portal",
                "Embibe MHT CET Mocks",
                "Target MHT CET Test Series",
            ],
            "recommended_count": "20–25 full-length mocks. Practise separate subject-wise timed tests initially.",
        },
    },
    "created_at": ts(), "updated_at": ts(),
},

{
    "name": "KCET",
    "slug": "kcet",
    "category": "Engineering",
    "conducting_body": "Karnataka Examinations Authority (KEA)",
    "official_website": "https://kea.kar.nic.in",
    "exam_mode": "Offline (OMR-Based)",
    "exam_level": "State Level",
    "tabs": {
        "overview": (
            "• Conducted By: Karnataka Examinations Authority (KEA)\n"
            "• Purpose: Admissions to engineering, pharmacy, and farm science programs in Karnataka\n"
            "• Frequency: Once a year (April)\n"
            "• Exam Level: State Level\n\n"
            "KCET is gateway to reputed Karnataka government colleges like RV College, BMS College, MSRIT, UVCE, and BNMIT.\n\n"
            "• Subjects: Mathematics, Physics, Chemistry (separate papers)\n"
            "• Format: Pen-and-paper OMR-based on 2 consecutive days\n"
            "• No Negative Marking\n"
            "• Karnataka PUC students get priority for 85% seats"
        ),
        "application": (
            "• Mode: Online at kea.kar.nic.in\n\n"
            "Step-by-Step Process:\n"
            "1. Visit kea.kar.nic.in and register with email and mobile number\n"
            "2. Fill personal, academic, and contact information\n"
            "3. Upload photo and signature\n"
            "4. Pay fee: ₹650 (General/2A/2B/3A/3B) | ₹500 (SC/ST)\n"
            "5. Submit form and note the application number\n"
            "6. Download admit card from KEA portal one week before the exam"
        ),
        "eligibility": (
            "• Domicile: Karnataka domicile — born in Karnataka or studied Classes 1–10 or 11–12 in Karnataka\n"
            "• Educational Qualification: Karnataka 2nd PUC or equivalent with PCM/PCB\n"
            "• Minimum Marks: 45% in PCM (40% for SC/ST/OBC from Karnataka)\n"
            "• Age Limit: Minimum 17 years. No upper age limit."
        ),
        "exam_pattern": {
            "description": "OMR-based exam on 2 consecutive days — 60 questions per subject",
            "sections": [
                {"subject": "Mathematics (Day 1)", "questions": 60, "marks": 60, "type": "MCQ — OMR"},
                {"subject": "Physics (Day 2)", "questions": 60, "marks": 60, "type": "MCQ — OMR"},
                {"subject": "Chemistry (Day 2)", "questions": 60, "marks": 60, "type": "MCQ — OMR"},
            ],
            "total_marks": 180,
            "duration": "80 minutes per subject",
            "marking_scheme": "+1 for correct answer, no negative marking",
        },
        "syllabus": {
            "pdf_link": "https://kea.kar.nic.in/syllabus.pdf",
            "subjects": [
                {"name": "Physics", "topics": ["Electric Charges & Fields", "Electrostatic Potential", "Current Electricity", "Moving Charges", "Magnetism & Matter", "Electromagnetic Induction", "Alternating Current", "Electromagnetic Waves", "Ray Optics", "Wave Optics", "Dual Nature of Radiation", "Atoms & Nuclei", "Semiconductors", "Communication Systems"]},
                {"name": "Chemistry", "topics": ["Solid State", "Solutions", "Electrochemistry", "Chemical Kinetics", "Surface Chemistry", "Isolation of Elements", "p-Block Elements", "d & f Block Elements", "Coordination Compounds", "Haloalkanes & Haloarenes", "Alcohols, Phenols & Ethers", "Aldehydes & Ketones", "Carboxylic Acids", "Amines", "Biomolecules"]},
                {"name": "Mathematics", "topics": ["Relations & Functions", "Inverse Trigonometric Functions", "Matrices", "Determinants", "Continuity & Differentiability", "Applications of Derivatives", "Integrals", "Applications of Integrals", "Differential Equations", "Vectors", "Three-Dimensional Geometry", "Linear Programming", "Probability"]},
            ],
        },
        "preparation_tips": [
            "KCET strictly follows Karnataka 2nd PUC syllabus — Karnataka state board books are essential.",
            "No negative marking: answer all 180 questions to maximise your score.",
            "Mathematics paper is on Day 1 — prepare for it as the prime focus.",
            "KCET questions are straightforward — don't over-complicate preparation.",
            "Solve at least 7–8 years of previous KCET papers for thorough practice.",
            "Attend KCET-specific mock tests offered by Bangalore coaching institutes.",
            "Physics and Chemistry papers are on the same day — manage energy levels.",
            "Verify your OMR sheet answers carefully before submission.",
        ],
        "important_dates": [
            {"event": "Application Opens", "date": "January 2025"},
            {"event": "Last Date to Apply", "date": "February 2025"},
            {"event": "Admit Card Download", "date": "April 2025"},
            {"event": "KCET Exam (Day 1 – Maths)", "date": "April 2025"},
            {"event": "KCET Exam (Day 2 – Physics & Chemistry)", "date": "April 2025"},
            {"event": "Answer Key Release", "date": "April 2025"},
            {"event": "Result Declaration", "date": "May 2025"},
            {"event": "Counselling (UGCET)", "date": "June–August 2025"},
        ],
        "pyqs": {
            "availability": "KCET PYQs from 2005–2024 are available on kea.kar.nic.in and coaching portals like BASE and Deeksha.",
            "difficulty_trend": "Moderate difficulty, closely follows Karnataka PUC syllabus. Questions are direct and formula-based.",
            "recommended_sources": [
                "KEA Official Archive",
                "BASE KCET Question Bank",
                "MTG KCET Previous Year Papers",
            ],
        },
        "mock_tests": {
            "importance": "OMR-based practice is essential for KCET. Marking speed and bubbling accuracy matter alongside content knowledge.",
            "recommended_platforms": [
                "KEA Official Practice Portal",
                "BASE Online Test Series",
                "Embibe KCET Mocks",
            ],
            "recommended_count": "15–20 full-length mocks with OMR practice included.",
        },
    },
    "created_at": ts(), "updated_at": ts(),
},

# ─────────────────────────────────────────
# MEDICAL
# ─────────────────────────────────────────
{
    "name": "NEET UG",
    "slug": "neet-ug",
    "category": "Medical",
    "conducting_body": "National Testing Agency (NTA)",
    "official_website": "https://neet.nta.nic.in",
    "exam_mode": "Offline (OMR-Based)",
    "exam_level": "National",
    "tabs": {
        "overview": (
            "• Conducted By: National Testing Agency (NTA)\n"
            "• Purpose: Single national gateway for MBBS, BDS, AYUSH, and allied health science programs\n"
            "• Frequency: Once a year (May)\n"
            "• Exam Level: National\n\n"
            "NEET UG replaced all state-level medical entrance exams. Over 20 lakh candidates appear annually for 1.08 lakh MBBS seats.\n\n"
            "• Subjects: Biology (Botany + Zoology), Physics, Chemistry\n"
            "• Paper Available in 13 languages including English and Hindi\n"
            "• Also required for AIIMS and JIPMER admissions\n"
            "• Total Marks: 720 (Biology 360 + Physics 180 + Chemistry 180)"
        ),
        "application": (
            "• Mode: Online at neet.nta.nic.in\n\n"
            "Step-by-Step Process:\n"
            "1. Visit neet.nta.nic.in and click 'New Registration'\n"
            "2. Enter personal details: name, DOB, email, mobile\n"
            "3. Fill academic details: Class 12 subjects, board, marks\n"
            "4. Upload photo (10–200 KB), signature (4–30 KB), left-hand thumb impression\n"
            "5. Select exam city preferences (up to 4)\n"
            "6. Pay the fee:\n"
            "   – General/OBC-NCL: ₹1700\n"
            "   – General-EWS: ₹1600\n"
            "   – SC/ST/PwD/Transgender: ₹1000\n"
            "7. Download and print the confirmation page"
        ),
        "eligibility": (
            "• Age Limit: Minimum 17 years as on 31st December. Upper age limit removed (per Supreme Court ruling)\n"
            "• Educational Qualification: Class 12 with Physics, Chemistry, Biology/Biotechnology and English\n"
            "• Minimum Marks: 50% in PCB (45% for PwD, 40% for SC/ST/OBC)\n"
            "• Attempts: No limit on attempts\n"
            "• Nationality: Indian Nationals, NRIs, OCIs, PIOs, and Foreign Nationals are eligible"
        ),
        "exam_pattern": {
            "description": "Offline OMR-based exam — 200 questions, 180 to be attempted",
            "sections": [
                {"subject": "Physics", "questions": "50 (45 to attempt)", "marks": 180, "type": "MCQ — Section A (35 compulsory) + Section B (15, attempt 10)"},
                {"subject": "Chemistry", "questions": "50 (45 to attempt)", "marks": 180, "type": "MCQ — Section A (35 compulsory) + Section B (15, attempt 10)"},
                {"subject": "Botany", "questions": "50 (45 to attempt)", "marks": 180, "type": "MCQ — Section A (35 compulsory) + Section B (15, attempt 10)"},
                {"subject": "Zoology", "questions": "50 (45 to attempt)", "marks": 180, "type": "MCQ — Section A (35 compulsory) + Section B (15, attempt 10)"},
            ],
            "total_marks": 720,
            "duration": "3 Hours 20 Minutes",
            "marking_scheme": "+4 for correct, -1 for incorrect",
        },
        "syllabus": {
            "pdf_link": "https://neet.nta.nic.in/syllabus.pdf",
            "subjects": [
                {"name": "Biology (Botany)", "topics": ["The Living World", "Biological Classification", "Plant Kingdom", "Morphology of Flowering Plants", "Anatomy of Flowering Plants", "Cell Structure", "Cell Division", "Transport in Plants", "Mineral Nutrition", "Photosynthesis", "Respiration in Plants", "Plant Growth", "Reproduction in Plants", "Genetics & Evolution", "Ecology"]},
                {"name": "Biology (Zoology)", "topics": ["Animal Kingdom", "Structural Organisation in Animals", "Cell Biology", "Biomolecules", "Human Digestion", "Human Circulation", "Human Excretory System", "Locomotion & Movement", "Neural Control & Coordination", "Chemical Coordination", "Human Reproduction", "Reproductive Health", "Molecular Basis of Inheritance", "Biotechnology", "Human Health & Disease"]},
                {"name": "Physics", "topics": ["Physical World & Measurement", "Kinematics", "Laws of Motion", "Work & Energy", "Gravitation", "Properties of Matter", "Thermodynamics", "Kinetic Theory of Gases", "Oscillations", "Waves", "Electrostatics", "Current Electricity", "Magnetic Effects", "Electromagnetic Induction", "Optics", "Dual Nature of Matter", "Atoms & Nuclei", "Electronic Devices"]},
                {"name": "Chemistry", "topics": ["Some Basic Concepts", "Structure of Atom", "Classification of Elements", "Chemical Bonding", "States of Matter", "Thermodynamics", "Equilibrium", "Redox Reactions", "Hydrogen", "s-Block Elements", "p-Block Elements", "Organic Chemistry Basics", "Hydrocarbons", "Environmental Chemistry", "Solutions", "Electrochemistry", "Chemical Kinetics", "Biomolecules", "Polymers"]},
            ],
        },
        "preparation_tips": [
            "NCERT Biology (Class 11 & 12) is THE most important book — read every word, every diagram.",
            "Biology carries 360 out of 720 marks — it is the most decisive section.",
            "For Physics and Chemistry, combine NCERT with DC Pandey (Physics) and MS Chauhan (Chemistry).",
            "Attempt NEET previous 10 years' papers in real exam conditions.",
            "Practice diagrams — labeled diagrams from NCERT Biology are directly tested.",
            "Create concise notes of important tables, classifications, and reactions.",
            "Solve at least 1 full mock test per week from January onwards.",
            "Revise thoroughly in the last month — don't start any new topics.",
        ],
        "important_dates": [
            {"event": "Application Opens", "date": "February 2025"},
            {"event": "Last Date to Apply", "date": "March 2025"},
            {"event": "Admit Card Download", "date": "April 2025"},
            {"event": "NEET UG Exam", "date": "May 4, 2025"},
            {"event": "Answer Key Release", "date": "May 2025"},
            {"event": "Result Declaration", "date": "June 2025"},
            {"event": "Counselling (MCC & State)", "date": "June–August 2025"},
        ],
        "pyqs": {
            "availability": "NEET PYQs from 2013–2024 are freely available on neet.nta.nic.in and coaching portals.",
            "difficulty_trend": "Biology questions are mostly NCERT-direct. Physics has increased in difficulty post-2019. Chemistry is moderately difficult.",
            "recommended_sources": [
                "NTA Official Website",
                "Arihant NEET 32 Years Chapterwise PYQs",
                "MTG NEET Question Bank",
                "Embibe NEET PYQ Practice",
                "Allen NEET Chapterwise Papers",
            ],
        },
        "mock_tests": {
            "importance": "Mock tests are the single most important preparation tool for NEET. They build OMR accuracy, time management, and exam temperament.",
            "recommended_platforms": [
                "NTA Official Mock Tests",
                "Allen Online Test Series",
                "Aakash iTutor NEET Mocks",
                "Embibe NEET Mocks",
                "Physics Wallah NEET Tests",
            ],
            "recommended_count": "Attempt 30–40 full-length mocks from January to May. Weekly full mocks from 6 months before the exam.",
        },
    },
    "created_at": ts(), "updated_at": ts(),
},

{
    "name": "NEET PG",
    "slug": "neet-pg",
    "category": "Medical",
    "conducting_body": "National Board of Examinations (NBE)",
    "official_website": "https://nbe.edu.in",
    "exam_mode": "Computer Based Test (CBT)",
    "exam_level": "National",
    "tabs": {
        "overview": (
            "• Conducted By: National Board of Examinations (NBE)\n"
            "• Purpose: Admissions to MD, MS, and PG Diploma courses in medical colleges across India\n"
            "• Frequency: Once a year (March)\n"
            "• Exam Level: National\n\n"
            "NEET PG replaced the erstwhile AIPGME exam. Over 2 lakh candidates appear for ~50,000 PG medical seats.\n\n"
            "• Tests all MBBS curriculum subjects\n"
            "• Scores valid for a single admission cycle only\n"
            "• Results used by MCC and state counselling authorities"
        ),
        "application": (
            "• Mode: Online at nbe.edu.in\n\n"
            "Step-by-Step Process:\n"
            "1. Register at nbe.edu.in using valid email and mobile\n"
            "2. Fill personal details, MBBS registration number, internship completion date\n"
            "3. Upload recent passport-size photograph and signature\n"
            "4. Pay application fee: ₹4250 (General) | ₹3750 (SC/ST/PwD)\n"
            "5. Choose exam centre preference\n"
            "6. Download admit card from NBE portal before the exam date"
        ),
        "eligibility": (
            "• Educational Qualification: MBBS from an MCI/NMC-recognized institution\n"
            "• Internship: 12-month compulsory rotating internship completed by 31st March of exam year\n"
            "• Registration: Must be registered with State Medical Council or MCI/NMC\n"
            "• Nationality: Indian nationals, NRIs, OCIs, PIOs, foreign nationals with India MBBS"
        ),
        "exam_pattern": {
            "description": "CBT — 200 Single Best Response (SBR) questions in 3.5 hours",
            "sections": [
                {"subject": "Pre-Clinical Subjects (Anatomy, Physiology, Biochemistry)", "questions": "~40 (~20%)", "marks": "~160", "type": "Single Best Response MCQ"},
                {"subject": "Para-Clinical Subjects (Pathology, Pharmacology, Microbiology, FMT)", "questions": "~60 (~30%)", "marks": "~240", "type": "Single Best Response MCQ"},
                {"subject": "Clinical Subjects (Medicine, Surgery, OBG, Paediatrics, etc.)", "questions": "~100 (~50%)", "marks": "~400", "type": "Single Best Response MCQ"},
            ],
            "total_marks": 800,
            "duration": "3 Hours 30 Minutes",
            "marking_scheme": "+4 for correct, -1 for incorrect",
        },
        "syllabus": {
            "pdf_link": "https://nbe.edu.in/neetpg/syllabus.pdf",
            "subjects": [
                {"name": "Pre-Clinical", "topics": ["Anatomy", "Physiology", "Biochemistry"]},
                {"name": "Para-Clinical", "topics": ["Pathology", "Pharmacology", "Microbiology", "Forensic Medicine & Toxicology", "Social & Preventive Medicine (PSM)"]},
                {"name": "Clinical Sciences", "topics": ["General Medicine", "General Surgery", "Obstetrics & Gynaecology", "Paediatrics", "Orthopaedics", "Ophthalmology", "ENT", "Psychiatry", "Dermatology", "Radiology", "Anaesthesia", "Emergency Medicine"]},
            ],
        },
        "preparation_tips": [
            "Start NEET PG preparation from the 3rd year of MBBS — don't wait until internship.",
            "Focus on high-weightage subjects: Medicine, Surgery, OBG, Pathology, and Pharmacology.",
            "Use standard textbooks: Harrison's Medicine, Bailey & Love Surgery, Dutta OBG.",
            "Solve question banks (Marrow, PrepLadder, DAMS) rigorously — MCQ practice is key.",
            "Attempt full-length mock tests under timed conditions every week.",
            "Join a structured test series for NEET PG from recognised coaching platforms.",
            "Revise First Aid-style notes for quick recall of high-yield facts.",
            "Clinical subjects require understanding, not just memorization — think clinically.",
        ],
        "important_dates": [
            {"event": "Application Opens", "date": "December 2024"},
            {"event": "Last Date to Apply", "date": "January 2025"},
            {"event": "Admit Card Download", "date": "February 2025"},
            {"event": "NEET PG Exam", "date": "March 2025"},
            {"event": "Result Declaration", "date": "April 2025"},
            {"event": "MCC Counselling Round 1", "date": "May 2025"},
        ],
        "pyqs": {
            "availability": "NEET PG PYQs from 2013–2024 available on PrepLadder, Marrow, DAMS, and nbe.edu.in.",
            "difficulty_trend": "Clinical subjects increasing in complexity. Image-based and case-based questions are increasing. Pharmacology and Pathology remain high-yield.",
            "recommended_sources": [
                "PrepLadder NEET PG Question Bank",
                "Marrow PYQ Practice",
                "DAMS Question Bank",
                "Across question bank",
            ],
        },
        "mock_tests": {
            "importance": "Timed full-length mocks are essential for NEET PG. 200 questions in 3.5 hours demands rigorous time management.",
            "recommended_platforms": [
                "PrepLadder Grand Tests",
                "Marrow Full Mocks",
                "DAMS Test Series",
                "Dr. Bhatia Medical Coaching",
            ],
            "recommended_count": "Minimum 30 full-length mocks from 6 months before the exam.",
        },
    },
    "created_at": ts(), "updated_at": ts(),
},

{
    "name": "AFMC",
    "slug": "afmc",
    "category": "Medical",
    "conducting_body": "Armed Forces Medical College, Pune",
    "official_website": "https://www.afmc.nic.in",
    "exam_mode": "Via NEET UG + SSB Interview",
    "exam_level": "National",
    "tabs": {
        "overview": (
            "• Conducted By: Armed Forces Medical College (AFMC), Pune\n"
            "• Purpose: Admissions to the prestigious MBBS program at AFMC, Pune — the premier military medical institution in India\n"
            "• Frequency: Once a year\n"
            "• Exam Level: National\n\n"
            "AFMC Pune is one of India's most sought-after medical colleges with a unique military environment and excellent infrastructure.\n\n"
            "• Selection Process: NEET UG Score → SSB Interview → Medical Fitness Test\n"
            "• Seats: 150 total (130 male + 20 female)\n"
            "• Bond: Candidates must serve in the Armed Forces after MBBS\n"
            "• Stipend: Students receive monthly stipend during the MBBS program\n"
            "• Affiliation: Maharashtra University of Health Sciences (MUHS)"
        ),
        "application": (
            "• Mode: Online at afmc.nic.in\n\n"
            "Step-by-Step Process:\n"
            "1. Apply for NEET UG at neet.nta.nic.in\n"
            "2. Separately register for AFMC at afmc.nic.in after NEET results\n"
            "3. Fill personal, academic, and contact details\n"
            "4. Upload photo, signature, and relevant certificates\n"
            "5. Pay application fee: ₹250 (non-refundable)\n"
            "6. Shortlisted candidates are called for SSB Interview at respective SSB centres\n"
            "7. Final merit list based on NEET score + SSB score + medical fitness"
        ),
        "eligibility": (
            "• Nationality: Indian nationals only (OCI/NRI not eligible)\n"
            "• Age Limit: 17–24 years as on 31st December of admission year\n"
            "• Educational Qualification: Class 12 with Physics, Chemistry, Biology, and English\n"
            "• Minimum Marks: 60% in PCB for General | 45% for SC/ST\n"
            "• NEET UG: Must qualify NEET UG with a competitive score\n"
            "• Gender: Both male and female candidates are eligible\n"
            "• Marital Status: Must be unmarried at the time of admission\n"
            "• Physical Fitness: Must meet Armed Forces medical fitness standards"
        ),
        "exam_pattern": {
            "description": "Three-stage selection: NEET UG → SSB Interview → Medical Board",
            "sections": [
                {"subject": "NEET UG (Physics)", "questions": "50 (45 to attempt)", "marks": 180, "type": "MCQ — OMR based"},
                {"subject": "NEET UG (Chemistry)", "questions": "50 (45 to attempt)", "marks": 180, "type": "MCQ — OMR based"},
                {"subject": "NEET UG (Botany)", "questions": "50 (45 to attempt)", "marks": 180, "type": "MCQ — OMR based"},
                {"subject": "NEET UG (Zoology)", "questions": "50 (45 to attempt)", "marks": 180, "type": "MCQ — OMR based"},
                {"subject": "SSB Interview", "questions": "Psychological Tests + GTO + Personal Interview", "marks": "Evaluated separately", "type": "Interview-based"},
            ],
            "total_marks": 720,
            "duration": "3 Hours 20 Minutes (NEET) + 5 Days (SSB)",
            "marking_scheme": "NEET: +4 correct, -1 wrong | SSB: holistic evaluation by Service Selection Board",
        },
        "syllabus": {
            "pdf_link": "https://neet.nta.nic.in/syllabus.pdf",
            "subjects": [
                {"name": "Biology (Botany)", "topics": ["The Living World", "Plant Kingdom", "Cell Structure", "Photosynthesis", "Plant Reproduction", "Genetics & Evolution", "Ecology", "Morphology of Plants", "Mineral Nutrition", "Respiration in Plants"]},
                {"name": "Biology (Zoology)", "topics": ["Animal Kingdom", "Human Physiology", "Human Reproduction", "Reproductive Health", "Biotechnology", "Human Health & Disease", "Biomolecules", "Locomotion", "Neural Control", "Chemical Coordination"]},
                {"name": "Physics", "topics": ["Mechanics", "Thermodynamics", "Optics", "Electrostatics", "Current Electricity", "Magnetic Effects", "Modern Physics", "Waves", "Oscillations", "Electronic Devices"]},
                {"name": "Chemistry", "topics": ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry", "Polymers", "Biomolecules", "Electrochemistry", "Chemical Kinetics", "Coordination Compounds", "Environmental Chemistry"]},
                {"name": "SSB Interview", "topics": ["Psychological Tests (OIR, PPDT)", "Group Testing Officer Tasks (GTO)", "Personal Interview", "Medical Fitness Test", "Conference"]},
            ],
        },
        "preparation_tips": [
            "Prepare rigorously for NEET UG — a score of 600+ is generally required for AFMC shortlisting.",
            "NCERT Biology is the most important resource — read it cover to cover multiple times.",
            "Start SSB preparation alongside NEET — practice WAT, SRT, TAT, and group tasks.",
            "Physical fitness is essential — maintain regular exercise routine for SSB GTO tasks.",
            "Stay updated with current affairs and general knowledge for the Personal Interview stage.",
            "Develop clear communication and leadership qualities — SSB tests officer-like qualities.",
            "Read books like 'Crack the SSB' and practice with peers in mock SSB groups.",
            "Medical fitness check is strict — ensure you meet all Armed Forces medical standards before applying.",
        ],
        "important_dates": [
            {"event": "NEET UG Application", "date": "February 2025"},
            {"event": "NEET UG Exam", "date": "May 4, 2025"},
            {"event": "AFMC Application Opens", "date": "After NEET UG Result — June 2025"},
            {"event": "AFMC Shortlist Announcement", "date": "July 2025"},
            {"event": "SSB Interviews", "date": "August–October 2025"},
            {"event": "Medical Fitness Board", "date": "After SSB"},
            {"event": "Final Merit List", "date": "November 2025"},
            {"event": "Admission", "date": "January 2026"},
        ],
        "pyqs": {
            "availability": "AFMC does not conduct a separate written exam post-2012. NEET UG PYQs serve as the primary resource. SSB practice materials are widely available.",
            "difficulty_trend": "NEET UG score requirement for AFMC shortlisting is typically 600+/720. SSB requires psychological preparedness and leadership qualities.",
            "recommended_sources": [
                "NEET UG PYQs — Arihant, MTG",
                "SSB Crack by Arihant",
                "Officers IQ SSB Preparation Books",
                "Ex-SSB Candidate YouTube Channels",
            ],
        },
        "mock_tests": {
            "importance": "NEET mock tests are essential for AFMC as the first filter is NEET score. Additionally, mock SSB interviews are critical for the second stage.",
            "recommended_platforms": [
                "NTA NEET Official Mocks",
                "Embibe NEET Mocks",
                "SSB Crack Mock Interview Portal",
                "Allen NEET Test Series",
            ],
            "recommended_count": "30+ NEET mocks. 5+ Mock SSB interview sessions with peers or coaching institutes.",
        },
    },
    "created_at": ts(), "updated_at": ts(),
},

# ─────────────────────────────────────────
# COMPUTER SCIENCE
# ─────────────────────────────────────────
{
    "name": "GATE CS",
    "slug": "gate-cs",
    "category": "Computer Science",
    "conducting_body": "IIT (rotates annually)",
    "official_website": "https://gate.iitb.ac.in",
    "exam_mode": "Computer Based Test (CBT)",
    "exam_level": "National",
    "tabs": {
        "overview": (
            "• Conducted By: IITs (on rotation basis)\n"
            "• Purpose: Admissions to M.Tech/MS at IITs, NITs, IIITs; PSU recruitment benchmark\n"
            "• Frequency: Once a year (February)\n"
            "• Exam Level: National\n\n"
            "GATE CS is one of the most prestigious postgraduate CS entrance exams globally. "
            "Scores are valid for 3 years for admissions and PSU recruitment.\n\n"
            "• Subjects: Core CS + Engineering Mathematics + General Aptitude\n"
            "• PSUs recruiting via GATE CS: BARC, ISRO, BHEL, DRDO, and many others\n"
            "• Stipend: ₹12,400/month for M.Tech at MHRD-funded institutions\n"
            "• Score used by: IIT Bombay, IIT Delhi, IIT Madras, NIT Trichy, IISc Bangalore"
        ),
        "application": (
            "• Mode: Online at official GATE portal\n\n"
            "Step-by-Step Process:\n"
            "1. Register at the official GATE portal\n"
            "2. Fill personal and academic details\n"
            "3. Upload photo, signature, and qualifying degree certificate\n"
            "4. Choose exam paper: CS (Computer Science)\n"
            "5. Select exam city preferences (up to 3)\n"
            "6. Pay fee: ₹1800 (General/OBC) | ₹900 (Women/SC/ST/PwD)\n"
            "7. Download admit card 2 weeks before the exam"
        ),
        "eligibility": (
            "• Educational Qualification: B.E./B.Tech or M.Sc./MCA in relevant discipline\n"
            "• Final year students are also eligible\n"
            "• Age Limit: No age limit\n"
            "• Nationality: Indian nationals and select foreign nationals (Nepal, Bangladesh, Sri Lanka, UAE, Ethiopia, Singapore)"
        ),
        "exam_pattern": {
            "description": "Online CBT — 65 questions in 3 hours",
            "sections": [
                {"subject": "General Aptitude", "questions": 10, "marks": 15, "type": "MCQ + NAT"},
                {"subject": "Engineering Mathematics", "questions": 10, "marks": 15, "type": "MCQ + NAT"},
                {"subject": "Core CS Subjects", "questions": 45, "marks": 70, "type": "MCQ + MSQ + NAT"},
            ],
            "total_marks": 100,
            "duration": "3 Hours",
            "marking_scheme": "+1/+2 for correct MCQ | -1/3 or -2/3 for wrong MCQ | No negative for MSQ/NAT",
        },
        "syllabus": {
            "pdf_link": "https://gate2025.iitr.ac.in/syllabus/cs.html",
            "subjects": [
                {"name": "Engineering Mathematics", "topics": ["Discrete Mathematics", "Linear Algebra", "Calculus", "Probability & Statistics"]},
                {"name": "Digital Logic", "topics": ["Boolean Algebra", "Combinational & Sequential Circuits", "Minimization", "Number Representations"]},
                {"name": "Computer Organization & Architecture", "topics": ["Instruction Cycles", "ALU Design", "Memory Hierarchy", "I/O Systems", "Pipelining"]},
                {"name": "Programming & Data Structures", "topics": ["C Programming", "Arrays, Stacks, Queues", "Linked Lists", "Trees", "Graphs", "Hashing"]},
                {"name": "Algorithms", "topics": ["Asymptotic Notation", "Searching & Sorting", "Divide & Conquer", "Dynamic Programming", "Greedy Algorithms", "Graph Algorithms", "NP-Completeness"]},
                {"name": "Theory of Computation", "topics": ["Regular Languages & FSA", "Context-Free Grammars & PDA", "Turing Machines", "Decidability & Undecidability", "Complexity Classes"]},
                {"name": "Compiler Design", "topics": ["Lexical Analysis", "Parsing (LL, LR)", "Syntax-Directed Translation", "Code Optimization", "Code Generation"]},
                {"name": "Operating Systems", "topics": ["Processes & Threads", "CPU Scheduling", "Memory Management", "File Systems", "Deadlocks", "I/O Management"]},
                {"name": "Databases", "topics": ["ER Model", "Relational Model", "SQL", "Normalization", "Transaction Processing", "Indexing & Hashing"]},
                {"name": "Computer Networks", "topics": ["OSI & TCP/IP Model", "Data Link Layer", "Network Layer (IP, Routing)", "Transport Layer (TCP, UDP)", "Application Layer (HTTP, DNS, SMTP)"]},
            ],
        },
        "preparation_tips": [
            "GATE CS requires mastery of fundamentals — do NOT skip any topic in the syllabus.",
            "Start with NPTEL lectures for OS, DBMS, Networks, and Algorithms.",
            "Solve GATE previous 15 years' papers — patterns repeat and concepts are tested deeply.",
            "Algorithms and Theory of Computation are high-weightage, high-difficulty — prepare them well.",
            "Practice Numerical Answer Type (NAT) questions — they require exact computation.",
            "Join GATE test series (Made Easy, ACE Academy, GateOverflow) for benchmarking.",
            "Revise Engineering Mathematics — it contributes 13–15 marks reliably.",
            "Build a thorough understanding of OS internals — scheduling, memory management, and file systems.",
        ],
        "important_dates": [
            {"event": "GATE Application Opens", "date": "August 2024"},
            {"event": "Last Date to Apply", "date": "September 2024"},
            {"event": "Admit Card Download", "date": "January 2025"},
            {"event": "GATE 2025 Exam", "date": "February 1–2 & 8–9, 2025"},
            {"event": "Answer Key Release", "date": "February 2025"},
            {"event": "Result Declaration", "date": "March 2025"},
            {"event": "COAP/CCMT Counselling", "date": "April–June 2025"},
        ],
        "pyqs": {
            "availability": "GATE CS PYQs from 1991–2024 are available on gate.iitb.ac.in and GateOverflow community portal.",
            "difficulty_trend": "Consistently high difficulty. TOC and Algorithms are the hardest. DBMS and OS have become more application-based in recent years.",
            "recommended_sources": [
                "GateOverflow — gateoverflow.in (free, community-curated)",
                "Made Easy GATE CS Book",
                "Arihant GATE Computer Science",
                "ACE Academy GATE CS Book",
            ],
        },
        "mock_tests": {
            "importance": "GATE CS mock tests are crucial for time management. 65 questions in 180 minutes requires disciplined pacing and NAT accuracy.",
            "recommended_platforms": [
                "Virtual Calculator Practice (GATE official)",
                "Made Easy GATE Online Test Series",
                "ACE Academy GATE Online Tests",
                "GateOverflow Practice Portal",
            ],
            "recommended_count": "Minimum 20 full-length mocks. Start subject-wise mocks from the beginning, then move to full tests in the last 2 months.",
        },
    },
    "created_at": ts(), "updated_at": ts(),
},

{
    "name": "NIMCET",
    "slug": "nimcet",
    "category": "Computer Science",
    "conducting_body": "NITs (rotates annually)",
    "official_website": "https://nimcet.in",
    "exam_mode": "Computer Based Test (CBT)",
    "exam_level": "National",
    "tabs": {
        "overview": (
            "• Conducted By: NITs (on rotation basis)\n"
            "• Purpose: Admissions to MCA programs at 11 National Institutes of Technology\n"
            "• Frequency: Once a year (May)\n"
            "• Exam Level: National\n\n"
            "NIMCET is the most prestigious MCA entrance exam in India, opening doors to NIT Trichy, NIT Warangal, NIT Surathkal, and NIT Allahabad.\n\n"
            "• Subjects: Mathematics, Analytical Ability & Logical Reasoning, Computer Awareness, General English\n"
            "• Centralised merit-based counselling after results\n"
            "• Negative marking: -1 for incorrect answers"
        ),
        "application": (
            "• Mode: Online at nimcet.in\n\n"
            "Step-by-Step Process:\n"
            "1. Register at nimcet.in during the application window\n"
            "2. Fill personal, academic, and contact details\n"
            "3. Upload photograph and signature\n"
            "4. Pay fee: ₹2700 (General/OBC) | ₹1350 (SC/ST/PwD)\n"
            "5. Select exam city preference\n"
            "6. Download admit card a week before the exam"
        ),
        "eligibility": (
            "• Educational Qualification: BCA, B.Sc. (CS/IT/Maths), B.Tech/B.E. (any branch) with Mathematics\n"
            "• Minimum Marks: 60% in qualifying degree (55% for SC/ST)\n"
            "• Mathematics mandatory at Class 12 or graduation level\n"
            "• Age Limit: No upper age limit"
        ),
        "exam_pattern": {
            "description": "CBT — 120 questions in 2 hours",
            "sections": [
                {"subject": "Mathematics", "questions": 50, "marks": 200, "type": "MCQ"},
                {"subject": "Analytical Ability & Logical Reasoning", "questions": 30, "marks": 120, "type": "MCQ"},
                {"subject": "Computer Awareness", "questions": 20, "marks": 80, "type": "MCQ"},
                {"subject": "General English", "questions": 20, "marks": 80, "type": "MCQ"},
            ],
            "total_marks": 480,
            "duration": "2 Hours",
            "marking_scheme": "+4 for correct, -1 for incorrect",
        },
        "syllabus": {
            "pdf_link": "https://nimcet.in/syllabus",
            "subjects": [
                {"name": "Mathematics", "topics": ["Set Theory", "Propositional Logic", "Probability", "Statistics", "Algebra", "Coordinate Geometry", "Trigonometry", "Matrices & Determinants", "Calculus", "Differential Equations", "Linear Programming", "Combinatorics", "Graph Theory Basics"]},
                {"name": "Computer Awareness", "topics": ["Number Systems", "Computer Architecture", "Data Representation", "C Programming Basics", "Data Structures", "Operating Systems Basics", "Database Concepts", "Networking Basics", "Internet & Web Technologies", "Computer Security"]},
                {"name": "Analytical Ability", "topics": ["Logical Deductions", "Blood Relations", "Seating Arrangements", "Data Sufficiency", "Series Completion", "Analogies", "Syllogisms", "Coding-Decoding", "Venn Diagrams", "Clocks & Calendars"]},
                {"name": "General English", "topics": ["Reading Comprehension", "Vocabulary", "Grammar", "Sentence Correction", "Fill in the Blanks"]},
            ],
        },
        "preparation_tips": [
            "Mathematics contributes 41% of total marks — it is the most important section.",
            "Study Discrete Mathematics rigorously: it covers a significant portion of the syllabus.",
            "Practice coding/logic questions in C and understand algorithmic thinking.",
            "Logical reasoning can be mastered with consistent daily practice.",
            "Attempt NIMCET previous year papers to understand question difficulty and patterns.",
            "Manage time in the exam — 120 questions in 120 minutes requires speed.",
            "English section is scoring — don't neglect it.",
            "Join NIMCET-specific online communities and forums for peer learning.",
        ],
        "important_dates": [
            {"event": "Application Opens", "date": "February 2025"},
            {"event": "Last Date to Apply", "date": "April 2025"},
            {"event": "Admit Card Download", "date": "May 2025"},
            {"event": "NIMCET Exam", "date": "May 2025"},
            {"event": "Result Declaration", "date": "June 2025"},
            {"event": "Counselling", "date": "June–July 2025"},
        ],
        "pyqs": {
            "availability": "NIMCET PYQs from 2008–2024 available on nimcet.in and coaching portals.",
            "difficulty_trend": "Mathematics has become more challenging post-2018. Discrete Mathematics and Probability now have higher weightage.",
            "recommended_sources": [
                "NIMCET Official Website PYQs",
                "Arihant NIMCET Guide",
                "MCA Entrance Books by R.S. Aggarwal",
            ],
        },
        "mock_tests": {
            "importance": "Speed and accuracy are equally important in NIMCET. Regular timed mocks are essential to master the 4-mark, 120-question format.",
            "recommended_platforms": [
                "NIMCET Official Practice Portal",
                "Testbook NIMCET Mocks",
                "Career360 NIMCET Tests",
            ],
            "recommended_count": "15–20 full-length mocks. Subject-wise tests especially for Mathematics.",
        },
    },
    "created_at": ts(), "updated_at": ts(),
},

{
    "name": "TANCET",
    "slug": "tancet",
    "category": "Computer Science",
    "conducting_body": "Anna University, Chennai",
    "official_website": "https://www.annauniv.edu/tancet",
    "exam_mode": "Computer Based Test (CBT)",
    "exam_level": "State Level",
    "tabs": {
        "overview": (
            "• Conducted By: Anna University, Chennai\n"
            "• Purpose: Admissions to M.E./M.Tech/MBA/MCA/M.Sc. programs in Tamil Nadu colleges\n"
            "• Frequency: Once a year (March)\n"
            "• Exam Level: State Level\n\n"
            "TANCET (Tamil Nadu Common Entrance Test) is the gateway to postgraduate programs at Anna University and affiliated engineering colleges in Tamil Nadu.\n\n"
            "• Accepted by: Anna University, Government Engineering Colleges, and top private colleges in TN\n"
            "• Programs: M.E./M.Tech, MBA, MCA, M.Sc. (5-year integrated)\n"
            "• Two papers: Paper I (Engineering/Science/Humanities) + Paper II (Program-specific)"
        ),
        "application": (
            "• Mode: Online at annauniv.edu/tancet\n\n"
            "Step-by-Step Process:\n"
            "1. Register at the official TANCET portal\n"
            "2. Select the program (M.E./M.Tech or MCA or MBA)\n"
            "3. Fill personal and academic details\n"
            "4. Upload photo and signature\n"
            "5. Pay application fee: ₹500 (General) | ₹250 (SC/ST)\n"
            "6. Download admit card before the exam date"
        ),
        "eligibility": (
            "• For M.E./M.Tech: B.E./B.Tech in relevant engineering discipline\n"
            "• For MCA: BCA/B.Sc. (CS/IT/Maths) or B.E./B.Tech with Mathematics\n"
            "• For MBA: Any bachelor's degree\n"
            "• Minimum Marks: 50% in qualifying degree (45% for SC/ST)\n"
            "• Domicile: Tamil Nadu domicile preferred; others can also apply\n"
            "• Age Limit: No upper age limit"
        ),
        "exam_pattern": {
            "description": "CBT — Part I (20 questions) + Part II (80 questions) in 2 hours",
            "sections": [
                {"subject": "Part I — Engineering Mathematics / Basic Sciences / Humanities", "questions": 20, "marks": 20, "type": "MCQ"},
                {"subject": "Part II — Computer Science (CS specific topics)", "questions": 80, "marks": 80, "type": "MCQ"},
            ],
            "total_marks": 100,
            "duration": "2 Hours",
            "marking_scheme": "+1 for correct, -1/3 for incorrect",
        },
        "syllabus": {
            "pdf_link": "https://www.annauniv.edu/tancet/syllabus",
            "subjects": [
                {"name": "Engineering Mathematics", "topics": ["Linear Algebra", "Calculus", "Differential Equations", "Probability & Statistics", "Discrete Mathematics", "Numerical Methods"]},
                {"name": "Data Structures", "topics": ["Arrays", "Linked Lists", "Stacks & Queues", "Trees", "Graphs", "Sorting & Searching", "Hashing"]},
                {"name": "Algorithms", "topics": ["Complexity Analysis", "Divide & Conquer", "Dynamic Programming", "Greedy Algorithms", "Graph Algorithms"]},
                {"name": "Operating Systems", "topics": ["Process Management", "Memory Management", "File Systems", "Deadlocks", "Scheduling"]},
                {"name": "Databases", "topics": ["ER Model", "SQL", "Normalization", "Transactions", "Indexing"]},
                {"name": "Computer Networks", "topics": ["OSI Model", "TCP/IP", "Routing", "Transport Layer", "Application Layer Protocols"]},
                {"name": "Programming", "topics": ["C/C++ Programming", "Java Basics", "OOP Concepts", "Compiler Design Basics"]},
            ],
        },
        "preparation_tips": [
            "TANCET CS syllabus closely mirrors GATE CS — use GATE preparation material.",
            "Engineering Mathematics is important — cover Linear Algebra, Probability, and Discrete Maths thoroughly.",
            "Focus on Data Structures, Algorithms, OS, and DBMS — they carry the highest weightage.",
            "Solve TANCET previous year papers from 2010–2024 for pattern understanding.",
            "Practice negative marking management — avoid guessing in Part II.",
            "NPTEL lectures are excellent free resources for all core CS subjects.",
            "Anna University's own study materials are available online — refer to them.",
            "Time management is critical — 100 questions in 120 minutes requires steady pace.",
        ],
        "important_dates": [
            {"event": "TANCET Application Opens", "date": "January 2025"},
            {"event": "Last Date to Apply", "date": "February 2025"},
            {"event": "Admit Card Download", "date": "March 2025"},
            {"event": "TANCET Exam", "date": "March 2025"},
            {"event": "Result Declaration", "date": "April 2025"},
            {"event": "Counselling (TANCA)", "date": "May–June 2025"},
        ],
        "pyqs": {
            "availability": "TANCET PYQs from 2005–2024 available on annauniv.edu and coaching portals in Chennai.",
            "difficulty_trend": "Moderate difficulty. Core CS topics are tested at GATE-lite level. Mathematics portion is straightforward.",
            "recommended_sources": [
                "Anna University Official TANCET Archive",
                "TANCET Guide by ACE Academy",
                "Made Easy TANCET CS Book",
            ],
        },
        "mock_tests": {
            "importance": "TANCET mock tests train you for the two-part format and negative marking management.",
            "recommended_platforms": [
                "ACE Academy TANCET Online Tests",
                "Made Easy TANCET Test Series",
                "Testbook TANCET Mocks",
            ],
            "recommended_count": "10–15 full-length mocks are sufficient for TANCET preparation.",
        },
    },
    "created_at": ts(), "updated_at": ts(),
},

{
    "name": "IIT JAM",
    "slug": "jam",
    "category": "Computer Science",
    "conducting_body": "IITs (rotates annually)",
    "official_website": "https://jam.iitd.ac.in",
    "exam_mode": "Computer Based Test (CBT)",
    "exam_level": "National",
    "tabs": {
        "overview": (
            "• Conducted By: IITs (on rotation basis)\n"
            "• Purpose: Admissions to M.Sc., M.Sc.-Ph.D., M.S. (Research), and Joint M.Sc.-Ph.D. programs at IITs and IISc\n"
            "• Frequency: Once a year (February)\n"
            "• Exam Level: National\n\n"
            "IIT JAM (Joint Admission Test for M.Sc.) is one of the most competitive postgraduate science entrance exams in India. "
            "It is the gateway to M.Sc. Mathematics, Statistics, Physics, Chemistry, Computer Science, Biotechnology, and Economics at IITs.\n\n"
            "• Subjects Offered: BT, CY, EY, GG, MA, MS, PH (candidates choose one)\n"
            "• For Computer Science: Mathematical Statistics (MS) is most relevant\n"
            "• Scores used by: IIT Bombay, IIT Delhi, IIT Madras, IIT Kanpur, IISc Bangalore"
        ),
        "application": (
            "• Mode: Online at jam.iitd.ac.in\n\n"
            "Step-by-Step Process:\n"
            "1. Register at the official JAM portal\n"
            "2. Select test paper(s) — up to 2 papers allowed\n"
            "3. Fill personal and academic details\n"
            "4. Upload photo and signature\n"
            "5. Pay fee: ₹1800 (one paper, General) | ₹900 (SC/ST/PwD/Female)\n"
            "   Additional ₹600 for second paper\n"
            "6. Download admit card 2 weeks before the exam"
        ),
        "eligibility": (
            "• Educational Qualification: Bachelor's degree (3-year or 4-year) in relevant science/engineering discipline\n"
            "• Minimum Marks: 55% aggregate (50% for SC/ST/PwD)\n"
            "• Final year students are also eligible\n"
            "• Age Limit: No upper age limit\n"
            "• Nationality: Indian nationals and foreign nationals"
        ),
        "exam_pattern": {
            "description": "CBT — 60 questions in 3 hours (Section A + B + C)",
            "sections": [
                {"subject": "Section A — MCQ (1 & 2 mark questions)", "questions": 30, "marks": 50, "type": "MCQ — negative marking applies"},
                {"subject": "Section B — MSQ (1 & 2 mark questions)", "questions": 10, "marks": 20, "type": "Multiple Select — no negative marking"},
                {"subject": "Section C — Numerical Answer Type (NAT)", "questions": 20, "marks": 30, "type": "Numerical — no negative marking"},
            ],
            "total_marks": 100,
            "duration": "3 Hours",
            "marking_scheme": "Section A: +1/+2, -1/3 or -2/3 | Section B: +1/+2, no negative | Section C: +1/+2, no negative",
        },
        "syllabus": {
            "pdf_link": "https://jam.iitd.ac.in/syllabi.html",
            "subjects": [
                {"name": "Mathematics (MA)", "topics": ["Real Analysis", "Linear Algebra", "Calculus of Several Variables", "Complex Analysis", "Ordinary Differential Equations", "Algebra", "Functional Analysis", "Topology", "Numerical Analysis", "Linear Programming"]},
                {"name": "Mathematical Statistics (MS)", "topics": ["Sequences & Series", "Differential Calculus", "Integral Calculus", "Matrices", "Probability", "Random Variables", "Standard Distributions", "Joint Distributions", "Sampling Distributions", "Estimation", "Testing of Hypotheses"]},
                {"name": "Physics (PH)", "topics": ["Mechanics", "Oscillations & Waves", "Kinetic Theory", "Thermodynamics", "Mathematical Methods", "Electrostatics", "Magnetism", "EM Waves", "Optics", "Modern Physics", "Electronics"]},
                {"name": "Chemistry (CY)", "topics": ["Physical Chemistry", "Organic Chemistry", "Inorganic Chemistry"]},
                {"name": "Biotechnology (BT)", "topics": ["Biology", "Chemistry", "Mathematics", "Physics"]},
            ],
        },
        "preparation_tips": [
            "Choose your JAM paper wisely — Mathematical Statistics (MS) is ideal for CS students transitioning to M.Sc.",
            "IIT JAM requires deep mathematical understanding — superficial preparation will not work.",
            "Standard textbooks are essential: Rudin (Real Analysis), Casella & Berger (Statistics), Artin (Algebra).",
            "Solve all IIT JAM previous year papers from 2005–2024 — pattern is highly consistent.",
            "NAT questions have no negative marking — always attempt them.",
            "Join IIT JAM coaching from Made Easy or CSIR NET platforms for structured preparation.",
            "Practice MSQ questions carefully — partial marking does not exist; all correct answers must be selected.",
            "The exam rewards deep conceptual understanding — practice derivations and proofs.",
        ],
        "important_dates": [
            {"event": "JAM Application Opens", "date": "September 2024"},
            {"event": "Last Date to Apply", "date": "October 2024"},
            {"event": "Admit Card Download", "date": "January 2025"},
            {"event": "IIT JAM 2025 Exam", "date": "February 2025"},
            {"event": "Result Declaration", "date": "March 2025"},
            {"event": "Admission Form Submission", "date": "April 2025"},
            {"event": "Final Admission Offers", "date": "June 2025"},
        ],
        "pyqs": {
            "availability": "IIT JAM PYQs from 2005–2024 are available on jam.iitd.ac.in and coaching portals.",
            "difficulty_trend": "High difficulty. Real Analysis and Abstract Algebra (for MA) are most challenging. Statistics (for MS) requires both mathematical rigour and applied thinking.",
            "recommended_sources": [
                "IIT JAM Official Archive",
                "Arihant IIT JAM Mathematics",
                "Made Easy IIT JAM Book",
                "CSIR NET Mathematical Sciences Books (overlap)",
            ],
        },
        "mock_tests": {
            "importance": "IIT JAM mock tests must simulate the three-section format. NAT and MSQ sections require dedicated practice.",
            "recommended_platforms": [
                "IIT JAM Official Virtual Exam Portal",
                "Made Easy IIT JAM Online Tests",
                "Testbook IIT JAM Mocks",
                "Eduncle IIT JAM Practice Tests",
            ],
            "recommended_count": "Minimum 15 full-length mocks. Subject-wise sectional tests from the beginning.",
        },
    },
    "created_at": ts(), "updated_at": ts(),
},

{
    "name": "CUET PG",
    "slug": "cuet-pg",
    "category": "Computer Science",
    "conducting_body": "National Testing Agency (NTA)",
    "official_website": "https://cuet.nta.nic.in",
    "exam_mode": "Computer Based Test (CBT)",
    "exam_level": "National",
    "tabs": {
        "overview": (
            "• Conducted By: National Testing Agency (NTA)\n"
            "• Purpose: Admissions to M.Sc./M.Tech/MA/M.Com and other PG programs at Central Universities\n"
            "• Frequency: Once a year (March–April)\n"
            "• Exam Level: National\n\n"
            "CUET PG (Common University Entrance Test — Postgraduate) is the centralised entrance test for postgraduate admissions at 250+ central and participating universities including JNU, Delhi University, BHU, and Hyderabad University.\n\n"
            "• Programs: M.Sc. (CS/IT), M.Tech (CS), MCA, and other PG programs\n"
            "• Computer Science paper code: SCCS01\n"
            "• Score used by: JNU, Delhi University, BHU, Hyderabad University, and 200+ other universities"
        ),
        "application": (
            "• Mode: Online at cuet.nta.nic.in\n\n"
            "Step-by-Step Process:\n"
            "1. Register at cuet.nta.nic.in\n"
            "2. Select PG program and subject paper (Computer Science — SCCS01)\n"
            "3. Fill personal and academic details\n"
            "4. Upload photo and signature\n"
            "5. Pay fee: ₹1200 (General) | ₹600 (SC/ST/PwD/EWS)\n"
            "6. Select preferred exam cities\n"
            "7. Download admit card before the exam date"
        ),
        "eligibility": (
            "• Educational Qualification: Bachelor's degree in Computer Science/IT/Engineering or equivalent\n"
            "• Minimum Marks: 50% in qualifying degree (45% for SC/ST/PwD) — varies by university\n"
            "• Final year students are eligible\n"
            "• Age Limit: No upper age limit\n"
            "• Nationality: Indian nationals"
        ),
        "exam_pattern": {
            "description": "CBT — 100 questions in 1 hour 45 minutes",
            "sections": [
                {"subject": "Part A — General Aptitude", "questions": 25, "marks": 100, "type": "MCQ"},
                {"subject": "Part B — Domain Knowledge (Computer Science)", "questions": 75, "marks": 300, "type": "MCQ"},
            ],
            "total_marks": 400,
            "duration": "1 Hour 45 Minutes",
            "marking_scheme": "+4 for correct, -1 for incorrect",
        },
        "syllabus": {
            "pdf_link": "https://cuet.nta.nic.in/syllabus",
            "subjects": [
                {"name": "General Aptitude (Part A)", "topics": ["Verbal Ability", "Quantitative Aptitude", "Logical Reasoning", "Data Interpretation", "General Awareness"]},
                {"name": "Data Structures & Algorithms", "topics": ["Arrays", "Stacks & Queues", "Linked Lists", "Trees & Graphs", "Sorting Algorithms", "Complexity Analysis", "Dynamic Programming"]},
                {"name": "Computer Organization", "topics": ["CPU Architecture", "Memory Hierarchy", "I/O Systems", "Instruction Set", "Pipelining"]},
                {"name": "Operating Systems", "topics": ["Process Scheduling", "Memory Management", "File Systems", "Deadlocks", "Concurrency"]},
                {"name": "Databases", "topics": ["SQL", "ER Model", "Normalization", "Transactions", "Indexing"]},
                {"name": "Computer Networks", "topics": ["OSI Model", "TCP/IP", "Routing", "DNS", "HTTP", "Security Protocols"]},
                {"name": "Programming", "topics": ["C/C++", "Java", "OOP Concepts", "Recursion", "Problem Solving"]},
                {"name": "Mathematics", "topics": ["Discrete Mathematics", "Linear Algebra", "Probability", "Statistics", "Calculus"]},
            ],
        },
        "preparation_tips": [
            "CUET PG CS syllabus overlaps heavily with GATE CS — use GATE preparation materials.",
            "Part A General Aptitude is easy — score full marks here to build a strong total.",
            "Data Structures, Algorithms, OS, and DBMS carry the highest weightage in Part B.",
            "Solve CUET PG previous year papers from 2022–2024 — the exam is relatively new.",
            "Different universities have different cutoffs — check the university-specific requirements.",
            "Time management is critical — 100 questions in 105 minutes is fast-paced.",
            "NTA's official practice portal provides domain-specific sample papers.",
            "JNU, DU, and BHU are top universities accepting CUET PG — high competition for these.",
        ],
        "important_dates": [
            {"event": "CUET PG Application Opens", "date": "February 2025"},
            {"event": "Last Date to Apply", "date": "March 2025"},
            {"event": "Admit Card Download", "date": "March 2025"},
            {"event": "CUET PG Exam", "date": "March–April 2025"},
            {"event": "Result Declaration", "date": "May 2025"},
            {"event": "University-wise Counselling", "date": "May–July 2025"},
        ],
        "pyqs": {
            "availability": "CUET PG is a relatively new exam (introduced 2022). PYQs from 2022–2024 available on cuet.nta.nic.in.",
            "difficulty_trend": "Moderate difficulty. Domain CS section is at GATE-lite level. General Aptitude is straightforward.",
            "recommended_sources": [
                "NTA CUET PG Official Sample Papers",
                "CUET PG Guide by Arihant",
                "GATE CS preparation books (high overlap)",
            ],
        },
        "mock_tests": {
            "importance": "CUET PG mock tests are essential for adapting to the fast-paced 105-minute format. Speed and accuracy must be balanced.",
            "recommended_platforms": [
                "NTA Official CUET PG Practice Portal",
                "Testbook CUET PG Mocks",
                "Career360 CUET PG Tests",
            ],
            "recommended_count": "10–15 full-length mocks. Focus on the two-part structure.",
        },
    },
    "created_at": ts(), "updated_at": ts(),
},

# ─────────────────────────────────────────
# LAW
# ─────────────────────────────────────────
{
    "name": "CLAT",
    "slug": "clat",
    "category": "Law",
    "conducting_body": "Consortium of National Law Universities (NLU)",
    "official_website": "https://consortiumofnlus.ac.in",
    "exam_mode": "Online (Centre-Based)",
    "exam_level": "National",
    "tabs": {
        "overview": (
            "• Conducted By: Consortium of National Law Universities (NLU)\n"
            "• Purpose: Admissions to 5-year integrated LLB programs and LLM programs at 23 NLUs\n"
            "• Frequency: Once a year (December)\n"
            "• Exam Level: National\n\n"
            "CLAT is the most prestigious law entrance exam in India. "
            "Around 70,000+ students appear for 2,800 UG seats across NLUs annually.\n\n"
            "• Top NLUs: NLSIU Bangalore, NALSAR Hyderabad, NUJS Kolkata, NLU Delhi\n"
            "• Format: Comprehension-heavy, passage-based question format (post-2020)\n"
            "• Subjects: English, Current Affairs, Legal Reasoning, Logical Reasoning, Quantitative Techniques"
        ),
        "application": (
            "• Mode: Online at consortiumofnlus.ac.in\n\n"
            "Step-by-Step Process:\n"
            "1. Register at consortiumofnlus.ac.in\n"
            "2. Fill personal and academic details\n"
            "3. Upload photograph and signature\n"
            "4. Select preferred NLUs in order of preference\n"
            "5. Pay fee: ₹4000 (General/OBC/PWD) | ₹3500 (SC/ST/BPL)\n"
            "6. Download admit card from the portal before the exam date"
        ),
        "eligibility": (
            "• UG (5-year LLB): Class 12 with minimum 45% marks (40% for SC/ST)\n"
            "• Age Limit: No upper age limit (as per current Consortium policy)\n"
            "• PG (LLM): LLB/LLB Honours with minimum 50% marks (45% for SC/ST)\n"
            "• Appearing candidates in Class 12 are eligible for UG CLAT"
        ),
        "exam_pattern": {
            "description": "Online centre-based exam — 120 passage-based questions in 2 hours",
            "sections": [
                {"subject": "English Language", "questions": 24, "marks": 24, "type": "Passage-Based MCQ"},
                {"subject": "Current Affairs & GK", "questions": 30, "marks": 30, "type": "Passage-Based MCQ"},
                {"subject": "Legal Reasoning", "questions": 30, "marks": 30, "type": "Passage-Based MCQ"},
                {"subject": "Logical Reasoning", "questions": 24, "marks": 24, "type": "Passage-Based MCQ"},
                {"subject": "Quantitative Techniques", "questions": 12, "marks": 12, "type": "Passage-Based MCQ"},
            ],
            "total_marks": 120,
            "duration": "2 Hours",
            "marking_scheme": "+1 for correct, -0.25 for incorrect",
        },
        "syllabus": {
            "pdf_link": "https://consortiumofnlus.ac.in/clat-2025/syllabus",
            "subjects": [
                {"name": "English Language", "topics": ["Unseen Passages", "Comprehension", "Vocabulary in Context", "Grammar Inference", "Author's Tone & Intent", "Summary Questions", "Fact-Inference-Judgement"]},
                {"name": "Current Affairs & GK", "topics": ["National Events", "International Affairs", "Constitutional Amendments", "Judicial Appointments & Verdicts", "Government Schemes", "Awards & Honours", "Static GK (Indian History, Geography)", "Sports & Entertainment", "Economic News"]},
                {"name": "Legal Reasoning", "topics": ["Legal Principles Application", "Legal Maxims", "Constitutional Law Basics", "Torts", "Criminal Law Principles", "Contract Law Basics", "International Law", "Recent Case Laws", "Public Interest Litigation"]},
                {"name": "Logical Reasoning", "topics": ["Arguments & Assumptions", "Strengthening/Weakening Arguments", "Syllogisms", "Analogies", "Critical Reasoning", "Statement-Conclusion", "Cause & Effect"]},
                {"name": "Quantitative Techniques", "topics": ["Ratios", "Percentages", "Averages", "Interest Calculations", "Data Interpretation (Tables, Graphs)", "Basic Arithmetic", "Time & Work", "Speed & Distance"]},
            ],
        },
        "preparation_tips": [
            "Read newspapers (The Hindu, Indian Express) daily for 6–12 months for Current Affairs.",
            "CLAT is a reading test — improve comprehension speed and accuracy above all else.",
            "Legal Reasoning requires understanding legal principles, not studying law books.",
            "Practice passage-based questions exclusively from CLAT 2020–2024 papers.",
            "Quantitative Techniques is easy — don't spend too much time; aim for full marks here.",
            "Maintain a current affairs diary with monthly summaries for quick revision.",
            "Join mock test series: CLATapult, LegalEdge, and Unacademy CLAT are well-regarded.",
            "Logical Reasoning requires practice in argument analysis — read editorials critically.",
        ],
        "important_dates": [
            {"event": "Application Opens", "date": "July 2024"},
            {"event": "Last Date to Apply", "date": "October 2024"},
            {"event": "Admit Card Download", "date": "November 2024"},
            {"event": "CLAT 2025 Exam", "date": "December 1, 2024"},
            {"event": "Answer Key Release", "date": "December 2024"},
            {"event": "Result Declaration", "date": "December 2024"},
            {"event": "Counselling & Allotment", "date": "December 2024 – January 2025"},
        ],
        "pyqs": {
            "availability": "CLAT PYQs from 2008–2024 available on consortiumofnlus.ac.in and law coaching portals.",
            "difficulty_trend": "Post-2020 passage-based format is reading-intensive. English and Legal Reasoning difficulty has increased. Maths is consistently the easiest section.",
            "recommended_sources": [
                "Consortium Official Archive",
                "CLATapult PYQ Analysis",
                "LegalEdge CLAT Papers",
                "Pearson CLAT Guide",
            ],
        },
        "mock_tests": {
            "importance": "CLAT mock tests train reading speed and passage comprehension — both are the core skills for this exam. Weekly mocks are non-negotiable.",
            "recommended_platforms": [
                "CLATapult Online Mocks",
                "LegalEdge Test Series",
                "Unacademy CLAT Mocks",
                "Career360 CLAT Tests",
            ],
            "recommended_count": "Attempt 30–40 full-length mocks from August to December. Start with sectional tests for reading comprehension.",
        },
    },
    "created_at": ts(), "updated_at": ts(),
},

{
    "name": "AILET",
    "slug": "ailet",
    "category": "Law",
    "conducting_body": "National Law University Delhi",
    "official_website": "https://nationallawuniversitydelhi.in",
    "exam_mode": "Offline (OMR-Based)",
    "exam_level": "University Level",
    "tabs": {
        "overview": (
            "• Conducted By: National Law University Delhi (NLU Delhi)\n"
            "• Purpose: Admissions to BA LLB (5-year), LLM, and PhD programs at NLU Delhi\n"
            "• Frequency: Once a year (April)\n"
            "• Exam Level: University Level\n\n"
            "NLU Delhi is one of India's top two law schools (alongside NLSIU Bangalore). "
            "AILET is conducted separately from CLAT and is notoriously difficult.\n\n"
            "• Seats: ~110 seats in BA LLB program\n"
            "• Format: OMR-based offline test, 150 questions in 90 minutes\n"
            "• English and Legal Aptitude are the hardest sections"
        ),
        "application": (
            "• Mode: Online at nationallawuniversitydelhi.in\n\n"
            "Step-by-Step Process:\n"
            "1. Register at the NLU Delhi admission portal\n"
            "2. Fill personal, academic, and contact details\n"
            "3. Upload photo, signature, and Class 10 board certificate\n"
            "4. Pay fee: ₹3500 (General) | ₹1000 (BPL/SC/ST/PwD)\n"
            "5. Select exam centre preference\n"
            "6. Download admit card one week before the exam"
        ),
        "eligibility": (
            "• Educational Qualification: Class 12 with minimum 50% marks (45% for SC/ST)\n"
            "• Age Limit (UG): Not more than 20 years as of July 1 (22 years for SC/ST)\n"
            "• LLM: LLB/LLB (Hons.) with minimum 55% marks\n"
            "• No stream requirement for Class 12"
        ),
        "exam_pattern": {
            "description": "OMR-based offline test — 150 questions in 1 hour 30 minutes",
            "sections": [
                {"subject": "English", "questions": 35, "marks": 35, "type": "MCQ"},
                {"subject": "Current Affairs & GK", "questions": 35, "marks": 35, "type": "MCQ"},
                {"subject": "Legal Aptitude", "questions": 35, "marks": 35, "type": "MCQ"},
                {"subject": "Reasoning", "questions": 35, "marks": 35, "type": "MCQ"},
                {"subject": "Mathematics", "questions": 10, "marks": 10, "type": "MCQ"},
            ],
            "total_marks": 150,
            "duration": "1 Hour 30 Minutes",
            "marking_scheme": "+1 for correct, -0.25 for incorrect",
        },
        "syllabus": {
            "pdf_link": "https://nationallawuniversitydelhi.in/admissions/ailet-syllabus",
            "subjects": [
                {"name": "English", "topics": ["Reading Comprehension", "Grammar", "Vocabulary", "Para Jumbles", "Fill in the Blanks", "Sentence Correction", "Idioms & Phrases"]},
                {"name": "Current Affairs & GK", "topics": ["National Affairs", "International Affairs", "Legal Current Affairs", "Sports", "Awards", "Science & Technology", "Static GK"]},
                {"name": "Legal Aptitude", "topics": ["Legal Maxims", "Legal Principles", "Constitutional Law", "Contract Law", "Tort Law", "Criminal Law", "Case-Based Legal Reasoning", "Jurisprudence Basics"]},
                {"name": "Reasoning", "topics": ["Verbal Reasoning", "Critical Reasoning", "Logical Sequences", "Syllogisms", "Statement-Assumption", "Blood Relations", "Direction Sense", "Seating Arrangements"]},
                {"name": "Mathematics", "topics": ["Basic Arithmetic", "Percentages", "Ratios", "Data Interpretation", "Simple & Compound Interest", "Profit & Loss"]},
            ],
        },
        "preparation_tips": [
            "AILET English section is difficult — focus on vocabulary and reading speed.",
            "The exam is only 90 minutes for 150 questions — speed is critical.",
            "Solve CLAT and AILET previous year papers simultaneously for comparative practice.",
            "Legal Aptitude in AILET tests classical legal principles more than CLAT.",
            "Current Affairs for the last 12 months is essential — revise monthly.",
            "Mathematics is only 10 questions but can determine rank — practise well.",
            "Join a coaching institute or mock test series focused on AILET specifically.",
            "Develop strong critical reading skills — read legal editorials and law reviews.",
        ],
        "important_dates": [
            {"event": "Application Opens", "date": "January 2025"},
            {"event": "Last Date to Apply", "date": "March 2025"},
            {"event": "Admit Card Download", "date": "April 2025"},
            {"event": "AILET Exam", "date": "April 2025"},
            {"event": "Result Declaration", "date": "May 2025"},
            {"event": "Counselling", "date": "May–June 2025"},
        ],
        "pyqs": {
            "availability": "AILET PYQs from 2008–2024 available on NLU Delhi portal and law coaching institutes.",
            "difficulty_trend": "Harder than CLAT. English and Legal Aptitude are significantly more difficult. Speed is the major challenge at 1 minute per question.",
            "recommended_sources": [
                "NLU Delhi Official Archive",
                "LegalEdge AILET PYQ Analysis",
                "CLATapult AILET Papers",
            ],
        },
        "mock_tests": {
            "importance": "AILET mock tests must simulate the 90-minute pressure. Speed-accuracy trade-off is the key skill to develop.",
            "recommended_platforms": [
                "LegalEdge AILET Test Series",
                "CLATapult AILET Mocks",
                "Career360 Law Mocks",
            ],
            "recommended_count": "20–25 full-length mocks with strict 90-minute timer.",
        },
    },
    "created_at": ts(), "updated_at": ts(),
},

{
    "name": "DU LLB",
    "slug": "du-llb",
    "category": "Law",
    "conducting_body": "National Testing Agency (NTA) on behalf of Delhi University",
    "official_website": "https://du.ac.in",
    "exam_mode": "Computer Based Test (CBT)",
    "exam_level": "University Level",
    "tabs": {
        "overview": (
            "• Conducted By: NTA on behalf of Delhi University (DU)\n"
            "• Purpose: Admissions to 3-year LLB program at Delhi University's Faculty of Law\n"
            "• Frequency: Once a year (June)\n"
            "• Exam Level: University Level\n\n"
            "DU Faculty of Law is one of India's most prestigious law schools offering the 3-year LLB program. "
            "It is distinct from the 5-year integrated LLB programs offered at NLUs.\n\n"
            "• Seats: ~300+ seats across campus colleges\n"
            "• Eligibility: Any bachelor's degree — ideal for graduates wanting to pursue law\n"
            "• Strong alumni network including Supreme Court judges and senior advocates"
        ),
        "application": (
            "• Mode: Online at du.ac.in or NTA CUET portal\n\n"
            "Step-by-Step Process:\n"
            "1. Register at the DU admissions portal or NTA CUET PG portal\n"
            "2. Select LLB (3-year) program\n"
            "3. Fill personal, academic, and contact details\n"
            "4. Upload photo and signature\n"
            "5. Pay application fee: ₹1000 (General) | ₹500 (SC/ST/PwD)\n"
            "6. Download admit card before the exam date"
        ),
        "eligibility": (
            "• Educational Qualification: Bachelor's degree in any discipline (3 or 4 years)\n"
            "• Minimum Marks: 50% in qualifying degree (45% for SC/ST/PwD)\n"
            "• Age Limit: No upper age limit\n"
            "• Nationality: Indian nationals\n"
            "• Final year students of bachelor's degree are eligible to apply"
        ),
        "exam_pattern": {
            "description": "CBT — 100 questions in 2 hours",
            "sections": [
                {"subject": "English Language & Comprehension", "questions": 25, "marks": 25, "type": "MCQ"},
                {"subject": "Legal Awareness & Aptitude", "questions": 25, "marks": 25, "type": "MCQ"},
                {"subject": "Current Affairs & General Knowledge", "questions": 25, "marks": 25, "type": "MCQ"},
                {"subject": "Logical Reasoning", "questions": 25, "marks": 25, "type": "MCQ"},
            ],
            "total_marks": 100,
            "duration": "2 Hours",
            "marking_scheme": "+1 for correct, -0.25 for incorrect",
        },
        "syllabus": {
            "pdf_link": "https://du.ac.in/law/syllabus",
            "subjects": [
                {"name": "English Language & Comprehension", "topics": ["Reading Comprehension", "Grammar", "Vocabulary", "Sentence Correction", "Para Jumbles", "Fill in the Blanks"]},
                {"name": "Legal Awareness & Aptitude", "topics": ["Constitutional Law Basics", "Contract Law", "Torts", "Criminal Law", "Legal Maxims", "Recent Judgements", "Fundamental Rights", "PIL Concepts", "Legal Terminology"]},
                {"name": "Current Affairs & GK", "topics": ["National & International Events", "Government Schemes", "Awards & Honours", "Sports", "Legal & Judicial News", "Science & Technology", "Economic News", "Static GK"]},
                {"name": "Logical Reasoning", "topics": ["Syllogisms", "Statement-Assumption", "Analogies", "Blood Relations", "Direction Sense", "Series Completion", "Critical Reasoning", "Coding-Decoding"]},
            ],
        },
        "preparation_tips": [
            "DU LLB suits working professionals and graduates from any stream — start preparation 6 months ahead.",
            "Legal Awareness section does not require law knowledge — focus on newspaper legal updates.",
            "English section is straightforward — practise grammar and comprehension daily.",
            "Current Affairs for the last 12 months is critical — maintain a monthly GK diary.",
            "Logical Reasoning is the most competitive section — practice daily for accuracy.",
            "Solve DU LLB previous year papers from 2010–2024 for pattern recognition.",
            "Read The Hindu and Legal Correspondent sections for Legal GK.",
            "DU Faculty of Law is extremely well-regarded — the effort is worthwhile.",
        ],
        "important_dates": [
            {"event": "Application Opens", "date": "March 2025"},
            {"event": "Last Date to Apply", "date": "April 2025"},
            {"event": "Admit Card Download", "date": "May 2025"},
            {"event": "DU LLB Exam", "date": "June 2025"},
            {"event": "Result Declaration", "date": "June 2025"},
            {"event": "Counselling & Admission", "date": "July 2025"},
        ],
        "pyqs": {
            "availability": "DU LLB PYQs from 2010–2024 available on du.ac.in and law coaching portals.",
            "difficulty_trend": "Moderate difficulty. Legal Awareness and Logical Reasoning are the differentiating sections.",
            "recommended_sources": [
                "DU Official Past Papers",
                "Pearson DU LLB Guide",
                "Arihant DU LLB Entrance",
            ],
        },
        "mock_tests": {
            "importance": "Regular full-length mock tests help develop the speed needed for 100 questions in 120 minutes.",
            "recommended_platforms": [
                "LegalEdge DU LLB Mocks",
                "Testbook Law Entrance Tests",
                "Career360 DU LLB Practice",
            ],
            "recommended_count": "15–20 full-length mocks from 2 months before the exam.",
        },
    },
    "created_at": ts(), "updated_at": ts(),
},

{
    "name": "AP LAWCET",
    "slug": "ap-lawcet",
    "category": "Law",
    "conducting_body": "Sri Krishnadevaraya University on behalf of APSCHE",
    "official_website": "https://aplawcet.sche.aptonline.in",
    "exam_mode": "Computer Based Test (CBT)",
    "exam_level": "State Level",
    "tabs": {
        "overview": (
            "• Conducted By: Sri Krishnadevaraya University on behalf of AP State Council of Higher Education (APSCHE)\n"
            "• Purpose: Admissions to 3-year LLB and 5-year BA LLB/BBA LLB programs in Andhra Pradesh\n"
            "• Frequency: Once a year (May)\n"
            "• Exam Level: State Level\n\n"
            "AP LAWCET is the state-level law entrance exam for Andhra Pradesh, providing access to government and private law colleges across the state.\n\n"
            "• Two Streams: 3-year LLB (for graduates) and 5-year LLB (for Class 12 students)\n"
            "• Accepted by: All AP state law colleges\n"
            "• Scores valid: For that admission year only"
        ),
        "application": (
            "• Mode: Online at aplawcet.sche.aptonline.in\n\n"
            "Step-by-Step Process:\n"
            "1. Register at the AP LAWCET official portal\n"
            "2. Select the stream (3-year or 5-year LLB)\n"
            "3. Fill personal and academic details\n"
            "4. Upload photo and signature\n"
            "5. Pay fee: ₹600 (General) | ₹400 (SC/ST)\n"
            "6. Choose exam centre preference\n"
            "7. Download admit card before exam date"
        ),
        "eligibility": (
            "• 3-year LLB: Bachelor's degree in any discipline with minimum 45% marks (40% for SC/ST)\n"
            "• 5-year LLB: Class 12 passed with minimum 45% marks (40% for SC/ST)\n"
            "• Age Limit: 30 years for 3-year LLB (35 for SC/ST/BC); No limit for 5-year LLB\n"
            "• Domicile: Andhra Pradesh domicile preferred for local seats; others apply under open category\n"
            "• Nationality: Indian nationals"
        ),
        "exam_pattern": {
            "description": "CBT — 120 questions in 1 hour 30 minutes",
            "sections": [
                {"subject": "General Knowledge & Mental Ability", "questions": 30, "marks": 30, "type": "MCQ"},
                {"subject": "Current Affairs", "questions": 30, "marks": 30, "type": "MCQ"},
                {"subject": "Aptitude for the Study of Law", "questions": 60, "marks": 60, "type": "MCQ"},
            ],
            "total_marks": 120,
            "duration": "1 Hour 30 Minutes",
            "marking_scheme": "+1 for correct, no negative marking",
        },
        "syllabus": {
            "pdf_link": "https://aplawcet.sche.aptonline.in/syllabus",
            "subjects": [
                {"name": "General Knowledge & Mental Ability", "topics": ["Reasoning Ability", "Numerical Aptitude", "General Awareness", "Spatial Reasoning", "Data Interpretation", "Analogies", "Coding-Decoding", "Series Completion"]},
                {"name": "Current Affairs", "topics": ["National & State Events", "International Affairs", "Government Schemes", "AP State News", "Legal News", "Science & Technology", "Sports & Awards", "Economic Updates"]},
                {"name": "Aptitude for Law", "topics": ["Constitutional Law Basics", "Fundamental Rights & Duties", "Contract Law Principles", "Torts Principles", "Criminal Law Basics", "Legal Maxims", "Family Law Basics", "Environmental Law Basics", "Recent Case Laws", "Legal Reasoning Passages"]},
            ],
        },
        "preparation_tips": [
            "AP LAWCET has no negative marking — attempt all 120 questions.",
            "Focus heavily on Aptitude for the Study of Law — it has 60 out of 120 marks.",
            "Read Telugu and English newspapers for AP-specific current affairs.",
            "Legal Aptitude does not require deep law knowledge — understand basic principles.",
            "Solve AP LAWCET previous year papers from 2010–2024.",
            "General Knowledge section covers both national and AP state-specific topics.",
            "The exam duration is short (90 minutes) — practice speed and accuracy.",
            "Current affairs from the last 6 months is most important for this exam.",
        ],
        "important_dates": [
            {"event": "Application Opens", "date": "March 2025"},
            {"event": "Last Date to Apply", "date": "April 2025"},
            {"event": "Admit Card Download", "date": "April 2025"},
            {"event": "AP LAWCET Exam", "date": "May 2025"},
            {"event": "Result Declaration", "date": "June 2025"},
            {"event": "Counselling", "date": "June–July 2025"},
        ],
        "pyqs": {
            "availability": "AP LAWCET PYQs from 2008–2024 available on the official portal and Hyderabad coaching institute websites.",
            "difficulty_trend": "Moderate difficulty. Legal Aptitude section is the most challenging. GK and Current Affairs are straightforward.",
            "recommended_sources": [
                "AP LAWCET Official Archive",
                "Arihant AP LAWCET Guide",
                "Local AP coaching institute materials",
            ],
        },
        "mock_tests": {
            "importance": "Mock tests for AP LAWCET help build the pace for 120 questions in 90 minutes. No negative marking makes full-attempt strategy viable.",
            "recommended_platforms": [
                "AP LAWCET Official Practice Portal",
                "Testbook AP LAWCET Tests",
                "Career360 AP Law Tests",
            ],
            "recommended_count": "10–15 full-length mocks are sufficient for AP LAWCET.",
        },
    },
    "created_at": ts(), "updated_at": ts(),
},

# ─────────────────────────────────────────
# MANAGEMENT
# ─────────────────────────────────────────
{
    "name": "CAT",
    "slug": "cat",
    "category": "Management",
    "conducting_body": "IIMs (rotates annually)",
    "official_website": "https://iimcat.ac.in",
    "exam_mode": "Computer Based Test (CBT)",
    "exam_level": "National",
    "tabs": {
        "overview": (
            "• Conducted By: IIMs (on rotation basis)\n"
            "• Purpose: Gateway to all 20 IIMs and 1,200+ management institutions\n"
            "• Frequency: Once a year (November)\n"
            "• Exam Level: National\n\n"
            "CAT is India's premier MBA entrance exam. Over 3.5 lakh candidates appear for ~5,000 IIM seats annually.\n\n"
            "• Subjects: VARC, DILR, Quantitative Aptitude\n"
            "• Strict 40-minute time limit per section\n"
            "• IIM ABC require 99.9+ percentile\n"
            "• Also accepted by: FMS Delhi, SPJIMR, MDI Gurgaon, IMT Ghaziabad"
        ),
        "application": (
            "• Mode: Online at iimcat.ac.in\n\n"
            "Step-by-Step Process:\n"
            "1. Register at iimcat.ac.in during the August application window\n"
            "2. Fill personal, academic, and work experience details\n"
            "3. Upload photo, signature, and graduation mark sheet\n"
            "4. Pay fee: ₹2400 (General/EWS/OBC) | ₹1200 (SC/ST/PwD)\n"
            "5. Download admit card in October\n"
            "6. Select session (Morning, Afternoon, or Evening) during registration"
        ),
        "eligibility": (
            "• Educational Qualification: Bachelor's degree with minimum 50% marks (45% for SC/ST/PwD)\n"
            "• Final year students are eligible\n"
            "• Age Limit: No age limit\n"
            "• Work Experience: Not mandatory — average at IIM ABC is 60+ months"
        ),
        "exam_pattern": {
            "description": "CBT — 66 questions in 2 hours with strict 40-minute sectional time limit",
            "sections": [
                {"subject": "Verbal Ability & Reading Comprehension (VARC)", "questions": 24, "marks": 72, "type": "MCQ + TITA (Type in the Answer)"},
                {"subject": "Data Interpretation & Logical Reasoning (DILR)", "questions": 20, "marks": 60, "type": "MCQ + TITA"},
                {"subject": "Quantitative Aptitude (QA)", "questions": 22, "marks": 66, "type": "MCQ + TITA"},
            ],
            "total_marks": 198,
            "duration": "2 Hours (40 minutes per section, strict)",
            "marking_scheme": "+3 for correct MCQ | -1 for wrong MCQ | TITA: no negative marking",
        },
        "syllabus": {
            "pdf_link": "https://iimcat.ac.in/per/g/public/cat/syllabus.html",
            "subjects": [
                {"name": "Verbal Ability & RC", "topics": ["Reading Comprehension (4–5 passages)", "Para Jumbles", "Para Summary", "Odd Sentence Identification", "Vocabulary in Context", "Inference Questions", "Author's Perspective", "Sentence Completion"]},
                {"name": "Data Interpretation & Logical Reasoning", "topics": ["Bar Graphs", "Line Charts", "Pie Charts", "Tables", "Caselets", "Logical Puzzles", "Seating Arrangements", "Blood Relations", "Games & Tournaments", "Binary Logic", "Sets & Venn Diagrams"]},
                {"name": "Quantitative Aptitude", "topics": ["Arithmetic (Ratio, %ages, Profit & Loss, TSD)", "Algebra (Linear, Quadratic Equations)", "Number Theory", "Geometry & Mensuration", "Coordinate Geometry", "Trigonometry", "Permutation & Combination", "Probability", "Progressions", "Functions & Graphs"]},
            ],
        },
        "preparation_tips": [
            "RC (Reading Comprehension) is the most important component — read quality content daily.",
            "DILR is the most unpredictable section — practice diverse puzzle types extensively.",
            "QA requires speed — aim for 70%+ accuracy with consistent pace.",
            "TITA questions have no negative marking — attempt all of them strategically.",
            "Solve at least 3 full-length CAT mocks per week from August to November.",
            "Analyse every mock deeply — understand why you got questions wrong.",
            "Target IIM-specific cut-offs: CAT 95%ile for IIM ABC shortlist typically requires 99.5%ile.",
            "Develop sectional strategies — don't spend too much time on any one question.",
        ],
        "important_dates": [
            {"event": "CAT Notification & Registration", "date": "August 2024"},
            {"event": "Last Date to Apply", "date": "September 2024"},
            {"event": "Admit Card Download", "date": "October 2024"},
            {"event": "CAT 2024 Exam", "date": "November 24, 2024"},
            {"event": "Result Declaration", "date": "January 2025"},
            {"event": "IIM Shortlist Announcements", "date": "January–February 2025"},
            {"event": "WAT-PI Rounds", "date": "February–April 2025"},
            {"event": "Final Admission Offers", "date": "April–May 2025"},
        ],
        "pyqs": {
            "availability": "CAT PYQs from 1990–2024 available on iimcat.ac.in and platforms like 2IIM, CL, IMS, and Career Launcher.",
            "difficulty_trend": "DILR difficulty fluctuates year to year. VARC has become more abstract post-2015. QA difficulty is moderate and stable.",
            "recommended_sources": [
                "IIM CAT Official Archive",
                "2IIM CAT Free Resources",
                "Career Launcher CAT QBank",
                "IMS CAT Previous Year Book",
                "TIME (T.I.M.E.) CAT PYQs",
            ],
        },
        "mock_tests": {
            "importance": "CAT mock tests are the single most important preparation tool. They simulate the exact interface, strict sectional limits, and TITA format.",
            "recommended_platforms": [
                "IIM CAT Official Mock",
                "2IIM CAT Free Mocks",
                "Career Launcher CATS Mock Series",
                "IMS SimCAT",
                "TIME AIMCAT Series",
            ],
            "recommended_count": "Attempt 30–40 full-length mocks from August to November. Analyse every mock for 2+ hours.",
        },
    },
    "created_at": ts(), "updated_at": ts(),
},

{
    "name": "XAT",
    "slug": "xat",
    "category": "Management",
    "conducting_body": "XLRI Jamshedpur",
    "official_website": "https://xatonline.in",
    "exam_mode": "Computer Based Test (CBT)",
    "exam_level": "National",
    "tabs": {
        "overview": (
            "• Conducted By: XLRI Jamshedpur\n"
            "• Purpose: Admissions to XLRI PGDM (HR) and PGDM (BM) — India's top HR and BM programs\n"
            "• Frequency: Once a year (January)\n"
            "• Exam Level: National\n\n"
            "XAT is accepted by 150+ institutes including XLRI, XIMB, IMT, TAPMI, LIBA, and IRMA. ~1 lakh candidates appear annually.\n\n"
            "• Unique: Decision Making section and Essay Writing\n"
            "• Penalty for unattempted questions beyond 8\n"
            "• XLRI HR is ranked #1 for HR education in India"
        ),
        "application": (
            "• Mode: Online at xatonline.in\n\n"
            "Step-by-Step Process:\n"
            "1. Register at xatonline.in\n"
            "2. Fill personal, academic, and work experience details\n"
            "3. Upload photo and signature\n"
            "4. Pay fee: ₹2100 (XAT only) | ₹300 additional per XLRI program\n"
            "5. Download admit card in December\n"
            "6. Report to exam centre with admit card and photo ID"
        ),
        "eligibility": (
            "• Educational Qualification: Bachelor's degree in any discipline with minimum 50% marks\n"
            "• Final year students are eligible\n"
            "• Age Limit: No age limit\n"
            "• Work Experience: Not mandatory but XLRI favours experienced candidates"
        ),
        "exam_pattern": {
            "description": "CBT — 101 MCQ questions in 165 minutes + 10-minute Essay",
            "sections": [
                {"subject": "Verbal Ability & Logical Reasoning (VALR)", "questions": 26, "marks": 26, "type": "MCQ"},
                {"subject": "Decision Making (DM)", "questions": 21, "marks": 21, "type": "MCQ"},
                {"subject": "Quantitative Ability & Data Interpretation (QADI)", "questions": 28, "marks": 28, "type": "MCQ"},
                {"subject": "General Knowledge (GK)", "questions": 25, "marks": 25, "type": "MCQ — not counted in percentile for most institutes"},
                {"subject": "Essay Writing", "questions": 1, "marks": "Evaluated separately by XLRI", "type": "Subjective"},
            ],
            "total_marks": 100,
            "duration": "165 minutes (MCQ) + 10 minutes (Essay)",
            "marking_scheme": "+1 for correct | -0.25 for incorrect | Penalty for >8 unattempted questions in main sections",
        },
        "syllabus": {
            "pdf_link": "https://xatonline.in/syllabus",
            "subjects": [
                {"name": "Verbal Ability & Logical Reasoning", "topics": ["Reading Comprehension", "Para Completion", "Vocabulary", "Grammar", "Critical Reasoning", "Logical Deduction", "Analogies", "Syllogisms"]},
                {"name": "Decision Making", "topics": ["Business Scenarios", "Ethical Dilemmas", "Data Sufficiency", "Analytical Reasoning", "Case-Based Decisions", "Situational Judgement", "Group Decision-Making Scenarios"]},
                {"name": "Quantitative Ability & DI", "topics": ["Arithmetic", "Algebra", "Geometry", "Number Theory", "Permutation & Combination", "Probability", "Bar Charts", "Line Graphs", "Tables", "Caselets"]},
                {"name": "General Knowledge", "topics": ["Business & Economy", "Corporate GK", "Science & Technology", "National & International Affairs", "Sports", "Literature & Arts"]},
                {"name": "Essay Writing", "topics": ["Contemporary Social Issues", "Business Ethics", "Economic Topics", "Technology & Society", "Abstract Topics"]},
            ],
        },
        "preparation_tips": [
            "Decision Making is unique to XAT — practice business ethics and dilemma-based questions.",
            "XAT penalises unattempted questions beyond 8 — manage time and attempt strategically.",
            "Prepare an essay on current business and social issues — practice 1 essay per week.",
            "GK for XAT focuses on business and economic news — go beyond general knowledge.",
            "XAT's Logical Reasoning is more argument-heavy than CAT — practise critical thinking.",
            "XAT is generally harder than CAT in Verbal and DM sections — set your difficulty expectations accordingly.",
            "Join XAT-specific mock series from 2IIM, Career Launcher, or IMS.",
            "Understand XLRI's selection process: XAT score + GK + Essay + GD-PI.",
        ],
        "important_dates": [
            {"event": "Registration Opens", "date": "July 2024"},
            {"event": "Last Date to Register", "date": "November 2024"},
            {"event": "Admit Card Download", "date": "December 2024"},
            {"event": "XAT 2025 Exam", "date": "January 5, 2025"},
            {"event": "Result Declaration", "date": "January 2025"},
            {"event": "XLRI GD-PI Calls", "date": "February 2025"},
            {"event": "Final Admission Offers", "date": "April 2025"},
        ],
        "pyqs": {
            "availability": "XAT PYQs from 2008–2024 available on xatonline.in and coaching portals.",
            "difficulty_trend": "XAT is harder than CAT. Decision Making is the most unique and difficult section. Verbal section has complex comprehension passages.",
            "recommended_sources": [
                "XLRI Official XAT Archive",
                "2IIM XAT Resources",
                "Career Launcher XAT Book",
                "TIME XAT PYQs",
            ],
        },
        "mock_tests": {
            "importance": "XAT mocks must include the Decision Making section — this is not tested in CAT mocks. Essay writing practice is also essential.",
            "recommended_platforms": [
                "XLRI Official XAT Mock",
                "Career Launcher XAT Mocks",
                "IMS XAT Test Series",
                "TIME XAT Mocks",
            ],
            "recommended_count": "15–20 full-length XAT mocks. Practice essay writing separately 2x per week.",
        },
    },
    "created_at": ts(), "updated_at": ts(),
},

{
    "name": "MAT",
    "slug": "mat",
    "category": "Management",
    "conducting_body": "All India Management Association (AIMA)",
    "official_website": "https://mat.aima.in",
    "exam_mode": "Online (CBT) / Offline (PBT) / Remote Proctored",
    "exam_level": "National",
    "tabs": {
        "overview": (
            "• Conducted By: All India Management Association (AIMA)\n"
            "• Purpose: Admissions to MBA/PGDM programs at 600+ management institutes\n"
            "• Frequency: Four times a year — February, May, September, December\n"
            "• Exam Level: National\n\n"
            "MAT is one of India's most accessible MBA entrance exams. It can be taken in PBT, CBT, or remote proctored (IBT) mode — making it popular among working professionals.\n\n"
            "• Accepts: IMT Nagpur, Amity Business School, IFIM, IPE Hyderabad, and 600+ others\n"
            "• GK section is not counted in composite score for most institutes\n"
            "• Multiple attempts in a year help improve scores"
        ),
        "application": (
            "• Mode: Online at mat.aima.in\n\n"
            "Step-by-Step Process:\n"
            "1. Register at mat.aima.in\n"
            "2. Fill personal, academic, and work experience details\n"
            "3. Upload photo and signature\n"
            "4. Select mode (PBT/CBT/IBT) and date preference\n"
            "5. Pay fee: ₹2100 (single mode) | ₹3600 (2 modes in same session)\n"
            "6. Download admit card from the portal"
        ),
        "eligibility": (
            "• Educational Qualification: Bachelor's degree in any discipline\n"
            "• Minimum Marks: 50% in graduation (varies by institute)\n"
            "• Final year students are eligible\n"
            "• Age Limit: No age limit\n"
            "• Work experience not mandatory"
        ),
        "exam_pattern": {
            "description": "150 questions in 2 hours 30 minutes — 5 sections of 40 questions each",
            "sections": [
                {"subject": "Language Comprehension", "questions": 40, "marks": 40, "type": "MCQ"},
                {"subject": "Mathematical Skills", "questions": 40, "marks": 40, "type": "MCQ"},
                {"subject": "Data Analysis & Sufficiency", "questions": 40, "marks": 40, "type": "MCQ"},
                {"subject": "Intelligence & Critical Reasoning", "questions": 40, "marks": 40, "type": "MCQ"},
                {"subject": "Indian & Global Environment (GK)", "questions": 40, "marks": 40, "type": "MCQ — not counted in composite score for most institutes"},
            ],
            "total_marks": 200,
            "duration": "2 Hours 30 Minutes",
            "marking_scheme": "+1 for correct, -0.25 for incorrect",
        },
        "syllabus": {
            "pdf_link": "https://mat.aima.in/syllabus",
            "subjects": [
                {"name": "Language Comprehension", "topics": ["Reading Comprehension", "Grammar & Usage", "Vocabulary", "Para Jumbles", "Sentence Correction", "Fill in the Blanks", "Idioms & Phrases"]},
                {"name": "Mathematical Skills", "topics": ["Arithmetic", "Percentage & Profit/Loss", "Simple & Compound Interest", "Time, Speed & Distance", "Algebra", "Geometry", "Mensuration", "Number Systems", "Permutations & Combinations", "Probability"]},
                {"name": "Data Analysis & Sufficiency", "topics": ["Bar Charts", "Line Graphs", "Pie Charts", "Tables", "Data Sufficiency", "Caselets", "Data Comparison"]},
                {"name": "Intelligence & Critical Reasoning", "topics": ["Logical Sequences", "Blood Relations", "Direction Sense", "Syllogisms", "Clocks & Calendars", "Coding-Decoding", "Critical Reasoning", "Venn Diagrams"]},
                {"name": "GK (Indian & Global)", "topics": ["Current Affairs", "Business & Economy", "International Events", "Sports", "Science & Technology", "Awards & Honours"]},
            ],
        },
        "preparation_tips": [
            "MAT is moderate difficulty — a well-structured 2-month preparation is sufficient.",
            "GK section is not counted in composite score for most institutes — don't over-invest here.",
            "Mathematical Skills and Data Analysis are the key differentiators.",
            "Practice previous MAT papers — they are available on the AIMA website.",
            "Verbal section is straightforward — score full marks with consistent grammar practice.",
            "Attend mock tests to calibrate your timing across the 5 sections.",
            "Research the institute's cut-off for MAT score before applying.",
            "Consider multiple attempts in a year to improve your composite score.",
        ],
        "important_dates": [
            {"event": "MAT February Registration", "date": "January 2025"},
            {"event": "MAT February Exam (PBT)", "date": "February 2025"},
            {"event": "MAT February Exam (CBT)", "date": "February 2025"},
            {"event": "MAT May Session", "date": "May 2025"},
            {"event": "MAT September Session", "date": "September 2025"},
            {"event": "MAT December Session", "date": "December 2025"},
        ],
        "pyqs": {
            "availability": "MAT PYQs from 2010–2024 available on aima.in and coaching portals.",
            "difficulty_trend": "Moderate difficulty. Consistent pattern across all sessions. Data Analysis is the most time-consuming section.",
            "recommended_sources": [
                "AIMA Official MAT Practice Papers",
                "Arihant MAT Guide",
                "Disha MAT Practice Papers",
            ],
        },
        "mock_tests": {
            "importance": "MAT mock tests help you master the 5-section 150-question format within 150 minutes.",
            "recommended_platforms": [
                "AIMA Official MAT Mocks",
                "Testbook MAT Mocks",
                "Embibe MAT Practice",
            ],
            "recommended_count": "10–15 full-length mocks are sufficient for MAT.",
        },
    },
    "created_at": ts(), "updated_at": ts(),
},

{
    "name": "CMAT",
    "slug": "cmat",
    "category": "Management",
    "conducting_body": "National Testing Agency (NTA)",
    "official_website": "https://cmat.nta.nic.in",
    "exam_mode": "Computer Based Test (CBT)",
    "exam_level": "National",
    "tabs": {
        "overview": (
            "• Conducted By: National Testing Agency (NTA)\n"
            "• Purpose: Admissions to AICTE-approved PGDM and MBA programs\n"
            "• Frequency: Once a year (May)\n"
            "• Exam Level: National\n\n"
            "CMAT is accepted by 1,000+ management institutes. "
            "Top colleges accepting CMAT: GIM Goa, XIME, SIMSREE, K.J. Somaiya.\n\n"
            "• Unique Section: Innovation & Entrepreneurship (unique to CMAT)\n"
            "• Easier than CAT and XAT — ideal for targeting top non-IIM colleges\n"
            "• High-scoring exam — aim for 300+ out of 400 for top colleges"
        ),
        "application": (
            "• Mode: Online at cmat.nta.nic.in\n\n"
            "Step-by-Step Process:\n"
            "1. Register at cmat.nta.nic.in\n"
            "2. Fill personal, academic, and work experience details\n"
            "3. Upload photo and signature\n"
            "4. Pay fee: ₹2000 (General/OBC) | ₹1000 (SC/ST/PwD)\n"
            "5. Select exam city preferences (up to 4)\n"
            "6. Download admit card 1 week before the exam"
        ),
        "eligibility": (
            "• Educational Qualification: Bachelor's degree with minimum 50% marks (45% for SC/ST/PwD)\n"
            "• Final year students are eligible\n"
            "• Age Limit: No age limit\n"
            "• Both freshers and experienced candidates are eligible"
        ),
        "exam_pattern": {
            "description": "CBT — 100 questions in 3 hours",
            "sections": [
                {"subject": "Quantitative Techniques & Data Interpretation", "questions": 20, "marks": 80, "type": "MCQ"},
                {"subject": "Logical Reasoning", "questions": 20, "marks": 80, "type": "MCQ"},
                {"subject": "Language Comprehension", "questions": 20, "marks": 80, "type": "MCQ"},
                {"subject": "General Awareness", "questions": 20, "marks": 80, "type": "MCQ"},
                {"subject": "Innovation & Entrepreneurship", "questions": 20, "marks": 80, "type": "MCQ"},
            ],
            "total_marks": 400,
            "duration": "3 Hours",
            "marking_scheme": "+4 for correct, -1 for incorrect",
        },
        "syllabus": {
            "pdf_link": "https://cmat.nta.nic.in/syllabus",
            "subjects": [
                {"name": "Quantitative Techniques & DI", "topics": ["Arithmetic", "Algebra", "Geometry", "Number Theory", "Percentages", "Profit & Loss", "Time & Work", "Speed & Distance", "Data Tables", "Charts & Graphs", "Data Sufficiency"]},
                {"name": "Logical Reasoning", "topics": ["Series Completion", "Coding-Decoding", "Blood Relations", "Syllogisms", "Statement-Conclusions", "Clocks", "Direction Sense", "Seating Arrangements", "Puzzles", "Input-Output"]},
                {"name": "Language Comprehension", "topics": ["Reading Comprehension", "Fill in the Blanks", "Para Jumbles", "Sentence Correction", "Idioms & Phrases", "Vocabulary", "Grammar"]},
                {"name": "General Awareness", "topics": ["Current Affairs (National & International)", "Business & Economy", "Banking & Finance", "Sports", "Awards & Honours", "Science & Technology", "Static GK"]},
                {"name": "Innovation & Entrepreneurship", "topics": ["Startup Ecosystem in India", "Government Schemes (Startup India, Atal Innovation Mission)", "Business Innovation Concepts", "Case Studies on Indian Entrepreneurs", "Social Entrepreneurship", "Design Thinking Basics", "Digital Economy"]},
            ],
        },
        "preparation_tips": [
            "Innovation & Entrepreneurship section is unique to CMAT — study Startup India, Atal Innovation Mission, and unicorn startups.",
            "General Awareness is straightforward but requires consistent current affairs reading.",
            "Quantitative section is simpler than CAT — focus on speed and accuracy.",
            "Solve CMAT previous 5 years' papers — they are the best resource.",
            "Language Comprehension rewards reading habit — read newspapers and editorials.",
            "CMAT is a high-scoring exam: aim for 300+ out of 400 for top colleges.",
            "Logical Reasoning is predictable — master standard question types.",
            "Research CMAT-accepting colleges: GIM Goa and XIME are excellent for good scorers.",
        ],
        "important_dates": [
            {"event": "Application Opens", "date": "February 2025"},
            {"event": "Last Date to Apply", "date": "March 2025"},
            {"event": "Admit Card Download", "date": "April 2025"},
            {"event": "CMAT 2025 Exam", "date": "May 2025"},
            {"event": "Answer Key Release", "date": "May 2025"},
            {"event": "Result Declaration", "date": "May–June 2025"},
        ],
        "pyqs": {
            "availability": "CMAT PYQs from 2012–2024 available on cmat.nta.nic.in and coaching portals.",
            "difficulty_trend": "Moderate. Innovation & Entrepreneurship is unique and requires current awareness. QA and LR are straightforward.",
            "recommended_sources": [
                "NTA Official CMAT Practice Papers",
                "Arihant CMAT Guide",
                "Disha CMAT Question Bank",
            ],
        },
        "mock_tests": {
            "importance": "CMAT mock tests must include all 5 sections. The Innovation section requires topical awareness — practice alongside mocks.",
            "recommended_platforms": [
                "NTA Official CMAT Mock",
                "Career Launcher CMAT Mocks",
                "Testbook CMAT Practice",
            ],
            "recommended_count": "15–20 full-length mocks from 2 months before the exam.",
        },
    },
    "created_at": ts(), "updated_at": ts(),
},

{
    "name": "NMAT",
    "slug": "nmat",
    "category": "Management",
    "conducting_body": "GMAC (Graduate Management Admission Council)",
    "official_website": "https://www.nmat.org",
    "exam_mode": "Computer Based Test (CBT) — Online Proctored",
    "exam_level": "National",
    "tabs": {
        "overview": (
            "• Conducted By: GMAC (Graduate Management Admission Council)\n"
            "• Purpose: Admissions to MBA programs at NMIMS Mumbai, SPJIMR, ISB Hyderabad, and other top institutes\n"
            "• Frequency: Once a year with a 75-day testing window (October–December)\n"
            "• Exam Level: National\n\n"
            "NMAT (NMIMS Management Aptitude Test) is one of India's most prestigious MBA entrance exams. "
            "It has a flexible testing window with up to 3 attempts allowed.\n\n"
            "• Primary Institution: NMIMS Mumbai — one of India's top 5 MBA programs\n"
            "• Also Accepted By: SPJIMR, ISB Hyderabad, MICA, SDA Bocconi, Woxsen, GITAM, UPES\n"
            "• Unique: Candidates can choose section order and retake up to 3 times\n"
            "• No negative marking"
        ),
        "application": (
            "• Mode: Online at nmat.org\n\n"
            "Step-by-Step Process:\n"
            "1. Register at nmat.org and create a GMAC account\n"
            "2. Fill personal, academic, and work experience details\n"
            "3. Upload photo and valid government ID\n"
            "4. Pay exam fee: ₹2800 (first attempt) | ₹2800 per retake\n"
            "5. Schedule your exam date from the 75-day window\n"
            "6. Appear online from home with webcam or at designated test centres\n"
            "7. Score reports are sent to selected institutes directly"
        ),
        "eligibility": (
            "• Educational Qualification: Bachelor's degree in any discipline with minimum 50% marks\n"
            "• Final year students are eligible\n"
            "• Age Limit: No upper age limit\n"
            "• Nationality: Indian nationals and foreign nationals\n"
            "• Work Experience: Not mandatory — NMIMS accepts freshers and experienced candidates"
        ),
        "exam_pattern": {
            "description": "CBT Online — 108 questions in 2 hours (120 minutes), candidates choose section order",
            "sections": [
                {"subject": "Language Skills", "questions": 36, "marks": 36, "type": "MCQ"},
                {"subject": "Quantitative Skills", "questions": 36, "marks": 36, "type": "MCQ"},
                {"subject": "Logical Reasoning", "questions": 36, "marks": 36, "type": "MCQ"},
            ],
            "total_marks": 360,
            "duration": "2 Hours (120 minutes total — candidates allocate time per section)",
            "marking_scheme": "+1 for correct, no negative marking",
        },
        "syllabus": {
            "pdf_link": "https://www.nmat.org/test/preparation",
            "subjects": [
                {"name": "Language Skills", "topics": ["Reading Comprehension", "Vocabulary", "Grammar & Sentence Correction", "Para Jumbles", "Fill in the Blanks", "Cloze Passage", "Analogies", "Idioms & Phrases"]},
                {"name": "Quantitative Skills", "topics": ["Arithmetic — Percentages, Ratio, Profit & Loss, TSD", "Algebra — Equations, Functions", "Number Systems", "Geometry & Mensuration", "Data Interpretation — Tables, Charts, Graphs", "Data Sufficiency", "Modern Maths — P&C, Probability, Progressions"]},
                {"name": "Logical Reasoning", "topics": ["Arrangements & Seating", "Blood Relations", "Direction Sense", "Coding-Decoding", "Syllogisms", "Statement-Conclusions", "Critical Reasoning", "Puzzles", "Input-Output", "Series Completion"]},
            ],
        },
        "preparation_tips": [
            "No negative marking in NMAT — attempt all 108 questions confidently.",
            "Choose your section order strategically — start with your strongest section.",
            "NMIMS Mumbai requires a scaled score of 215+ (out of 360) for a shortlist.",
            "Language Skills is generally the easiest section for most candidates — score full marks.",
            "NMAT Quantitative Skills is similar to CAT QA but slightly easier — focus on speed.",
            "Up to 3 attempts allowed — use the first as a benchmark and improve in subsequent attempts.",
            "Practice NMAT Official Prep Material on nmat.org — it's the most accurate resource.",
            "Time yourself strictly — 120 minutes for 108 questions requires ~67 seconds per question.",
        ],
        "important_dates": [
            {"event": "NMAT Registration Opens", "date": "August 2025"},
            {"event": "Last Date to Register", "date": "October 2025"},
            {"event": "NMAT Testing Window", "date": "October–December 2025"},
            {"event": "Score Announcement", "date": "Within 48 hours of exam"},
            {"event": "NMIMS Shortlist Announcement", "date": "January 2026"},
            {"event": "NMIMS GDPI Rounds", "date": "February–March 2026"},
            {"event": "Final Admission Offers", "date": "April 2026"},
        ],
        "pyqs": {
            "availability": "GMAC provides official NMAT practice tests on nmat.org. Third-party PYQs available on coaching portals.",
            "difficulty_trend": "Moderate difficulty. No negative marking makes it less stressful than CAT. Language Skills is easiest; Logical Reasoning is most time-intensive.",
            "recommended_sources": [
                "GMAC Official NMAT Practice Tests — nmat.org",
                "Career Launcher NMAT Prep Material",
                "Wizako NMAT Resources",
                "2IIM NMAT Practice",
            ],
        },
        "mock_tests": {
            "importance": "NMAT mock tests simulate the flexible section-order format. Practising with different section orders helps find the optimal strategy.",
            "recommended_platforms": [
                "GMAC Official NMAT Mocks — nmat.org",
                "Career Launcher NMAT Test Series",
                "Embibe NMAT Mocks",
                "Testbook NMAT Practice",
            ],
            "recommended_count": "Minimum 10 full-length mocks per attempt. With 3 attempts, aim for 25+ total mocks.",
        },
    },
    "created_at": ts(), "updated_at": ts(),
},

# ─────────────────────────────────────────
# GOVERNMENT
# ─────────────────────────────────────────
{
    "name": "UPSC CSE",
    "slug": "upsc",
    "category": "Government",
    "conducting_body": "Union Public Service Commission (UPSC)",
    "official_website": "https://www.upsc.gov.in",
    "exam_mode": "Offline (Written + Interview)",
    "exam_level": "National",
    "tabs": {
        "overview": (
            "• Conducted By: Union Public Service Commission (UPSC)\n"
            "• Purpose: Recruitment to Indian Administrative Service (IAS), Indian Police Service (IPS), Indian Foreign Service (IFS), and 24 other All India and Central Services\n"
            "• Frequency: Once a year\n"
            "• Exam Level: National\n\n"
            "UPSC CSE (Civil Services Examination) is considered India's most prestigious and competitive examination. "
            "Only ~1,000 candidates are selected from over 10 lakh applicants annually.\n\n"
            "Three Stages:\n"
            "• Stage 1: Preliminary Exam (Prelims) — Objective, qualifying in nature\n"
            "• Stage 2: Main Exam (Mains) — Descriptive, 9 papers, merit-based\n"
            "• Stage 3: Personality Test (Interview) — 275 marks\n\n"
            "• Total Vacancies: ~1,000 per year\n"
            "• Top Service: IAS (Indian Administrative Service)"
        ),
        "application": (
            "• Mode: Online at upsc.gov.in\n\n"
            "Step-by-Step Process:\n"
            "1. Register at upsconline.nic.in for OTR (One Time Registration)\n"
            "2. Fill CSE application form during notification period (February–March)\n"
            "3. Fill personal, academic, and contact details\n"
            "4. Upload photo and signature\n"
            "5. Pay fee: ₹100 (General/OBC) | Exempt: SC/ST/Female/PwD\n"
            "6. Download admit card before Prelims (June)\n"
            "7. Separate DAF (Detailed Application Form) to be filled after Prelims qualify"
        ),
        "eligibility": (
            "• Nationality: Indian citizen (for IAS/IPS). Some services allow foreign nationals\n"
            "• Age Limit: 21–32 years (General) | 21–35 years (OBC) | 21–37 years (SC/ST) | 21–42 years (PwD)\n"
            "• Educational Qualification: Any bachelor's degree from a recognised university\n"
            "• Attempts: 6 (General) | 9 (OBC) | Unlimited until age limit (SC/ST) | 9 (PwD)\n"
            "• Appearing candidates in final year are also eligible for Prelims"
        ),
        "exam_pattern": {
            "description": "Three-stage exam: Prelims (objective) → Mains (descriptive) → Interview",
            "sections": [
                {"subject": "Prelims Paper I — General Studies", "questions": 100, "marks": 200, "type": "MCQ — 2 hours"},
                {"subject": "Prelims Paper II — CSAT (Aptitude)", "questions": 80, "marks": 200, "type": "MCQ — 2 hours (qualifying, minimum 33%)"},
                {"subject": "Mains Paper I — Essay", "questions": "2 essays", "marks": 250, "type": "Descriptive"},
                {"subject": "Mains GS Paper I (History, Geography)", "questions": "20 questions", "marks": 250, "type": "Descriptive"},
                {"subject": "Mains GS Paper II (Polity, Governance, IR)", "questions": "20 questions", "marks": 250, "type": "Descriptive"},
                {"subject": "Mains GS Paper III (Economy, Science, Environment)", "questions": "20 questions", "marks": 250, "type": "Descriptive"},
                {"subject": "Mains GS Paper IV (Ethics, Integrity)", "questions": "14 questions", "marks": 250, "type": "Descriptive"},
                {"subject": "Optional Paper I + II", "questions": "Various", "marks": "500 total", "type": "Descriptive"},
                {"subject": "Personality Test (Interview)", "questions": "Panel Discussion", "marks": 275, "type": "Interview"},
            ],
            "total_marks": 2025,
            "duration": "Prelims: 2 days | Mains: 9 days | Interview: ~30 minutes",
            "marking_scheme": "Prelims: +2 correct, -0.66 wrong (MCQ) | Mains: no negative | Interview: holistic assessment",
        },
        "syllabus": {
            "pdf_link": "https://www.upsc.gov.in/examinations/syllabi",
            "subjects": [
                {"name": "Prelims GS Paper I", "topics": ["Indian History & Culture", "Indian & World Geography", "Indian Polity & Governance", "Economic & Social Development", "General Science", "Current Events — National & International", "Environmental Ecology & Climate Change", "Biodiversity"]},
                {"name": "Prelims CSAT Paper II", "topics": ["Comprehension", "Interpersonal & Communication Skills", "Logical Reasoning & Analytical Ability", "Decision Making", "General Mental Ability", "Basic Numeracy (Class 10 level)", "Data Interpretation"]},
                {"name": "Mains GS I", "topics": ["Indian Heritage & Culture", "History of Modern India", "World History (18th Century onwards)", "Post-Independence Consolidation", "Physical Geography", "Human Geography", "Indian Society & Social Issues"]},
                {"name": "Mains GS II", "topics": ["Indian Constitution", "Functions & Responsibilities of Union & States", "Parliament & State Legislatures", "Separation of Powers", "Governance & Accountability", "Social Justice", "International Relations", "India & its Neighbourhood"]},
                {"name": "Mains GS III", "topics": ["Indian Economy", "Agriculture", "Science & Technology", "Environment & Ecology", "Disaster Management", "Infrastructure", "Internal Security", "Challenges to Internal Security"]},
                {"name": "Mains GS IV (Ethics)", "topics": ["Ethics & Human Interface", "Attitudes", "Aptitude & Values", "Emotional Intelligence", "Public/Civil Service Values", "Probity in Governance", "Case Studies in Ethics"]},
                {"name": "Essay", "topics": ["Social Issues", "Governance", "Philosophy & Abstracts", "Economy", "Science & Technology", "International Relations", "Women & Gender Issues"]},
            ],
        },
        "preparation_tips": [
            "UPSC preparation requires minimum 1–2 years of dedicated study — plan a long-term strategy.",
            "NCERT books (Class 6–12) for History, Geography, Polity, Economy, and Science are the foundation.",
            "Read The Hindu or Indian Express daily — current affairs are crucial for both Prelims and Mains.",
            "Optional subject selection is critical — choose a subject you enjoy and can score high in.",
            "Mains answer writing practice must begin from day 1 — aim for 10–15 answers per week.",
            "For Ethics (GS IV), study case studies thoroughly and develop a personal value framework.",
            "Revise extensively — UPSC rewards retention and recall, not just first-time reading.",
            "Mock interviews are essential — join a reputable institute for PI preparation.",
        ],
        "important_dates": [
            {"event": "UPSC CSE Notification", "date": "February 2025"},
            {"event": "Application Opens", "date": "February 2025"},
            {"event": "Last Date to Apply", "date": "March 2025"},
            {"event": "Prelims Exam", "date": "May 25, 2025"},
            {"event": "Prelims Result", "date": "July 2025"},
            {"event": "Mains Exam", "date": "September 2025"},
            {"event": "Mains Result", "date": "December 2025"},
            {"event": "Personality Test (Interview)", "date": "January–April 2026"},
            {"event": "Final Result", "date": "April–May 2026"},
        ],
        "pyqs": {
            "availability": "UPSC CSE PYQs from 1979–2024 freely available on upsc.gov.in and coaching portals.",
            "difficulty_trend": "Prelims GS difficulty increasing yearly. Dynamic questions replacing static ones. Mains requires nuanced, multi-dimensional answers. CSAT becoming slightly easier.",
            "recommended_sources": [
                "UPSC Official Archive — upsc.gov.in",
                "Vision IAS Prelims PYQ Book",
                "Insights on India PYQ Discussion",
                "Drishti IAS Mains PYQ Analysis",
                "ForumIAS Discussion Forum",
            ],
        },
        "mock_tests": {
            "importance": "Mock tests for Prelims simulate the MCQ pressure and negative marking. Mains tests require actual answer writing under timed conditions — this is non-negotiable.",
            "recommended_platforms": [
                "Insights on India Test Series",
                "Vision IAS Prelims Test Series",
                "Forum IAS (ForumIAS.com)",
                "Drishti IAS Test Series",
                "ClearIAS Mock Prelims",
            ],
            "recommended_count": "30+ Prelims mocks | 20+ Mains sectional tests | 5+ full Mains mock examinations.",
        },
    },
    "created_at": ts(), "updated_at": ts(),
},

{
    "name": "SSC CGL",
    "slug": "ssc-cgl",
    "category": "Government",
    "conducting_body": "Staff Selection Commission (SSC)",
    "official_website": "https://ssc.nic.in",
    "exam_mode": "Computer Based Test (CBT)",
    "exam_level": "National",
    "tabs": {
        "overview": (
            "• Conducted By: Staff Selection Commission (SSC)\n"
            "• Purpose: Recruitment to Group B and Group C posts in Central Government Ministries and Departments\n"
            "• Frequency: Once a year (notification in April, Tier I in July–August)\n"
            "• Exam Level: National\n\n"
            "SSC CGL (Combined Graduate Level) is one of India's most popular government job exams. "
            "Posts include Income Tax Inspector, Central Excise Inspector, Assistant Section Officer, Auditor, and more.\n\n"
            "• Two Tiers: Tier I (Screening) + Tier II (Merit)\n"
            "• Vacancies: 10,000–20,000 posts per cycle\n"
            "• Top Posts: Inspector (IT/CE), ASO (MEA/Ministry), Statistical Investigator (Grade II)"
        ),
        "application": (
            "• Mode: Online at ssc.nic.in\n\n"
            "Step-by-Step Process:\n"
            "1. Register at ssc.nic.in with One-Time Registration\n"
            "2. Fill CGL application form during notification period\n"
            "3. Fill personal, educational, and contact details\n"
            "4. Upload photo and signature\n"
            "5. Pay fee: ₹100 (General/OBC) | Exempt: SC/ST/Female/ExSM/PwD\n"
            "6. Receive admit card before exam date"
        ),
        "eligibility": (
            "• Nationality: Indian citizen\n"
            "• Age Limit: 18–27 years (varies by post — 18–30 or 20–30 for some posts)\n"
            "   – OBC: +3 years | SC/ST: +5 years | PwD: +10 years\n"
            "• Educational Qualification: Bachelor's degree from a recognised university\n"
            "• No prior work experience required"
        ),
        "exam_pattern": {
            "description": "Two-Tier CBT examination",
            "sections": [
                {"subject": "Tier I — General Intelligence & Reasoning", "questions": 25, "marks": 50, "type": "MCQ"},
                {"subject": "Tier I — General Awareness", "questions": 25, "marks": 50, "type": "MCQ"},
                {"subject": "Tier I — Quantitative Aptitude", "questions": 25, "marks": 50, "type": "MCQ"},
                {"subject": "Tier I — English Language", "questions": 25, "marks": 50, "type": "MCQ"},
                {"subject": "Tier II Paper I — Mathematical Abilities", "questions": 30, "marks": 90, "type": "MCQ"},
                {"subject": "Tier II Paper I — Reasoning & GI", "questions": 30, "marks": 90, "type": "MCQ"},
                {"subject": "Tier II Paper I — English Language", "questions": 45, "marks": 135, "type": "MCQ"},
                {"subject": "Tier II Paper I — GK & Awareness", "questions": 25, "marks": 75, "type": "MCQ"},
                {"subject": "Tier II Paper I — Computer Knowledge", "questions": 20, "marks": 60, "type": "MCQ"},
            ],
            "total_marks": 700,
            "duration": "Tier I: 60 minutes | Tier II: 2 hours 30 minutes per paper",
            "marking_scheme": "Tier I: +2 correct, -0.5 wrong | Tier II Paper I: +3 correct, -1 wrong",
        },
        "syllabus": {
            "pdf_link": "https://ssc.nic.in/Portal/Syllabus",
            "subjects": [
                {"name": "General Intelligence & Reasoning", "topics": ["Analogies", "Coding-Decoding", "Blood Relations", "Direction Sense", "Series Completion", "Syllogisms", "Matrix Problems", "Venn Diagrams", "Puzzles", "Non-Verbal Reasoning (Figure Series)", "Statement-Conclusions"]},
                {"name": "General Awareness", "topics": ["Indian History", "Indian Polity & Constitution", "Indian Economy", "Geography (India & World)", "Static GK", "Current Affairs (6 months)", "Science & Technology", "Environmental Science", "Awards & Honours", "Books & Authors", "Sports"]},
                {"name": "Quantitative Aptitude", "topics": ["Number Systems", "Percentage", "Ratio & Proportion", "Profit & Loss", "Simple & Compound Interest", "Time & Work", "Time, Speed & Distance", "Algebra", "Geometry & Mensuration", "Trigonometry", "Data Interpretation", "Statistics"]},
                {"name": "English Language", "topics": ["Reading Comprehension", "Error Spotting", "Fill in the Blanks", "Sentence Improvement", "Synonyms & Antonyms", "One-Word Substitution", "Idioms & Phrases", "Para Jumbles", "Cloze Test", "Active/Passive Voice", "Direct/Indirect Speech"]},
                {"name": "Computer Knowledge", "topics": ["Computer Fundamentals", "MS Office", "Internet Basics", "Keyboard Shortcuts", "Input/Output Devices", "Network Basics", "Cyber Security Basics"]},
            ],
        },
        "preparation_tips": [
            "SSC CGL Tier I is the most competitive stage — aim for 150+ out of 200 for a safe shortlist.",
            "General Awareness is the most time-efficient section — revise static GK daily for 30 minutes.",
            "Quantitative Aptitude requires speed — master shortcuts for percentage, ratio, and time-speed-distance.",
            "English section is scoring — study grammar rules and vocabulary daily.",
            "Solve at least 50 previous year papers from Kiran or Rakesh Yadav publications.",
            "Tier II English and Maths are more detailed — dedicate separate preparation time.",
            "Current affairs from the last 6 months is essential for GA section.",
            "Join SSC test series from platforms like SSCAdda or Testbook for daily practice.",
        ],
        "important_dates": [
            {"event": "SSC CGL Notification", "date": "April 2025"},
            {"event": "Application Opens", "date": "April 2025"},
            {"event": "Last Date to Apply", "date": "May 2025"},
            {"event": "Tier I Exam", "date": "July–August 2025"},
            {"event": "Tier I Result", "date": "September 2025"},
            {"event": "Tier II Exam", "date": "November–December 2025"},
            {"event": "Final Result", "date": "March 2026"},
        ],
        "pyqs": {
            "availability": "SSC CGL PYQs from 1999–2024 available on ssc.nic.in and coaching portals like Adda247 and Kiran Publications.",
            "difficulty_trend": "Reasoning and Maths difficulty increasing. English paper in Tier II has become more grammar-focused. GA is the most static-stable section.",
            "recommended_sources": [
                "Kiran SSC CGL Chapterwise PYQs",
                "Rakesh Yadav SSC Mathematics",
                "Arihant SSC CGL Guide",
                "SSCAdda247 PYQ PDFs",
            ],
        },
        "mock_tests": {
            "importance": "Daily mock tests are mandatory for SSC CGL success. Speed is the primary differentiator — 100 questions in 60 minutes in Tier I.",
            "recommended_platforms": [
                "Testbook SSC CGL Mocks",
                "Adda247 SSC CGL Test Series",
                "Oliveboard SSC CGL Mocks",
                "GradeUp (Byju's Exam Prep)",
            ],
            "recommended_count": "Attempt 50+ Tier I mocks and 20+ Tier II mocks. Daily sectional tests throughout preparation.",
        },
    },
    "created_at": ts(), "updated_at": ts(),
},

{
    "name": "IBPS PO",
    "slug": "ibps-po",
    "category": "Government",
    "conducting_body": "Institute of Banking Personnel Selection (IBPS)",
    "official_website": "https://www.ibps.in",
    "exam_mode": "Computer Based Test (CBT)",
    "exam_level": "National",
    "tabs": {
        "overview": (
            "• Conducted By: Institute of Banking Personnel Selection (IBPS)\n"
            "• Purpose: Recruitment of Probationary Officers (POs) in 11 public sector banks\n"
            "• Frequency: Once a year (notification in August, Prelims in October)\n"
            "• Exam Level: National\n\n"
            "IBPS PO is one of India's most popular banking exams. "
            "Participating banks: Punjab National Bank, Bank of Baroda, Canara Bank, Union Bank, and others.\n\n"
            "Three Stages:\n"
            "• Prelims: Screening test — 100 questions in 60 minutes\n"
            "• Mains: Merit exam — 155 questions + Descriptive in 180 minutes\n"
            "• Interview: Common Interview by IBPS + Bank\n\n"
            "• Starting Salary: ~₹52,000/month (with allowances)\n"
            "• Vacancies: 3,000–5,000 per cycle"
        ),
        "application": (
            "• Mode: Online at ibps.in\n\n"
            "Step-by-Step Process:\n"
            "1. Register at ibps.in with valid email and mobile\n"
            "2. Fill personal and academic details\n"
            "3. Upload photo and signature as per specifications\n"
            "4. Select preferred exam centre\n"
            "5. Pay fee: ₹850 (General/OBC) | ₹175 (SC/ST/PwD)\n"
            "6. Download admit card before Prelims"
        ),
        "eligibility": (
            "• Nationality: Indian citizen\n"
            "• Age Limit: 20–30 years (General) | 20–33 years (OBC) | 20–35 years (SC/ST)\n"
            "• Educational Qualification: Bachelor's degree in any discipline\n"
            "• Computer Literacy: Proficiency in computer operations required\n"
            "• Language Proficiency: Local language of the state preferred for some banks"
        ),
        "exam_pattern": {
            "description": "Two-stage CBT + Interview",
            "sections": [
                {"subject": "Prelims — English Language", "questions": 30, "marks": 30, "type": "MCQ — 20 minutes"},
                {"subject": "Prelims — Quantitative Aptitude", "questions": 35, "marks": 35, "type": "MCQ — 20 minutes"},
                {"subject": "Prelims — Reasoning Ability", "questions": 35, "marks": 35, "type": "MCQ — 20 minutes"},
                {"subject": "Mains — Reasoning & Computer Aptitude", "questions": 45, "marks": 60, "type": "MCQ — 60 minutes"},
                {"subject": "Mains — General/Economy/Banking Awareness", "questions": 40, "marks": 40, "type": "MCQ — 35 minutes"},
                {"subject": "Mains — English Language", "questions": 35, "marks": 40, "type": "MCQ — 40 minutes"},
                {"subject": "Mains — Data Analysis & Interpretation", "questions": 35, "marks": 60, "type": "MCQ — 45 minutes"},
                {"subject": "Mains — English Descriptive (Letter + Essay)", "questions": 2, "marks": 25, "type": "Descriptive — 30 minutes"},
            ],
            "total_marks": 290,
            "duration": "Prelims: 60 minutes | Mains: 3 hours 30 minutes",
            "marking_scheme": "Prelims: +1 correct, -0.25 wrong | Mains: +1/+1.5 correct, -0.25 wrong",
        },
        "syllabus": {
            "pdf_link": "https://www.ibps.in/syllabus",
            "subjects": [
                {"name": "Reasoning Ability", "topics": ["Seating Arrangements", "Puzzles", "Blood Relations", "Direction Sense", "Coding-Decoding", "Syllogisms", "Inequality", "Input-Output", "Data Sufficiency", "Alphanumeric Series", "Critical Reasoning"]},
                {"name": "Quantitative Aptitude", "topics": ["Number Series", "Data Interpretation (DI — Tables, Charts)", "Simplification", "Percentage", "Ratio & Proportion", "Profit & Loss", "SI & CI", "Time & Work", "Speed, Distance & Time", "Probability", "Permutation & Combination", "Quadratic Equations", "Miscellaneous Arithmetic"]},
                {"name": "English Language", "topics": ["Reading Comprehension", "Error Spotting", "Fill in the Blanks", "Sentence Improvement", "Para Jumbles", "Cloze Test", "Word Replacement", "Column-Based Questions", "Letter Writing", "Essay Writing"]},
                {"name": "Banking & Financial Awareness", "topics": ["Banking History", "RBI Functions & Monetary Policy", "Government Schemes", "Current Affairs (Banking Sector)", "Financial Terms", "Economic Terms", "Budget & Five Year Plans", "Insurance Sector", "Capital Markets", "Static Banking GK"]},
                {"name": "Computer Aptitude", "topics": ["History of Computers", "Hardware & Software", "MS Office (Word, Excel, PowerPoint)", "Internet & Email", "Networking Basics", "Keyboard Shortcuts", "Database Basics", "Security Threats"]},
            ],
        },
        "preparation_tips": [
            "Reasoning Ability is the backbone of IBPS PO — master puzzles and seating arrangements first.",
            "Data Interpretation in Mains is tough — practice DI from Arun Sharma or M.Tyra books.",
            "Banking Awareness is the most scoring section in Mains — dedicate 30 minutes daily.",
            "English Descriptive requires daily letter and essay writing practice from month 1.",
            "Solve IBPS PO previous 10 years' papers from Kiran or Arihant publications.",
            "Sectional cutoffs exist in both Prelims and Mains — don't neglect any section.",
            "Current affairs for the last 6 months is critical — read The Hindu or Jagran Josh daily.",
            "Join Oliveboard or Adda247 mock test series for regular performance benchmarking.",
        ],
        "important_dates": [
            {"event": "IBPS PO Notification", "date": "August 2025"},
            {"event": "Application Opens", "date": "August 2025"},
            {"event": "Last Date to Apply", "date": "September 2025"},
            {"event": "Prelims Exam", "date": "October 2025"},
            {"event": "Prelims Result", "date": "November 2025"},
            {"event": "Mains Exam", "date": "November 2025"},
            {"event": "Mains Result", "date": "January 2026"},
            {"event": "Interview", "date": "February–March 2026"},
            {"event": "Final Allotment", "date": "April 2026"},
        ],
        "pyqs": {
            "availability": "IBPS PO PYQs from 2012–2024 available on ibps.in and coaching portals like Adda247, Oliveboard, and Testbook.",
            "difficulty_trend": "Reasoning puzzles and DI difficulty increasing yearly. English Mains has become more advanced. Banking Awareness questions are increasingly current-affairs-based.",
            "recommended_sources": [
                "Kiran IBPS PO Chapterwise PYQ Book",
                "Adda247 IBPS PO Mega Book",
                "Arihant IBPS PO Guide",
                "Oliveboard PYQ Practice Portal",
            ],
        },
        "mock_tests": {
            "importance": "Daily mock tests are non-negotiable for IBPS PO. Sectional time limits in both Prelims and Mains require intense speed training.",
            "recommended_platforms": [
                "Oliveboard IBPS PO Mocks",
                "Adda247 IBPS PO Test Series",
                "Testbook IBPS PO Mocks",
                "Gradeup (Byju's Exam Prep)",
            ],
            "recommended_count": "30+ Prelims mocks | 20+ Mains mocks. Daily sectional tests from 3 months before exam.",
        },
    },
    "created_at": ts(), "updated_at": ts(),
},

{
    "name": "RRB NTPC",
    "slug": "rrb-ntpc",
    "category": "Government",
    "conducting_body": "Railway Recruitment Board (RRB)",
    "official_website": "https://www.rrbcdg.gov.in",
    "exam_mode": "Computer Based Test (CBT)",
    "exam_level": "National",
    "tabs": {
        "overview": (
            "• Conducted By: Railway Recruitment Board (RRB)\n"
            "• Purpose: Recruitment to Non-Technical Popular Category (NTPC) posts in Indian Railways\n"
            "• Frequency: Every 2–3 years (mega notification covers all RRBs)\n"
            "• Exam Level: National\n\n"
            "RRB NTPC is one of India's most popular government exams. "
            "Posts include Junior Clerk, Station Master, Goods Guard, Senior Clerk, Traffic Assistant, and more.\n\n"
            "Three Stages:\n"
            "• CBT 1: Screening exam — 100 questions in 90 minutes\n"
            "• CBT 2: Merit exam — 120 questions in 90 minutes\n"
            "• Skill/Typing Test (for some posts) + Document Verification\n\n"
            "• Vacancies: 35,000+ per cycle (largest railway recruitment)\n"
            "• Both Graduate and Undergraduate level posts available"
        ),
        "application": (
            "• Mode: Online at rrbcdg.gov.in (or regional RRB website)\n\n"
            "Step-by-Step Process:\n"
            "1. Visit the official RRB regional website\n"
            "2. Register with valid email and mobile\n"
            "3. Fill personal, academic, and contact details\n"
            "4. Upload photo and signature\n"
            "5. Pay fee: ₹500 (General/OBC) | ₹250 (SC/ST/ExSM/Minority/EBC/Female)\n"
            "   Fee refunded on appearing in CBT 1\n"
            "6. Download admit card before CBT 1"
        ),
        "eligibility": (
            "• Nationality: Indian citizen\n"
            "• Age Limit: 18–30 years (varies by post — some up to 33 for Graduate posts)\n"
            "   – OBC: +3 years | SC/ST: +5 years | ExSM: up to 45 years\n"
            "• Graduate Posts: Bachelor's degree in any discipline\n"
            "• Undergraduate Posts: Class 12 passed\n"
            "• No prior experience required"
        ),
        "exam_pattern": {
            "description": "Two-stage CBT + Skill/Typing Test (for applicable posts)",
            "sections": [
                {"subject": "CBT 1 — Mathematics", "questions": 30, "marks": 30, "type": "MCQ"},
                {"subject": "CBT 1 — General Intelligence & Reasoning", "questions": 30, "marks": 30, "type": "MCQ"},
                {"subject": "CBT 1 — General Awareness", "questions": 40, "marks": 40, "type": "MCQ"},
                {"subject": "CBT 2 — Mathematics", "questions": 35, "marks": 35, "type": "MCQ"},
                {"subject": "CBT 2 — General Intelligence & Reasoning", "questions": 35, "marks": 35, "type": "MCQ"},
                {"subject": "CBT 2 — General Awareness", "questions": 50, "marks": 50, "type": "MCQ"},
            ],
            "total_marks": 220,
            "duration": "CBT 1: 90 minutes | CBT 2: 90 minutes",
            "marking_scheme": "+1 for correct, -1/3 for incorrect in both CBT stages",
        },
        "syllabus": {
            "pdf_link": "https://www.rrbcdg.gov.in/syllabus",
            "subjects": [
                {"name": "Mathematics", "topics": ["Number System", "Decimals & Fractions", "LCM & HCF", "Ratio & Proportion", "Percentage", "Mensuration", "Time & Work", "Time, Speed & Distance", "Simple & Compound Interest", "Profit & Loss", "Geometry & Trigonometry", "Statistics & Probability", "Algebra Basics"]},
                {"name": "General Intelligence & Reasoning", "topics": ["Analogies", "Completion of Number & Alphabetical Series", "Coding & Decoding", "Mathematical Operations", "Relationships", "Syllogism", "Jumbling", "Venn Diagram", "Data Interpretation & Sufficiency", "Conclusions & Decision Making", "Similarities & Differences", "Analytical Reasoning", "Classification", "Directions", "Statement-Arguments"]},
                {"name": "General Awareness", "topics": ["Current Affairs (National & International)", "Games & Sports", "Art & Culture of India", "Indian Literature & Authors", "Monuments & Places of India", "General Science", "History of India", "Freedom Struggle", "Indian Polity & Constitution", "Indian Economy", "Famous Personalities", "Abbreviations", "Important Government Schemes", "Books & Authors", "Awards & Prizes", "Science & Technology Developments", "Environmental Issues & Ecology"]},
            ],
        },
        "preparation_tips": [
            "General Awareness carries the highest weightage in CBT 1 — revise static GK daily.",
            "Mathematics at RRB NTPC level is Class 10 standard — focus on speed and accuracy.",
            "Reasoning section is scoring — master the common types: analogies, series, coding.",
            "CBT 2 has more questions and is more competitive — it determines your merit rank.",
            "Solve at least 30 previous year RRB NTPC papers from 2016–2023.",
            "Current affairs from the last 6 months is essential — especially Railway-related news.",
            "Negative marking of 1/3 exists — avoid random guessing in both stages.",
            "Join daily quiz practice on platforms like Testbook, Adda247, or Rail Wire.",
        ],
        "important_dates": [
            {"event": "RRB NTPC Notification", "date": "September 2024"},
            {"event": "Application Opens", "date": "September 2024"},
            {"event": "Last Date to Apply", "date": "October 2024"},
            {"event": "CBT 1 Exam", "date": "February–April 2025"},
            {"event": "CBT 1 Result", "date": "May 2025"},
            {"event": "CBT 2 Exam", "date": "July–August 2025"},
            {"event": "CBT 2 Result", "date": "September 2025"},
            {"event": "Skill/Typing Test & Document Verification", "date": "October–December 2025"},
        ],
        "pyqs": {
            "availability": "RRB NTPC PYQs from 2016–2024 available on RRB regional websites and Kiran/Arihant publications.",
            "difficulty_trend": "CBT 1 is moderate — GK is the most important differentiator. CBT 2 is harder, especially Mathematics and GK sections.",
            "recommended_sources": [
                "Kiran RRB NTPC Chapterwise PYQ",
                "Adda247 RRB NTPC Mega Book",
                "Arihant RRB NTPC Guide",
                "Testbook RRB NTPC PYQ Practice",
            ],
        },
        "mock_tests": {
            "importance": "Daily mock tests are essential for RRB NTPC. CBT 1 has a very high competition ratio — only the top performers advance to CBT 2.",
            "recommended_platforms": [
                "Testbook RRB NTPC Mocks",
                "Adda247 RRB NTPC Test Series",
                "Oliveboard RRB NTPC Mocks",
                "Gradeup (Byju's Exam Prep)",
            ],
            "recommended_count": "50+ CBT 1 mocks | 20+ CBT 2 mocks. Daily sectional GA and Maths quizzes.",
        },
    },
    "created_at": ts(), "updated_at": ts(),
},

]

if __name__ == "__main__":
    db.exams.drop()
    result = db.exams.insert_many(EXAMS)
    print(f"✅ Inserted {len(result.inserted_ids)} exams into MongoDB.")
    db.exams.create_index("slug", unique=True)
    print("✅ Unique index on 'slug' created.")
