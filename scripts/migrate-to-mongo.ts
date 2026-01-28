/**
 * CSV (머더 미스터리_대머리 - 오프라인 머더미스터리.csv)를 MongoDB로 마이그레이션
 *
 * 사용 전 준비:
 * - .env.local 또는 환경 변수에 MONGODB_URI, MONGODB_DB_NAME 설정
 * - MongoDB에 games, players, gameCompletions 컬렉션이 생성될 수 있도록 권한 확인
 *
 * 실행 예:
 *   npx tsx scripts/migrate-to-mongo.ts
 */

import * as fs from "fs";
import { MongoClient, ObjectId } from "mongodb";
import * as path from "path";
import { CompletionStatus } from "../types/domain";


interface CsvGameRow {
    orderNumber: number;
    name: string;
    playersRaw: string;
    company: string;
    ownerNote: string;
    completions: Record<string, CompletionStatus>;
}

function parseCsvLine(line: string): string[] {
    const values: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
            inQuotes = !inQuotes;
        } else if (ch === "," && !inQuotes) {
            values.push(current.trim());
            current = "";
        } else {
            current += ch;
        }
    }
    values.push(current.trim());
    return values;
}

function parsePlayerCount(playersStr: string): { min: number; max: number | null } {
    const match = playersStr.match(/(\d+)(?:-(\d+))?인/);
    if (!match) return { min: 4, max: null };
    const min = parseInt(match[1]!, 10);
    const max = match[2] ? parseInt(match[2], 10) : null;
    return { min, max };
}

function extractSeries(name: string): string | null {
    const m = name.match(/^([^:]+)\s*:/);
    return m ? m[1]!.trim() : null;
}

function normalizeStatus(raw: string): CompletionStatus | null {
    const s = raw.trim();
    if (!s) return null;
    if (s === "완료") return CompletionStatus.DONE;
    if (s === "X" || s === "x") return CompletionStatus.X;
    if (s === "예정") return CompletionStatus.PLANNED;
    if (s.includes("에러") || s.includes("💦")) return CompletionStatus.ERROR;
    return CompletionStatus.X;
}

function parseCsvToGames(csv: string): { games: CsvGameRow; playerNames: string[] } {
    const lines = csv.split("\n").filter((l) => l.trim());
    if (lines.length < 4) {
        throw new Error("CSV 행이 너무 적습니다.");
    }

    const header = parseCsvLine(lines[0]);
    const headers = header.map((h) => h.trim());

    const idxOrder = headers.indexOf("순서");
    const idxName = headers.indexOf("목록");
    const idxPlayers = headers.indexOf("인원");
    const idxCompany = headers.indexOf("회사");
    const idxDirector = headers.indexOf("감독");
    const idxOwner = headers.indexOf("소장(괄호:대여)");

    if (idxOrder < 0 || idxName < 0 || idxPlayers < 0 || idxCompany < 0 || idxDirector < 0 || idxOwner < 0) {
        throw new Error("CSV 헤더 구조가 예상과 다릅니다.");
    }

    const playerNames = headers.slice(idxDirector, idxOwner); // 감독 포함
    const games: CsvGameRow[] = [];

    // 0,1,2 행은 메타데이터 행이므로 3부터 시작
    for (let i = 3; i < lines.length; i++) {
        const cols = parseCsvLine(lines[i]);
        const orderStr = cols[idxOrder]?.trim();
        if (!orderStr || orderStr === "0" || isNaN(Number(orderStr))) continue;

        const order = Number(orderStr);
        const name = cols[idxName]?.trim();
        const playersRaw = cols[idxPlayers]?.trim();
        const company = cols[idxCompany]?.trim() ?? "";
        const ownerNote = cols[idxOwner]?.trim() ?? "";

        if (!name) continue;

        const completions: Record<string, CompletionStatus> = {};
        for (let j = 0; j < playerNames.length; j++) {
            const playerName = playerNames[j]!;
            const rawStatus = cols[idxDirector + j] ?? "";
            const normalized = normalizeStatus(rawStatus);
            if (normalized) {
                completions[playerName] = normalized;
            }
        }

        games.push({
            orderNumber: order,
            name,
            playersRaw,
            company,
            ownerNote,
            completions,
        });
    }

    return { games: games as any, playerNames };
}

async function main() {
    const uri = "mongodb+srv://Vercel-Admin-murder-mystery-mongo:NR2vGXszEoBwxdJO@murder-mystery-mongo.rjjikgr.mongodb.net/?retryWrites=true&w=majority";
    const dbName = "application";
    if (!uri || !dbName) {
        throw new Error("MONGODB_URI, MONGODB_DB_NAME 환경 변수를 설정하세요.");
    }

    const csvPath = path.join(__dirname, "머더 미스터리_대머리 - 오프라인 머더미스터리.csv");
    if (!fs.existsSync(csvPath)) {
        throw new Error(`CSV 파일을 찾을 수 없습니다: ${csvPath}`);
    }

    const csv = fs.readFileSync(csvPath, "utf-8");
    const { games, playerNames } = parseCsvToGames(csv);

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);

    try {
        console.log("👥 플레이어 upsert...");
        const playersCol = db.collection("players");
        const playerIdMap = new Map<string, ObjectId>();

        for (const name of playerNames) {
            if (!name.trim()) continue;
            const res = await playersCol.findOneAndUpdate(
                { name },
                { $setOnInsert: { name, createdAt: new Date() } },
                { upsert: true, returnDocument: "after" },
            );
            const doc = res ?? (await playersCol.findOne({ name }))!;
            playerIdMap.set(name, doc._id as ObjectId);
            console.log(`  ✓ ${name}`);
        }

        console.log("\n🎮 게임/완료 상태 마이그레이션...");
        const gamesCol = db.collection("games");
        const completionsCol = db.collection("gameCompletions");

        for (const g of games as any as CsvGameRow[]) {
            const { min, max } = parsePlayerCount(g.playersRaw);
            const series = extractSeries(g.name);

            const gameRes = await gamesCol.findOneAndUpdate(
                { name: g.name },
                {
                    $set: {
                        orderNumber: g.orderNumber,
                        name: g.name,
                        minPlayers: min,
                        maxPlayers: max,
                        company: g.company || null,
                        series: series || null,
                        ownerNote: g.ownerNote || null,
                        updatedAt: new Date(),
                    },
                    $setOnInsert: {
                        createdAt: new Date(),
                    },
                },
                { upsert: true, returnDocument: "after" },
            );

            const gameDoc = gameRes ?? (await gamesCol.findOne({ name: g.name }))!;
            const gameId = gameDoc._id as ObjectId;

            for (const [playerName, status] of Object.entries(g.completions)) {
                const playerId = playerIdMap.get(playerName);
                if (!playerId) continue;
                await completionsCol.updateOne(
                    { gameId, playerId },
                    {
                        $set: {
                            status,
                            completedAt: status === CompletionStatus.DONE ? new Date() : null,
                        },
                    },
                    { upsert: true },
                );
            }

            console.log(`  ✓ ${g.orderNumber}. ${g.name}`);
        }

        console.log("\n✅ MongoDB 마이그레이션 완료");
    } finally {
        await client.close();
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});

