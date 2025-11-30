from app.core.connection import get_db_connection

def get_all_notes():
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("SELECT id, text FROM notes ORDER BY id ASC;")
        results = cur.fetchall()

        cur.close()
        conn.close()

        return [{"id": r[0], "text": r[1]} for r in results]

    except Exception as e:
        print("Error:", e)
        return []


def add_note(text: str):
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        query = "INSERT INTO notes (text) VALUES (%s) RETURNING id, text;"
        cur.execute(query, (text,))
        new_note = cur.fetchone()
        conn.commit()

        cur.close()
        conn.close()

        return {"id": new_note[0], "text": new_note[1]}

    except Exception as e:
        print("Error:", e)
        return None


def update_note(note_id: int, text: str):
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        query = "UPDATE notes SET text = %s WHERE id = %s RETURNING id, text;"
        cur.execute(query, (text, note_id))
        updated = cur.fetchone()
        conn.commit()

        cur.close()
        conn.close()

        return updated

    except Exception as e:
        print("Error:", e)
        return None


def delete_note(note_id: int):
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        query = "DELETE FROM notes WHERE id = %s RETURNING id;"
        cur.execute(query, (note_id,))
        deleted = cur.fetchone()
        conn.commit()

        cur.close()
        conn.close()

        return deleted

    except Exception as e:
        print("Error:", e)
        return None
