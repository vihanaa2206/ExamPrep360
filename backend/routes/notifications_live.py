# backend/routes/notifications.py
# ─────────────────────────────────────────────────────────────────────────────
# REAL-TIME notifications — scrapes actual official websites
# Install: pip install feedparser requests beautifulsoup4
# ─────────────────────────────────────────────────────────────────────────────

from flask import Blueprint, jsonify, request
import feedparser
import requests
from bs4 import BeautifulSoup
from datetime import datetime
import re

notifications_bp = Blueprint("notifications_bp", __name__)

# ── Cache to avoid hitting websites on every request ────────────────────────
_cache = {"data": [], "fetched_at": None}
CACHE_MINUTES = 30  # refresh every 30 minutes


def _is_cache_valid():
    if not _cache["fetched_at"]:
        return False
    diff = (datetime.utcnow() - _cache["fetched_at"]).seconds / 60
    return diff < CACHE_MINUTES


HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    )
}


# ════════════════════════════════════════════════════════════════════════════
#  SCRAPERS — one per source
# ════════════════════════════════════════════════════════════════════════════

def scrape_nta_jee():
    """Scrape NTA JEE Main public notices"""
    results = []
    try:
        url = "https://jeemain.nta.nic.in/public-notices/"
        r = requests.get(url, headers=HEADERS, timeout=8)
        soup = BeautifulSoup(r.text, "html.parser")

        items = soup.select("ul li a, .notice-list a, article a")[:8]
        if not items:
            items = soup.find_all("a", href=True)
            items = [a for a in items if len(a.get_text(strip=True)) > 20][:8]

        for item in items:
            title = item.get_text(strip=True)
            href  = item.get("href", "")
            if not title or len(title) < 10:
                continue
            if href and not href.startswith("http"):
                href = "https://jeemain.nta.nic.in" + href

            update_type = _classify_update_type(title)
            results.append({
                "id":               f"nta-jee-{hash(title) % 100000}",
                "type":             "exam",
                "exam_slug":        "jee-main",
                "exam_name":        "JEE Main",
                "college_slug":     None,
                "college_name":     None,
                "category":         "Engineering",
                "title":            title[:120],
                "summary":          f"Official notice from NTA for JEE Main. Click to read full details on the official NTA website.",
                "update_type":      update_type,
                "date":             datetime.now().strftime("%B %d, %Y"),
                "is_new":           True,
                "official_source":  "NTA",
                "official_link":    href if href.startswith("http") else "https://jeemain.nta.nic.in/public-notices/",
            })
    except Exception as e:
        print(f"[NTA JEE scrape error]: {e}")
    return results


def scrape_nta_neet():
    """Scrape NTA NEET notices"""
    results = []
    try:
        url = "https://neet.nta.nic.in/public-notices/"
        r = requests.get(url, headers=HEADERS, timeout=8)
        soup = BeautifulSoup(r.text, "html.parser")

        items = soup.select("ul li a, .notice-list a, article a")[:8]
        if not items:
            items = soup.find_all("a", href=True)
            items = [a for a in items if len(a.get_text(strip=True)) > 20][:8]

        for item in items:
            title = item.get_text(strip=True)
            href  = item.get("href", "")
            if not title or len(title) < 10:
                continue
            if href and not href.startswith("http"):
                href = "https://neet.nta.nic.in" + href

            results.append({
                "id":               f"nta-neet-{hash(title) % 100000}",
                "type":             "exam",
                "exam_slug":        "neet-ug",
                "exam_name":        "NEET UG",
                "college_slug":     None,
                "college_name":     None,
                "category":         "Medical",
                "title":            title[:120],
                "summary":          f"Official notice from NTA for NEET UG. Click to read full details.",
                "update_type":      _classify_update_type(title),
                "date":             datetime.now().strftime("%B %d, %Y"),
                "is_new":           True,
                "official_source":  "NTA",
                "official_link":    href if href.startswith("http") else "https://neet.nta.nic.in/public-notices/",
            })
    except Exception as e:
        print(f"[NTA NEET scrape error]: {e}")
    return results


