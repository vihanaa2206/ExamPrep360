# backend/routes/notifications.py
# Hybrid: Live scraping from official sites + static fallback
# pip install requests beautifulsoup4

from flask import Blueprint, jsonify, request
from datetime import datetime
import requests
from bs4 import BeautifulSoup

notifications_bp = Blueprint("notifications_bp", __name__)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    )
}

_cache = {"data": [], "fetched_at": None}
CACHE_MINUTES = 30


def _cache_valid():
    if not _cache["fetched_at"]:
        return False
    return (datetime.utcnow() - _cache["fetched_at"]).seconds / 60 < CACHE_MINUTES


def _type_from_title(title):
    t = title.lower()
    if any(k in t for k in ["admit card", "hall ticket"]):
        return "Admit Card"
    if any(k in t for k in ["result", "score", "scorecard", "nta score", "rank"]):
        return "Result"
    if any(k in t for k in ["answer key", "provisional key", "final key", "response sheet"]):
        return "Answer Key"
    if any(k in t for k in ["application", "registration", "apply", "last date", "form"]):
        return "Application Form"
    if any(k in t for k in ["exam date", "schedule", "exam city", "date sheet"]):
        return "Exam Date"
    if any(k in t for k in ["correction", "edit window", "modify"]):
        return "Correction Window"
    if any(k in t for k in ["counselling", "allotment", "josaa", "csab", "mcc"]):
        return "Counselling"
    if any(k in t for k in ["cut off", "cutoff"]):
        return "Cutoff"
    return "Notification"


def _is_junk(title):
    junk_words = [
        "accessibility", "skip to", "home", "about us", "contact",
        "login", "register", "menu", "search", "sitemap",
        "privacy policy", "terms", "faq", "feedback", "help",
        "view more", "read more", "click here", "english", "hindi",
        "screen reader", "javascript", "cookie",
    ]
    t = title.lower().strip()
    if len(t) < 20:
        return True
    return any(j in t for j in junk_words)


# ── SCRAPER: NTA JEE Main ─────────────────────────────────────────────────
def scrape_jee():
    results = []
    try:
        url = "https://jeemain.nta.nic.in/public-notices/"
        r = requests.get(url, headers=HEADERS, timeout=10)
        soup = BeautifulSoup(r.text, "html.parser")
        links = []
        for row in soup.select("table tr"):
            a = row.find("a", href=True)
            if a:
                links.append(a)
        if not links:
            links = [a for a in soup.find_all("a", href=True)
                     if any(k in a.get("href","").lower() for k in [".pdf","notice","news","public"])]
        for a in links[:10]:
            title = a.get_text(strip=True)
            href  = a.get("href", "")
            if _is_junk(title):
                continue
            if href and not href.startswith("http"):
                href = "https://jeemain.nta.nic.in" + href
            results.append({
                "id": f"jee-{abs(hash(title)) % 999999}",
                "type": "exam", "exam_slug": "jee-main", "exam_name": "JEE Main",
                "college_slug": None, "college_name": None, "category": "Engineering",
                "title": title[:150],
                "summary": f"Official JEE Main notice from NTA: {title[:120]}",
                "update_type": _type_from_title(title),
                "date": datetime.now().strftime("%B %d, %Y"),
                "is_new": True, "official_source": "NTA",
                "official_link": href if href.startswith("http") else "https://jeemain.nta.nic.in/public-notices/",
            })
    except Exception as e:
        print(f"[JEE scrape] {e}")
    return results


# ── SCRAPER: NTA NEET ─────────────────────────────────────────────────────
def scrape_neet():
    results = []
    try:
        url = "https://neet.nta.nic.in/public-notices/"
        r = requests.get(url, headers=HEADERS, timeout=10)
        soup = BeautifulSoup(r.text, "html.parser")
        links = []
        for row in soup.select("table tr"):
            a = row.find("a", href=True)
            if a:
                links.append(a)
        if not links:
            links = [a for a in soup.find_all("a", href=True)
                     if any(k in a.get("href","").lower() for k in [".pdf","notice","news"])]
        for a in links[:10]:
            title = a.get_text(strip=True)
            href  = a.get("href", "")
            if _is_junk(title):
                continue
            if href and not href.startswith("http"):
                href = "https://neet.nta.nic.in" + href
            results.append({
                "id": f"neet-{abs(hash(title)) % 999999}",
                "type": "exam", "exam_slug": "neet-ug", "exam_name": "NEET UG",
                "college_slug": None, "college_name": None, "category": "Medical",
                "title": title[:150],
                "summary": f"Official NEET UG notice from NTA: {title[:120]}",
                "update_type": _type_from_title(title),
                "date": datetime.now().strftime("%B %d, %Y"),
                "is_new": True, "official_source": "NTA",
                "official_link": href if href.startswith("http") else "https://neet.nta.nic.in/public-notices/",
            })
    except Exception as e:
        print(f"[NEET scrape] {e}")
    return results


