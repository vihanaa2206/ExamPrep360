# backend/routes/ai_chat_routes.py
# PATH: D:\ExamPrep360\backend\routes\ai_chat_routes.py

import os
import numpy as np
from flask import Blueprint, request, jsonify
from extensions import mongo
from bson import ObjectId
from datetime import datetime, timezone

ai_chat_bp = Blueprint("ai_chat", __name__)

# ── Lazy-load heavy models once ──────────────────────────────────────────────
_embedder    = None
_groq_client = None

def get_embedder():
    global _embedder
    if _embedder is None:
        from sentence_transformers import SentenceTransformer
        print("⏳ Loading embedding model (first request only)...")
        _embedder = SentenceTransformer("all-MiniLM-L6-v2")
        print("✅ Embedding model loaded!")
    return _embedder

def get_groq():
    global _groq_client
    if _groq_client is None:
        from groq import Groq
        api_key = os.environ.get("GROQ_API_KEY", "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")
        _groq_client = Groq(api_key=api_key)
    return _groq_client

def cosine_sim(a, b):
    a, b = np.array(a), np.array(b)
    d = np.linalg.norm(a) * np.linalg.norm(b)
    return float(np.dot(a, b) / d) if d else 0.0

def get_context(query, n=10):
    try:
        emb = get_embedder().encode(query).tolist()
        chunks = list(mongo.db.ai_knowledge_chunks.find({}, {"text": 1, "embedding": 1}))
        if not chunks:
            return "No knowledge base found. Please ask admin to upload study material."
        scored = sorted(
            [(cosine_sim(emb, c["embedding"]), c["text"]) for c in chunks if "embedding" in c],
            reverse=True
        )
        return "\n\n".join(t for _, t in scored[:n])
    except Exception as e:
        print(f"Context error: {e}")
        return "Unable to fetch context."


# ════════════════════════════════════════════════════
# CHAT ENDPOINT  — called by FloatingAIChatbot.jsx
# ════════════════════════════════════════════════════
@ai_chat_bp.route("/chat", methods=["POST"])
def chat():
    data    = request.get_json(silent=True) or {}
    message = (data.get("message") or data.get("query") or "").strip()
    if not message:
        return jsonify({"reply": "Please ask a question.", "query_type": "general"}), 200

    try:
        context = get_context(message)
        system_prompt = (
            "You are a strict AI study assistant for Indian competitive exams.\n\n"
            "STRICT RULES:\n"
            "1. ONLY use information from the Exam Content below.\n"
            "2. If answer not in content say: 'This information is not available in my current knowledge base.'\n"
            "3. NEVER guess or assume exam patterns, marking schemes, or rules.\n"
            "4. Be direct and precise.\n\n"
            "Exam Content:\n" + context
        )
        response = get_groq().chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user",   "content": message},
            ],
            max_tokens=1500,
        )
        reply = response.choices[0].message.content
        return jsonify({"reply": reply, "query_type": "exam"}), 200

    except Exception as e:
        print(f"Chat error: {e}")
        return jsonify({"reply": "Sorry, something went wrong. Please try again.", "query_type": "error"}), 500


# ════════════════════════════════════════════════════
# SESSION SAVE  — called by FloatingAIChatbot.jsx
# ════════════════════════════════════════════════════
@ai_chat_bp.route("/api/ai-chat/save-session", methods=["POST"])
def save_session():
    data = request.get_json(silent=True) or {}
    sid  = data.get("sessionId")
    if not sid:
        return jsonify({"error": "sessionId required"}), 400
    doc = {
        "sessionId": sid,
        "userId":    data.get("userId"),
        "userName":  data.get("userName"),
        "userEmail": data.get("userEmail"),
        "messages":  data.get("messages", []),
        "startedAt": data.get("startedAt", datetime.now(timezone.utc).isoformat()),
        "updatedAt": datetime.now(timezone.utc).isoformat(),
    }
    mongo.db.ai_chat_sessions.update_one({"sessionId": sid}, {"$set": doc}, upsert=True)
    return jsonify({"ok": True}), 200


# ════════════════════════════════════════════════════
# ADMIN — SESSIONS
# ════════════════════════════════════════════════════
@ai_chat_bp.route("/api/ai-chat/sessions", methods=["GET"])
def get_sessions():
    if not request.headers.get("Authorization", "").startswith("Bearer "):
        return jsonify({"error": "Unauthorized"}), 401
    docs = list(mongo.db.ai_chat_sessions.find().sort("startedAt", -1).limit(500))
    for d in docs: d["_id"] = str(d["_id"])
    return jsonify(docs), 200