def scrape_upsc():
    """Scrape UPSC latest notices"""
    results = []
    try:
        url = "https://www.upsc.gov.in/whatsnew"
        r = requests.get(url, headers=HEADERS, timeout=8)
        soup = BeautifulSoup(r.text, "html.parser")

        items = soup.select("table tr td a, .view-content a, ul.news li a")[:8]
        if not items:
            items = soup.find_all("a", href=True)
            items = [a for a in items if len(a.get_text(strip=True)) > 20
                     and "upsc" in a.get("href", "").lower()][:8]

        for item in items:
            title = item.get_text(strip=True)
            href  = item.get("href", "")
            if not title or len(title) < 10:
                continue
            if href and not href.startswith("http"):
                href = "https://www.upsc.gov.in" + href

            results.append({
                "id":               f"upsc-{hash(title) % 100000}",
                "type":             "exam",
                "exam_slug":        "upsc",
                "exam_name":        "UPSC CSE",
                "college_slug":     None,
                "college_name":     None,
                "category":         "Government",
                "title":            title[:120],
                "summary":          "Official notice from Union Public Service Commission. Click to view on upsc.gov.in.",
                "update_type":      _classify_update_type(title),
                "date":             datetime.now().strftime("%B %d, %Y"),
                "is_new":           True,
                "official_source":  "UPSC",
                "official_link":    href if href.startswith("http") else "https://www.upsc.gov.in/whatsnew",
            })
    except Exception as e:
        print(f"[UPSC scrape error]: {e}")
    return results


def scrape_ssc():
    """Scrape SSC latest notices"""
    results = []
    try:
        url = "https://ssc.nic.in/Portal/LatestNotification"
        r = requests.get(url, headers=HEADERS, timeout=8)
        soup = BeautifulSoup(r.text, "html.parser")

        items = soup.select("table tr td a, .notif-list a, li a")[:8]
        if not items:
            items = soup.find_all("a", href=True)
            items = [a for a in items if len(a.get_text(strip=True)) > 20][:8]

        for item in items:
            title = item.get_text(strip=True)
            href  = item.get("href", "")
            if not title or len(title) < 10:
                continue
            if href and not href.startswith("http"):
                href = "https://ssc.nic.in" + href

            results.append({
                "id":               f"ssc-{hash(title) % 100000}",
                "type":             "exam",
                "exam_slug":        "ssc-cgl",
                "exam_name":        "SSC CGL",
                "college_slug":     None,
                "college_name":     None,
                "category":         "Government",
                "title":            title[:120],
                "summary":          "Official notice from Staff Selection Commission. Click to view full notification on ssc.nic.in.",
                "update_type":      _classify_update_type(title),
                "date":             datetime.now().strftime("%B %d, %Y"),
                "is_new":           True,
                "official_source":  "SSC",
                "official_link":    href if href.startswith("http") else "https://ssc.nic.in/Portal/LatestNotification",
            })
    except Exception as e:
        print(f"[SSC scrape error]: {e}")
    return results


def scrape_ibps():
    """Scrape IBPS latest notices"""
    results = []
    try:
        url = "https://www.ibps.in/category/imp-dates/"
        r = requests.get(url, headers=HEADERS, timeout=8)
        soup = BeautifulSoup(r.text, "html.parser")

        items = soup.select("article h2 a, .post-title a, h3.entry-title a")[:8]

        for item in items:
            title = item.get_text(strip=True)
            href  = item.get("href", "")
            if not title or len(title) < 10:
                continue

            results.append({
                "id":               f"ibps-{hash(title) % 100000}",
                "type":             "exam",
                "exam_slug":        "ibps-po",
                "exam_name":        "IBPS PO",
                "college_slug":     None,
                "college_name":     None,
                "category":         "Government",
                "title":            title[:120],
                "summary":          "Official update from IBPS. Click to view complete details on ibps.in.",
                "update_type":      _classify_update_type(title),
                "date":             datetime.now().strftime("%B %d, %Y"),
                "is_new":           True,
                "official_source":  "IBPS",
                "official_link":    href if href.startswith("http") else "https://www.ibps.in",
            })
    except Exception as e:
        print(f"[IBPS scrape error]: {e}")
    return results