# ── SCRAPER: UPSC ─────────────────────────────────────────────────────────
def scrape_upsc():
    results = []
    try:
        url = "https://upsc.gov.in/examinations/active-examinations"
        r = requests.get(url, headers=HEADERS, timeout=10)
        soup = BeautifulSoup(r.text, "html.parser")
        links = []
        for row in soup.select("table tr"):
            a = row.find("a", href=True)
            if a:
                links.append(a)
        if not links:
            links = [a for a in soup.find_all("a", href=True)
                     if len(a.get_text(strip=True)) > 25]
        for a in links[:8]:
            title = a.get_text(strip=True)
            href  = a.get("href", "")
            if _is_junk(title):
                continue
            if href and not href.startswith("http"):
                href = "https://upsc.gov.in" + href
            results.append({
                "id": f"upsc-{abs(hash(title)) % 999999}",
                "type": "exam", "exam_slug": "upsc", "exam_name": "UPSC CSE",
                "college_slug": None, "college_name": None, "category": "Government",
                "title": title[:150],
                "summary": f"Official UPSC notice: {title[:120]}",
                "update_type": _type_from_title(title),
                "date": datetime.now().strftime("%B %d, %Y"),
                "is_new": True, "official_source": "UPSC",
                "official_link": href if href.startswith("http") else "https://upsc.gov.in",
            })
    except Exception as e:
        print(f"[UPSC scrape] {e}")
    return results


# ── SCRAPER: SSC ──────────────────────────────────────────────────────────
def scrape_ssc():
    results = []
    try:
        url = "https://ssc.nic.in/Portal/LatestNotification"
        r = requests.get(url, headers=HEADERS, timeout=10)
        soup = BeautifulSoup(r.text, "html.parser")
        links = []
        for row in soup.select("table tr"):
            a = row.find("a", href=True)
            if a:
                links.append(a)
        if not links:
            links = [a for a in soup.find_all("a", href=True)
                     if len(a.get_text(strip=True)) > 20]
        for a in links[:8]:
            title = a.get_text(strip=True)
            href  = a.get("href", "")
            if _is_junk(title):
                continue
            if href and not href.startswith("http"):
                href = "https://ssc.nic.in" + href
            results.append({
                "id": f"ssc-{abs(hash(title)) % 999999}",
                "type": "exam", "exam_slug": "ssc-cgl", "exam_name": "SSC CGL",
                "college_slug": None, "college_name": None, "category": "Government",
                "title": title[:150],
                "summary": f"Official SSC notice: {title[:120]}",
                "update_type": _type_from_title(title),
                "date": datetime.now().strftime("%B %d, %Y"),
                "is_new": True, "official_source": "SSC",
                "official_link": href if href.startswith("http") else "https://ssc.nic.in/Portal/LatestNotification",
            })
    except Exception as e:
        print(f"[SSC scrape] {e}")
    return results


