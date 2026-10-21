-- players.sql — the database behind a multiplayer roleplay server.
--
-- The schema the game server and its website share: accounts, factions,
-- membership ranks, and bans — plus the queries they run most.

CREATE TABLE factions (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(32)  NOT NULL UNIQUE,
  tag        VARCHAR(8)   NOT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

CREATE TABLE players (
  id            INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(24)   NOT NULL UNIQUE,
  password_hash CHAR(60)      NOT NULL,
  faction_id    INT UNSIGNED  NULL,
  rank          TINYINT       NOT NULL DEFAULT 0,
  hours_played  DECIMAL(8, 2) NOT NULL DEFAULT 0,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen     DATETIME      NULL,
  CONSTRAINT fk_players_faction
    FOREIGN KEY (faction_id) REFERENCES factions (id)
    ON DELETE SET NULL
) ENGINE = InnoDB;

CREATE TABLE bans (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  player_id  INT UNSIGNED NOT NULL,
  reason     VARCHAR(120) NOT NULL,
  admin_id   INT UNSIGNED NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME     NULL,
  CONSTRAINT fk_bans_player
    FOREIGN KEY (player_id) REFERENCES players (id)
    ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE INDEX idx_players_hours ON players (hours_played DESC);
CREATE INDEX idx_bans_expires ON bans (expires_at);

-- Sample rows, so the queries below have something to chew on.
INSERT INTO factions (name, tag) VALUES
  ('Manila Police', 'MPD'), ('Cebu Medics', 'CMD'), ('Batangas Riders', 'BTR');

INSERT INTO players (username, password_hash, faction_id, rank, hours_played) VALUES
  ('cyrus',    '$2y$10$abcdefghijklmnopqrstuv', 1, 3, 412.50),
  ('andrea',   '$2y$10$abcdefghijklmnopqrstuv', 1, 2, 288.25),
  ('miguel',   '$2y$10$abcdefghijklmnopqrstuv', 2, 1,  96.00),
  ('bianca',   '$2y$10$abcdefghijklmnopqrstuv', NULL, 0, 154.75),
  ('paolo',    '$2y$10$abcdefghijklmnopqrstuv', 3, 1,  61.50);

INSERT INTO bans (player_id, reason, admin_id, expires_at) VALUES
  (5, 'Spawn killing', 1, '2026-12-01 00:00:00'),
  (3, 'Bug abuse',     1, NULL);

-- 1. Leaderboard: the ten players with the most hours in-game.
SELECT username, hours_played
FROM players
ORDER BY hours_played DESC
LIMIT 10;

-- 2. Faction roster, highest rank first.
SELECT f.name AS faction, p.username, p.rank, p.hours_played
FROM players AS p
JOIN factions AS f ON f.id = p.faction_id
WHERE f.id = 1
ORDER BY p.rank DESC, p.hours_played DESC;

-- 3. Every ban that is still active (NULL expiry means permanent).
SELECT p.username, b.reason, b.expires_at
FROM bans AS b
JOIN players AS p ON p.id = b.player_id
WHERE b.expires_at IS NULL OR b.expires_at > NOW()
ORDER BY b.created_at DESC;

-- 4. Faction sizes and average activity, biggest first.
SELECT f.name,
       COUNT(p.id) AS members,
       ROUND(AVG(p.hours_played), 1) AS avg_hours
FROM factions AS f
LEFT JOIN players AS p ON p.faction_id = f.id
GROUP BY f.id, f.name
ORDER BY members DESC;

-- 5. Promote veterans: unaffiliated players with 100+ hours join the
--    default faction at rank 1.
UPDATE players
SET faction_id = 1, rank = 1
WHERE faction_id IS NULL AND hours_played >= 100;
