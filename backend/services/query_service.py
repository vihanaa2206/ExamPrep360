from models.query import Query
from models.query_db import queries_db

def add_query(name, email, question):
    q = Query(len(queries_db) + 1, name, email, question)
    queries_db.append(q)
    return q

def get_all_queries():
    for q in queries_db:
        q.update_status()
    return queries_db

def answer_query(query_id, answer):
    for q in queries_db:
        if q.id == query_id:
            q.answer = answer
            q.update_status()
            return q
    return None