def scrape_gate():
    """Scrape GATE latest notices via IIT GATE portal"""
    results = []
    try:
        url = "https://gate2026.iisc.ac.in"
        r = requests.get(url, headers=HEADERS, timeout=8)
        soup = BeautifulSoup(r.text, "html.parser")

        items = soup.select("ul li a, .news a, .updates a, table td a")[:6]
        if not items:
            items = soup.find_all("a", href=True)
            items = [a for a in items if len(a.get_text(strip=True)) > 15][:6]

        for item in items:
            title = item.get_text(strip=True)
            href  = item.get("href", "")
            if not title or len(title) < 10:
                continue
            if href and not href.startswith("http"):
                href = "https://gate2026.iisc.ac.in" + href

            results.append({
                "id":               f"gate-{hash(title) % 100000}",
                "type":             "exam",
                "exam_slug":        "gate-cs",
                "exam_name":        "GATE CS",
                "college_slug":     None,
                "college_name":     None,
                "category":         "Computer Science",
                "title":            title[:120],
                "summary":          "Official GATE notice from IISc Bangalore. Click to view on GATE official portal.",
                "update_type":      _classify_update_type(title),
                "date":             datetime.now().strftime("%B %d, %Y"),
                "is_new":           True,
                "official_source":  "IISc Bangalore",
                "official_link":    href if href.startswith("http") else "https://gate2026.iisc.ac.in",
            })
    except Exception as e:
        print(f"[GATE scrape error]: {e}")
    return results


def scrape_clat():
    """Scrape CLAT Consortium notices"""
    results = []
    try:
        url = "https://consortiumofnlus.ac.in/clat-2026/"
        r = requests.get(url, headers=HEADERS, timeout=8)
        soup = BeautifulSoup(r.text, "html.parser")

        items = soup.select(".notice a, ul li a, .updates a, article a")[:6]
        if not items:
            items = soup.find_all("a", href=True)
            items = [a for a in items if len(a.get_text(strip=True)) > 15][:6]

        for item in items:
            title = item.get_text(strip=True)
            href  = item.get("href", "")
            if not title or len(title) < 10:
                continue
            if href and not href.startswith("http"):
                href = "https://consortiumofnlus.ac.in" + href

            results.append({
                "id":               f"clat-{hash(title) % 100000}",
                "type":             "exam",
                "exam_slug":        "clat",
                "exam_name":        "CLAT",
                "college_slug":     None,
                "college_name":     None,
                "category":         "Law",
                "title":            title[:120],
                "summary":          "Official notice from Consortium of NLUs for CLAT. Click to view on consortiumofnlus.ac.in.",
                "update_type":      _classify_update_type(title),
                "date":             datetime.now().strftime("%B %d, %Y"),
                "is_new":           True,
                "official_source":  "Consortium of NLUs",
                "official_link":    href if href.startswith("http") else "https://consortiumofnlus.ac.in",
            })
    except Exception as e:
        print(f"[CLAT scrape error]: {e}")
    return results


def scrape_nbe_neet_pg():
    """Scrape NBE NEET PG notices"""
    results = []
    try:
        url = "https://nbe.edu.in/notice-board/"
        r = requests.get(url, headers=HEADERS, timeout=8)
        soup = BeautifulSoup(r.text, "html.parser")

        items = soup.select("table tr td a, ul li a, .notice a")[:6]
        if not items:
            items = soup.find_all("a", href=True)
            items = [a for a in items if len(a.get_text(strip=True)) > 15][:6]

        for item in items:
            title = item.get_text(strip=True)
            href  = item.get("href", "")
            if not title or len(title) < 10:
                continue
            if href and not href.startswith("http"):
                href = "https://nbe.edu.in" + href

            results.append({
                "id":               f"nbe-{hash(title) % 100000}",
                "type":             "exam",
                "exam_slug":        "neet-pg",
                "exam_name":        "NEET PG",
                "college_slug":     None,
                "college_name":     None,
                "category":         "Medical",
                "title":            title[:120],
                "summary":          "Official notice from National Board of Examinations for NEET PG. Click to view on nbe.edu.in.",
                "update_type":      _classify_update_type(title),
                "date":             datetime.now().strftime("%B %d, %Y"),
                "is_new":           True,
                "official_source":  "NBE",
                "official_link":    href if href.startswith("http") else "https://nbe.edu.in/notice-board/",
            })
    except Exception as e:
        print(f"[NBE scrape error]: {e}")
    return results


# ════════════════════════════════════════════════════════════════════════════
#  HELPER — classify update type from title keywords
# ════════════════════════════════════════════════════════════════════════════