# ── STATIC FALLBACK (2026 data) ───────────────────────────────────────────
STATIC_FALLBACK = [
    {"id":"sf-001","type":"exam","exam_slug":"jee-main","exam_name":"JEE Main","college_slug":None,"college_name":None,"category":"Engineering","title":"JEE Main 2026 Session 1 NTA Scores Declared — Download Scorecard Now","summary":"NTA has declared JEE Main 2026 Session 1 scores. Candidates can download scorecards at jeemain.nta.nic.in using application number and date of birth.","update_type":"Result","date":"March 17, 2026","is_new":True,"official_source":"NTA","official_link":"https://jeemain.nta.nic.in/public-notices/"},
    {"id":"sf-002","type":"exam","exam_slug":"jee-main","exam_name":"JEE Main","college_slug":None,"college_name":None,"category":"Engineering","title":"JEE Main 2026 Session 2 Correction Window Open — Edit Particulars at jeemain.nta.nic.in","summary":"NTA opened correction window for JEE Main 2026 Session 2. Candidates can edit their application form particulars. Check jeemain.nta.nic.in for last date.","update_type":"Correction Window","date":"March 17, 2026","is_new":True,"official_source":"NTA","official_link":"https://jeemain.nta.nic.in/public-notices/"},
    {"id":"sf-003","type":"exam","exam_slug":"jee-main","exam_name":"JEE Main","college_slug":None,"college_name":None,"category":"Engineering","title":"JEE Main 2026 Session 1 Final Answer Keys Released for Paper 2 (B.Arch/B.Planning)","summary":"NTA released final answer keys for JEE Main 2026 Session 1 Paper 2 (B.Arch and B.Planning). Answer key challenge window has been closed.","update_type":"Answer Key","date":"March 16, 2026","is_new":True,"official_source":"NTA","official_link":"https://jeemain.nta.nic.in/public-notices/"},
    {"id":"sf-004","type":"exam","exam_slug":"neet-ug","exam_name":"NEET UG","college_slug":None,"college_name":None,"category":"Medical","title":"NEET UG 2026 Registration Open — Apply Before Last Date at neet.nta.nic.in","summary":"NTA opened NEET UG 2026 registration. Over 25 lakh candidates expected. Exam for 1.08 lakh MBBS seats across India. Apply at neet.nta.nic.in before last date.","update_type":"Application Form","date":"March 17, 2026","is_new":True,"official_source":"NTA","official_link":"https://neet.nta.nic.in"},
    {"id":"sf-005","type":"exam","exam_slug":"upsc","exam_name":"UPSC CSE","college_slug":None,"college_name":None,"category":"Government","title":"UPSC Civil Services Preliminary Examination 2026 Notification Released","summary":"UPSC released Civil Services 2026 notification. Online applications open at upsconline.nic.in. Check vacancy count and eligibility criteria on official website.","update_type":"Notification","date":"March 17, 2026","is_new":True,"official_source":"UPSC","official_link":"https://www.upsc.gov.in"},
    {"id":"sf-006","type":"exam","exam_slug":"ssc-cgl","exam_name":"SSC CGL","college_slug":None,"college_name":None,"category":"Government","title":"SSC CGL 2026 Notification Released — Registration Open at ssc.nic.in","summary":"Staff Selection Commission released CGL 2026 notification. Registration open at ssc.nic.in. Tier I exam in CBT mode. Check official website for complete schedule.","update_type":"Notification","date":"March 16, 2026","is_new":True,"official_source":"SSC","official_link":"https://ssc.nic.in"},
    {"id":"sf-007","type":"exam","exam_slug":"gate-cs","exam_name":"GATE CS","college_slug":None,"college_name":None,"category":"Computer Science","title":"GATE 2026 Official Notification Released — Conducted by IISc Bangalore","summary":"IISc Bangalore released GATE 2026 official notification. Registration begins shortly. GATE 2026 for 30 papers including CS (Computer Science and IT). Apply at gate2026.iisc.ac.in.","update_type":"Notification","date":"March 15, 2026","is_new":True,"official_source":"IISc Bangalore","official_link":"https://gate2026.iisc.ac.in"},
    {"id":"sf-008","type":"exam","exam_slug":"clat","exam_name":"CLAT","college_slug":None,"college_name":None,"category":"Law","title":"CLAT 2026 Registration Open — 22 NLUs, Last Date October 15","summary":"Consortium of NLUs opened CLAT 2026 registration. Exam December 2026. 22 NLUs including NLSIU, NALSAR, NUJS, NLU Delhi. Apply at consortiumofnlus.ac.in before Oct 15.","update_type":"Application Form","date":"March 15, 2026","is_new":True,"official_source":"Consortium of NLUs","official_link":"https://consortiumofnlus.ac.in"},
    {"id":"sf-009","type":"exam","exam_slug":"cat","exam_name":"CAT","college_slug":None,"college_name":None,"category":"Management","title":"CAT 2026 Registration to Begin August 2026 — IIM Announcement","summary":"IIM confirmed CAT 2026 conducting institute. Registration opens August 2026. Over 3.5 lakh candidates for 5000+ IIM seats. Apply at iimcat.ac.in when available.","update_type":"Notification","date":"March 14, 2026","is_new":False,"official_source":"IIM","official_link":"https://iimcat.ac.in"},
    {"id":"sf-010","type":"exam","exam_slug":"ibps-po","exam_name":"IBPS PO","college_slug":None,"college_name":None,"category":"Government","title":"IBPS PO 2026 Annual Calendar Released — Prelims in October 2026","summary":"IBPS released Annual Calendar 2026. IBPS PO Prelims in October 2026, Mains in November 2026. Registration opens August 2026 at ibps.in. 11 public sector banks participating.","update_type":"Exam Date","date":"March 14, 2026","is_new":False,"official_source":"IBPS","official_link":"https://www.ibps.in"},
    {"id":"sf-011","type":"college","exam_slug":"jee-advanced","exam_name":"JEE Advanced","college_slug":"iit-bombay","college_name":"IIT Bombay","category":"Engineering","title":"IIT Bombay B.Tech 2026 JoSAA Counselling — 880 Seats, CSE Opening Rank ~70","summary":"IIT Bombay B.Tech 2026 admissions via JoSAA counselling. 880 seats across CSE, EE, ME, Chemical. CSE opening rank approx 70. Register at josaa.nic.in after JEE Advanced result.","update_type":"Admissions Open","date":"March 17, 2026","is_new":True,"official_source":"IIT Bombay","official_link":"https://www.iitb.ac.in/newacadhome/admissions.jsp"},
    {"id":"sf-012","type":"college","exam_slug":"cat","exam_name":"CAT","college_slug":"iim-ahmedabad","college_name":"IIM Ahmedabad","category":"Management","title":"IIM Ahmedabad PGP 2026-28 WAT-PI Shortlist Out — 99.5 Percentile CAT Required","summary":"IIM Ahmedabad PGP 2026-28 shortlist released. 99.5+ CAT percentile needed. WAT-PI rounds Feb-March 2026. 400 seats. Final offers April 2026. Apply at iima.ac.in.","update_type":"Admissions Open","date":"March 16, 2026","is_new":True,"official_source":"IIM Ahmedabad","official_link":"https://www.iima.ac.in/pgp/admissions"},
    {"id":"sf-013","type":"college","exam_slug":"neet-ug","exam_name":"NEET UG","college_slug":"aiims-delhi","college_name":"AIIMS Delhi","category":"Medical","title":"AIIMS Delhi MBBS 2026 Expected Cutoff — General Category 715+ out of 720","summary":"AIIMS Delhi 2026 MBBS expected cutoff: General 715+/720, OBC 695+, SC 650+. Only 107 seats. Admission purely on NEET UG merit. India's #1 medical college by NIRF.","update_type":"Cutoff","date":"March 15, 2026","is_new":True,"official_source":"AIIMS Delhi","official_link":"https://www.aiims.edu/en/notices.html"},
    {"id":"sf-014","type":"college","exam_slug":"gate-cs","exam_name":"GATE CS","college_slug":"iisc-bangalore","college_name":"IISc Bangalore","category":"Computer Science","title":"IISc Bangalore M.Tech CSE 2026 — GATE Score 750+ Required, Stipend Rs 12400/month","summary":"IISc M.Tech CSE 2026 admissions via GATE CS score. Expected cutoff 750+/1000. 100 seats with Rs 12,400/month stipend. Apply at iisc.ac.in after GATE results.","update_type":"Admissions Open","date":"March 14, 2026","is_new":True,"official_source":"IISc Bangalore","official_link":"https://iisc.ac.in/admissions"},
    {"id":"sf-015","type":"college","exam_slug":"clat","exam_name":"CLAT","college_slug":"nlsiu-bangalore","college_name":"NLSIU Bangalore","category":"Law","title":"NLSIU Bangalore 2026 Admission Cutoff — CLAT Rank Under 70 for General Category","summary":"NLSIU Bangalore 2026: General category CLAT rank under 70 required. SC/ST cutoff 300-400. 80 seats in BA LLB (Hons). India's #1 law school for consecutive years.","update_type":"Cutoff","date":"March 13, 2026","is_new":False,"official_source":"NLSIU","official_link":"https://nls.ac.in/admissions"},
    {"id":"sf-016","type":"exam","exam_slug":"jee-advanced","exam_name":"JEE Advanced","college_slug":None,"college_name":None,"category":"Engineering","title":"JEE Advanced 2026 — IIT Kanpur to Conduct Exam, Registration April 2026","summary":"IIT Kanpur will conduct JEE Advanced 2026. Top 2.5 lakh JEE Main qualifiers eligible. Registration from April 2026. Exam scheduled May 2026. Details at jeeadv.ac.in.","update_type":"Notification","date":"March 13, 2026","is_new":False,"official_source":"IIT Kanpur","official_link":"https://jeeadv.ac.in"},
    {"id":"sf-017","type":"college","exam_slug":"jee-main","exam_name":"JEE Main","college_slug":"nit-trichy","college_name":"NIT Trichy","category":"Engineering","title":"NIT Trichy Placements 2026 — Average 15 LPA, 96 Percent Placed, Highest 1.3 CPA","summary":"NIT Trichy 2026 placements: avg 15 LPA, 96 percent placed. Top recruiters Microsoft, Amazon, Infosys, TCS. Highest 1.3 CPA from Google. India's top ranked NIT.","update_type":"Placements","date":"March 12, 2026","is_new":False,"official_source":"NIT Trichy","official_link":"https://www.nitt.edu/home/placements/"},
    {"id":"sf-018","type":"exam","exam_slug":"neet-pg","exam_name":"NEET PG","college_slug":None,"college_name":None,"category":"Medical","title":"NEET PG 2026 Registration Open — NBE Opens Applications at nbe.edu.in","summary":"NBE opened NEET PG 2026 registration. All MBBS graduates with completed internship are eligible. Apply at nbe.edu.in before last date. 50,000+ PG medical seats across India.","update_type":"Application Form","date":"March 12, 2026","is_new":False,"official_source":"NBE","official_link":"https://nbe.edu.in"},
    {"id":"sf-019","type":"college","exam_slug":"cat","exam_name":"CAT","college_slug":"iim-bangalore","college_name":"IIM Bangalore","category":"Management","title":"IIM Bangalore PGP 2026-28 Final Offers Out — 500 Students, Avg CAT 99.4 Percentile","summary":"IIM Bangalore PGP 2026-28 offers released. 500 students admitted. Avg CAT percentile 99.4. Female diversity 38 percent. Average work experience 26 months.","update_type":"Admissions Open","date":"March 11, 2026","is_new":False,"official_source":"IIM Bangalore","official_link":"https://www.iimb.ac.in/pgp"},
    {"id":"sf-020","type":"exam","exam_slug":"rrb-ntpc","exam_name":"RRB NTPC","college_slug":None,"college_name":None,"category":"Government","title":"RRB NTPC 2026 Notification — 11,558 Vacancies Across All Regional RRBs","summary":"Railway Recruitment Board released NTPC 2026 notification. 11,558 vacancies for Graduate and Undergraduate posts. Registration on regional RRB websites. Admit card download later.","update_type":"Notification","date":"March 10, 2026","is_new":False,"official_source":"RRB","official_link":"https://www.rrbcdg.gov.in"},
]


