"""Validate the queries in players.sql by running them against an equivalent
SQLite database. The MySQL-only bits (AUTO_INCREMENT, ENGINE, NOW()) are
translated for the test; the query logic itself is taken verbatim from the file."""

import re
import sqlite3
from pathlib import Path

SQL_FILE = Path(__file__).resolve().parent.parent / "projects" / "sql-player-database" / "players.sql"
raw = SQL_FILE.read_text(encoding="utf-8")

# --- pull the SELECT / UPDATE statements out of the file ---
queries = []
for chunk in raw.split(";"):
    body = "\n".join(
        line for line in chunk.splitlines() if not line.strip().startswith("--")
    ).strip()
    if re.match(r"^(SELECT|UPDATE)\b", body, re.IGNORECASE):
        queries.append(body)

print(f"queries found in players.sql: {len(queries)}\n")

# --- the same schema, in SQLite ---
db = sqlite3.connect(":memory:")
db.executescript("""
CREATE TABLE factions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  tag TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  faction_id INTEGER NULL,
  "rank" INTEGER NOT NULL DEFAULT 0,
  hours_played REAL NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen TEXT NULL
);
CREATE TABLE bans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL,
  reason TEXT NOT NULL,
  admin_id INTEGER NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT NULL
);
INSERT INTO factions (name, tag) VALUES
  ('Manila Police', 'MPD'), ('Cebu Medics', 'CMD'), ('Batangas Riders', 'BTR');
INSERT INTO players (username, password_hash, faction_id, "rank", hours_played) VALUES
  ('cyrus',  'x', 1,    3, 412.50),
  ('andrea', 'x', 1,    2, 288.25),
  ('miguel', 'x', 2,    1,  96.00),
  ('bianca', 'x', NULL, 0, 154.75),
  ('paolo',  'x', 3,    1,  61.50);
INSERT INTO bans (player_id, reason, admin_id, expires_at) VALUES
  (5, 'Spawn killing', 1, '2026-12-01 00:00:00'),
  (3, 'Bug abuse',     1, NULL);
""")

# --- run each query, translating the one MySQL-ism ---
ok = True
for i, query in enumerate(queries, 1):
    sqlite_query = re.sub(r"\bNOW\(\)", "datetime('now')", query, flags=re.IGNORECASE)
    title = next(
        (l.strip("- ").strip() for l in raw.splitlines()
         if l.strip().startswith(f"-- {i}.")),
        "(no comment)",
    )
    try:
        rows = db.execute(sqlite_query).fetchall()
        if query.upper().startswith("UPDATE"):
            print(f"{i}. {title}\n   UPDATE ok — {db.total_changes} row(s) changed\n")
        else:
            print(f"{i}. {title}\n   {len(rows)} row(s): {rows[:3]}{' …' if len(rows) > 3 else ''}\n")
    except Exception as exc:  # noqa: BLE001
        ok = False
        print(f"{i}. {title}\n   FAILED: {exc}\n")

print("all queries ran" if ok else "some queries failed")
raise SystemExit(0 if ok else 1)