def _classify_update_type(title: str) -> str:
    t = title.lower()
    if any(k in t for k in ["admit card", "hall ticket", "e-admit", "admit"]):
        return "Admit Card"
    if any(k in t for k in ["result", "score", "scorecard", "merit list", "rank"]):
        return "Result"
    if any(k in t for k in ["answer key", "provisional key", "final key", "response sheet"]):
        return "Answer Key"
    if any(k in t for k in ["application", "registration", "apply", "form", "last date"]):
        return "Application Form"
    if any(k in t for k in ["exam date", "schedule", "timetable", "date sheet", "exam city"]):
        return "Exam Date"
    if any(k in t for k in ["correction", "edit", "modify", "rectification"]):
        return "Correction Window"
    if any(k in t for k in ["cutoff", "cut-off", "qualifying marks"]):
        return "Cutoff"
    if any(k in t for k in ["counselling", "allotment", "seat", "josaa", "csab", "mcc"]):
        return "Counselling"
    return "Notification"


# ════════════════════════════════════════════════════════════════════════════
#  MAIN FETCH FUNCTION — calls all scrapers
# ════════════════════════════════════════════════════════════════════════════

def fetch_all_live():
    """Fetch from all sources, deduplicate, sort by recency"""
    print("[notifications] Fetching live data from official websites...")

    all_results = []
    scrapers = [
        scrape_nta_jee,
        scrape_nta_neet,
        scrape_upsc,
        scrape_ssc,
        scrape_ibps,
        scrape_gate,
        scrape_clat,
        scrape_nbe_neet_pg,
    ]

    for scraper in scrapers:
        try:
            data = scraper()
            all_results.extend(data)
            print(f"  [{scraper.__name__}] got {len(data)} items")
        except Exception as e:
            print(f"  [{scraper.__name__}] failed: {e}")

    # Deduplicate by id
    seen = set()
    unique = []
    for item in all_results:
        if item["id"] not in seen:
            seen.add(item["id"])
            unique.append(item)

    # Remove junk titles
    unique = [
        n for n in unique
        if len(n["title"]) > 15
        and n["title"].lower() not in ["home", "about", "contact", "login", "menu"]
    ]

    print(f"[notifications] Total unique: {len(unique)}")

    # ✅ FIX: Sirf live data return karo — stale/purana data mix nahi hoga
    # Agar 3+ items mile toh sirf live data
    if len(unique) >= 3:
        return unique

    # Bilkul kuch nahi mila toh empty list return karo
    print("[notifications] No live data found — returning empty")
    return []


# ════════════════════════════════════════════════════════════════════════════
#  FLASK ROUTES
# ════════════════════════════════════════════════════════════════════════════

@notifications_bp.route("/notifications", methods=["GET"])
def get_all_notifications():
    # Use cache if valid
    if not _is_cache_valid():
        fresh = fetch_all_live()
        if fresh:  # only update cache if we got real data
            _cache["data"] = fresh
            _cache["fetched_at"] = datetime.utcnow()

    result = list(_cache["data"])

    # Apply filters
    category     = request.args.get("category", "").strip()
    exam_slug    = request.args.get("exam", "").strip()
    update_type  = request.args.get("update_type", "").strip()
    notif_type   = request.args.get("type", "").strip()
    college_slug = request.args.get("college", "").strip()

    if category:
        result = [n for n in result if n.get("category", "").lower() == category.lower()]
    if exam_slug:
        result = [n for n in result if n.get("exam_slug") == exam_slug]
    if update_type:
        result = [n for n in result if n.get("update_type", "").lower() == update_type.lower()]
    if notif_type:
        result = [n for n in result if n.get("type", "exam") == notif_type]
    if college_slug:
        result = [n for n in result if n.get("college_slug") == college_slug]

    return jsonify(result), 200


@notifications_bp.route("/notifications/refresh", methods=["POST"])
def force_refresh():
    """Force refresh cache — call this manually if needed"""
    _cache["fetched_at"] = None
    fresh = fetch_all_live()
    if fresh:
        _cache["data"] = fresh
        _cache["fetched_at"] = datetime.utcnow()
    return jsonify({"refreshed": True, "count": len(_cache["data"])}), 200