def fetch_live_data():
    live = []
    for scraper in [scrape_jee, scrape_neet, scrape_upsc, scrape_ssc]:
        try:
            data = scraper()
            real = [d for d in data if not _is_junk(d["title"])]
            live.extend(real)
            print(f"[{scraper.__name__}] {len(real)} real items")
        except Exception as e:
            print(f"[{scraper.__name__}] error: {e}")

    # Deduplicate
    seen, unique = set(), []
    for item in live:
        if item["id"] not in seen:
            seen.add(item["id"])
            unique.append(item)

    print(f"[notifications] Live: {len(unique)}")

    # If less than 5, fallback to static
    if len(unique) < 5:
        print("[notifications] Using static fallback")
        return STATIC_FALLBACK

    # Merge live + non-duplicate static
    live_titles = {n["title"].lower()[:50] for n in unique}
    extra = [s for s in STATIC_FALLBACK
             if s["title"].lower()[:50] not in live_titles]
    return unique + extra


@notifications_bp.route("/notifications", methods=["GET"])
def get_all_notifications():
    if not _cache_valid():
        _cache["data"] = fetch_live_data()
        _cache["fetched_at"] = datetime.utcnow()

    result = list(_cache["data"])

    category     = request.args.get("category", "").strip()
    exam_slug    = request.args.get("exam", "").strip()
    update_type  = request.args.get("update_type", "").strip()
    notif_type   = request.args.get("type", "").strip()
    college_slug = request.args.get("college", "").strip()

    if category:
        result = [n for n in result if n.get("category","").lower() == category.lower()]
    if exam_slug:
        result = [n for n in result if n.get("exam_slug") == exam_slug]
    if update_type:
        result = [n for n in result if n.get("update_type","").lower() == update_type.lower()]
    if notif_type:
        result = [n for n in result if n.get("type","exam") == notif_type]
    if college_slug:
        result = [n for n in result if n.get("college_slug") == college_slug]

    return jsonify(result), 200


@notifications_bp.route("/notifications/refresh", methods=["POST"])
def force_refresh():
    _cache["fetched_at"] = None
    _cache["data"] = fetch_live_data()
    _cache["fetched_at"] = datetime.utcnow()
    return jsonify({"refreshed": True, "count": len(_cache["data"])}), 200
