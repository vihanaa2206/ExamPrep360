# D:\ExamPrep360\backend\ai_ingest.py
# Run: python ai_ingest.py

import os, sys
sys.path.insert(0, os.path.dirname(__file__))

from app import app
from extensions import mongo
import pypdf, io
from sentence_transformers import SentenceTransformer
from datetime import datetime, timezone

PDF_FOLDER = "./ai_pdfs"

embedder = SentenceTransformer("all-MiniLM-L6-v2")

def clean_chunk(text):
    """Clean and validate chunk — remove non-string, null bytes, weird chars."""
    if not isinstance(text, str):
        return None
    text = text.replace('\x00', '').strip()
    # Remove chunks with too many non-ASCII chars (garbled PDFs)
    ascii_ratio = sum(1 for c in text if ord(c) < 128) / max(len(text), 1)
    if ascii_ratio < 0.5:
        return None
    if len(text) < 50:
        return None
    return text

with app.app_context():
    # Get already processed files to skip them
    already_done = set(
        d["filename"] for d in mongo.db.ai_pdfs.find({}, {"filename": 1})
    )

    for filename in os.listdir(PDF_FOLDER):
        if not filename.endswith(".pdf"):
            continue

        if filename in already_done:
            print(f"Skipping (already ingested): {filename}")
            continue

        print(f"Processing: {filename}")
        try:
            with open(os.path.join(PDF_FOLDER, filename), "rb") as f:
                reader = pypdf.PdfReader(f)
                text = "".join((p.extract_text() or "") + "\n" for p in reader.pages)

            if not text.strip():
                print(f"  ⚠️ No text extracted from {filename}, skipping.")
                continue

            # Chunk
            raw_chunks, i = [], 0
            while i < len(text):
                c = clean_chunk(text[i:i+800])
                if c:
                    raw_chunks.append(c)
                i += 700

            if not raw_chunks:
                print(f"  ⚠️ No valid chunks for {filename}, skipping.")
                continue

            # Encode in small batches with error handling
            embeddings = []
            batch_size = 16
            for b in range(0, len(raw_chunks), batch_size):
                batch = raw_chunks[b:b+batch_size]
                try:
                    embs = embedder.encode(batch, batch_size=batch_size).tolist()
                    embeddings.extend(embs)
                except Exception as e:
                    print(f"  ⚠️ Batch {b//batch_size} failed, skipping: {e}")
                    # pad with None to keep index alignment
                    embeddings.extend([None] * len(batch))

            # Filter out failed embeddings
            valid_pairs = [(c, e) for c, e in zip(raw_chunks, embeddings) if e is not None]

            if not valid_pairs:
                print(f"  ❌ All embeddings failed for {filename}")
                continue

            # Save to MongoDB
            result = mongo.db.ai_pdfs.insert_one({
                "filename":   filename,
                "pages":      len(reader.pages),
                "chunks":     len(valid_pairs),
                "size_bytes": os.path.getsize(os.path.join(PDF_FOLDER, filename)),
                "uploadedAt": datetime.now(timezone.utc).isoformat(),
            })
            pdf_id = str(result.inserted_id)

            mongo.db.ai_knowledge_chunks.insert_many([
                {
                    "pdf_id":    pdf_id,
                    "filename":  filename,
                    "chunk_idx": idx,
                    "text":      c,
                    "embedding": e,
                }
                for idx, (c, e) in enumerate(valid_pairs)
            ])

            print(f"  ✅ {len(valid_pairs)} chunks saved")

        except Exception as e:
            print(f"  ❌ Error processing {filename}: {e}")
            continue

print("\n✅ Done! Check MongoDB ai_knowledge_chunks collection.")
