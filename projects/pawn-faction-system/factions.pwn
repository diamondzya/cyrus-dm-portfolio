// factions.pwn — a faction system for a roleplay server.
//
// Written in Pawn, the scripting language behind SA-MP and open.mp
// servers. Players create factions, invite others, set ranks, and the
// membership list is saved to a file so it survives a restart.
//
// Compile with the Pawn compiler (pawncc) against a_samp / open.mp.

#include <a_samp>

#define MAX_FACTIONS     (32)
#define FACTION_NAME_LEN (24)
#define FACTION_FILE     "factions.txt"

// faction ranks
#define RANK_MEMBER      (1)
#define RANK_OFFICER     (2)
#define RANK_LEADER      (3)

enum e_FACTION {
    fName[FACTION_NAME_LEN],
    fLeader,
    bool:fUsed
}

new Faction[MAX_FACTIONS][e_FACTION];
new PlayerFaction[MAX_PLAYERS];
new PlayerRank[MAX_PLAYERS];

stock FactionRankName(rank, dest[], len = sizeof dest) {
    switch (rank) {
        case RANK_LEADER:  format(dest, len, "Leader");
        case RANK_OFFICER: format(dest, len, "Officer");
        default:           format(dest, len, "Member");
    }
    return 1;
}

stock FactionCreate(const name[], leaderid) {
    if (strlen(name) < 3) {
        return 0;
    }
    for (new i = 1; i < MAX_FACTIONS; i++) {
        if (!Faction[i][fUsed]) {
            format(Faction[i][fName], FACTION_NAME_LEN, "%s", name);
            Faction[i][fLeader] = leaderid;
            Faction[i][fUsed] = true;

            PlayerFaction[leaderid] = i;
            PlayerRank[leaderid] = RANK_LEADER;
            return i;
        }
    }
    return 0;
}

stock FactionAnnounce(factionid, const message[], color) {
    for (new i = 0; i < MAX_PLAYERS; i++) {
        if (IsPlayerConnected(i) && PlayerFaction[i] == factionid) {
            SendClientMessage(i, color, message);
        }
    }
    return 1;
}

stock FactionAdd(playerid, factionid, rank) {
    PlayerFaction[playerid] = factionid;
    PlayerRank[playerid] = rank;

    new name[MAX_PLAYER_NAME], message[128];
    GetPlayerName(playerid, name, sizeof name);
    format(message, sizeof message, "%s joined the faction.", name);
    FactionAnnounce(factionid, message, 0x9BE38BFF);
    return 1;
}

stock FactionRemove(playerid) {
    new factionid = PlayerFaction[playerid];
    if (!factionid) {
        return 0;
    }
    PlayerFaction[playerid] = 0;
    PlayerRank[playerid] = 0;

    new name[MAX_PLAYER_NAME], message[128];
    GetPlayerName(playerid, name, sizeof name);
    format(message, sizeof message, "%s left the faction.", name);
    FactionAnnounce(factionid, message, 0xF87171FF);
    return 1;
}

stock FactionSave() {
    new File:handle = fopen(FACTION_FILE, io_write);
    if (!handle) {
        return 0;
    }
    for (new i = 1; i < MAX_FACTIONS; i++) {
        if (Faction[i][fUsed]) {
            new line[128];
            format(line, sizeof line, "%d|%s|%d\n", i, Faction[i][fName], Faction[i][fLeader]);
            fwrite(handle, line);
        }
    }
    fclose(handle);
    return 1;
}

public OnPlayerCommandText(playerid, cmdtext[]) {
    if (!strcmp(cmdtext, "/fcreate ", true, 9)) {
        new name[FACTION_NAME_LEN];
        strmid(name, cmdtext, 9, strlen(cmdtext), FACTION_NAME_LEN);

        new id = FactionCreate(name, playerid);
        if (!id) {
            return SendClientMessage(playerid, 0xFFAA00FF, "Usage: /fcreate <name> (3+ letters)");
        }
        SendClientMessage(playerid, 0x9BE38BFF, "Faction created. Invite players with /finvite <id>.");
        return 1;
    }

    if (!strcmp(cmdtext, "/finvite ", true, 9)) {
        if (PlayerRank[playerid] < RANK_OFFICER) {
            return SendClientMessage(playerid, 0xF87171FF, "Only officers and leaders can invite.");
        }
        new targetid = strval(cmdtext[9]);
        if (!IsPlayerConnected(targetid) || targetid == playerid) {
            return SendClientMessage(playerid, 0xF87171FF, "That player is not online.");
        }
        FactionAdd(targetid, PlayerFaction[playerid], RANK_MEMBER);
        return 1;
    }

    if (!strcmp(cmdtext, "/fleave", true)) {
        if (!FactionRemove(playerid)) {
            return SendClientMessage(playerid, 0xFFAA00FF, "You are not in a faction.");
        }
        return 1;
    }

    if (!strcmp(cmdtext, "/fmembers", true)) {
        new factionid = PlayerFaction[playerid];
        if (!factionid) {
            return SendClientMessage(playerid, 0xFFAA00FF, "You are not in a faction.");
        }

        new header[64], line[128], rank[16], name[MAX_PLAYER_NAME];
        format(header, sizeof header, "-- %s --", Faction[factionid][fName]);
        SendClientMessage(playerid, 0x5EC8F5FF, header);

        for (new i = 0; i < MAX_PLAYERS; i++) {
            if (IsPlayerConnected(i) && PlayerFaction[i] == factionid) {
                GetPlayerName(i, name, sizeof name);
                FactionRankName(PlayerRank[i], rank, sizeof rank);
                format(line, sizeof line, "%s  -  %s", name, rank);
                SendClientMessage(playerid, 0xD7E2F2FF, line);
            }
        }
        return 1;
    }

    return 0;
}

public OnPlayerDisconnect(playerid, reason) {
    FactionSave();
    return 1;
}