@ai_chat_bp.route("/api/ai-chat/sessions/<session_id>", methods=["DELETE"])
def delete_session(session_id):
    if not request.headers.get("Authorization", "").startswith("Bearer "):
        return jsonify({"error": "Unauthorized"}), 401
    try:
        mongo.db.ai_chat_sessions.delete_one({"_id": ObjectId(session_id)})
    except Exception:
        mongo.db.ai_chat_sessions.delete_one({"sessionId": session_id})
    return jsonify({"ok": True}), 200

@ai_chat_bp.route("/api/ai-chat/sessions/clear-all", methods=["DELETE"])
def clear_all_sessions():
    if not request.headers.get("Authorization", "").startswith("Bearer "):
        return jsonify({"error": "Unauthorized"}), 401
    mongo.db.ai_chat_sessions.delete_many({})
    return jsonify({"ok": True}), 200


# ════════════════════════════════════════════════════
# ADMIN — PDF UPLOAD + INGEST
# ════════════════════════════════════════════════════
@ai_chat_bp.route("/api/ai-chat/upload-pdf", methods=["POST"])
def upload_pdf():
    if not request.headers.get("Authorization", "").startswith("Bearer "):
        return jsonify({"error": "Unauthorized"}), 401
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400
    file = request.files["file"]
    if not file.filename.lower().endswith(".pdf"):
        return jsonify({"error": "Only PDF files allowed"}), 400

    try:
        import pypdf, io
        pdf_bytes = file.read()
        reader    = pypdf.PdfReader(io.BytesIO(pdf_bytes))
        full_text = "".join((p.extract_text() or "") + "\n" for p in reader.pages)
        if not full_text.strip():
            return jsonify({"error": "Could not extract text from PDF"}), 400

        # Save metadata
        pdf_doc = {
            "filename":   file.filename,
            "size_bytes": len(pdf_bytes),
            "pages":      len(reader.pages),
            "uploadedAt": datetime.now(timezone.utc).isoformat(),
            "chunks":     0,
        }
        result = mongo.db.ai_pdfs.insert_one(pdf_doc)
        pdf_id = str(result.inserted_id)

        # Chunk (800 chars, 100 overlap)
        chunks, i = [], 0
        while i < len(full_text):
            chunk = full_text[i:i+800].strip().replace('\x00', '')
            if len(chunk) > 50:
                chunks.append(chunk)
            i += 700

        # Embed + store
        embeddings = get_embedder().encode(chunks, batch_size=32, show_progress_bar=False).tolist()
        bulk = [
            {"pdf_id": pdf_id, "filename": file.filename, "chunk_idx": idx, "text": c, "embedding": e}
            for idx, (c, e) in enumerate(zip(chunks, embeddings))
        ]
        if bulk:
            mongo.db.ai_knowledge_chunks.insert_many(bulk)
        mongo.db.ai_pdfs.update_one({"_id": result.inserted_id}, {"$set": {"chunks": len(bulk)}})

        return jsonify({"ok": True, "pdf_id": pdf_id, "filename": file.filename,
                        "chunks": len(bulk), "pages": len(reader.pages)}), 200
    except Exception as e:
        print(f"PDF upload error: {e}")
        return jsonify({"error": str(e)}), 500


# ════════════════════════════════════════════════════
# ADMIN — LIST + DELETE PDFs
# ════════════════════════════════════════════════════
@ai_chat_bp.route("/api/ai-chat/pdfs", methods=["GET"])
def get_pdfs():
    if not request.headers.get("Authorization", "").startswith("Bearer "):
        return jsonify({"error": "Unauthorized"}), 401
    docs = list(mongo.db.ai_pdfs.find({}, {"embedding": 0}))
    for d in docs: d["_id"] = str(d["_id"])
    return jsonify(docs), 200

@ai_chat_bp.route("/api/ai-chat/pdfs/<pdf_id>", methods=["DELETE"])
def delete_pdf(pdf_id):
    if not request.headers.get("Authorization", "").startswith("Bearer "):
        return jsonify({"error": "Unauthorized"}), 401
    try:
        mongo.db.ai_knowledge_chunks.delete_many({"pdf_id": pdf_id})
        mongo.db.ai_pdfs.delete_one({"_id": ObjectId(pdf_id)})
        return jsonify({"ok": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
