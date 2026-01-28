import { NextRequest, NextResponse } from "next/server";
import { getMatchService } from "../../../src/infrastructure/di/container";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { playerIds, playerCount, useCombination, excludePartySeries, excludeSinglePlayer } = body as {
            playerIds: string[];
            playerCount?: number;
            useCombination?: boolean;
            excludePartySeries?: boolean;
            excludeSinglePlayer?: boolean;
        };

        if (!Array.isArray(playerIds) || playerIds.length === 0) {
            return NextResponse.json({ error: "playerIds 배열이 필요합니다." }, { status: 400 });
        }

        const matchService = getMatchService();

        // 조합 기반 매칭 (선택된 모든 참가자를 사용)
        if (useCombination) {
            if (playerIds.length < 2) {
                return NextResponse.json({ error: "조합 매칭은 최소 2명 이상이어야 합니다." }, { status: 400 });
            }
            const combinations = await matchService.findCombinationMatches({
                playerIds,
                excludePartySeries: excludePartySeries ?? false,
                excludeSinglePlayer: excludeSinglePlayer ?? false,
            });
            // 도메인 엔티티를 DTO로 변환
            const combinationsDto = combinations.map((combo) => ({
                groups: combo.groups.map((group) => ({
                    game: {
                        _id: group.game.id,
                        orderNumber: group.game.orderNumber,
                        name: group.game.name,
                        minPlayers: group.game.minPlayers,
                        maxPlayers: group.game.maxPlayers,
                        company: group.game.company,
                        series: group.game.series,
                        ownerNote: group.game.ownerNote,
                        createdAt: group.game.createdAt,
                        updatedAt: group.game.updatedAt,
                    },
                    assignedPlayers: group.assignedPlayers,
                    playerNames: group.playerNames,
                    matchScore: group.matchScore,
                    allIncomplete: group.allIncomplete,
                })),
                totalScore: combo.totalScore,
                unusedPlayers: combo.unusedPlayers,
            }));
            return NextResponse.json({ combinations: combinationsDto, type: "combination" });
        }

        // 기존 단일 게임 매칭
        if (!playerCount || playerCount < 2) {
            return NextResponse.json({ error: "playerCount는 2 이상이어야 합니다." }, { status: 400 });
        }

        const matches = await matchService.findMatches({
            playerIds,
            playerCount,
            excludePartySeries: excludePartySeries ?? false,
            excludeSinglePlayer: excludeSinglePlayer ?? false,
        });
        // 도메인 엔티티를 DTO로 변환
        const matchesDto = matches.map((match) => ({
            _id: match.game.id,
            orderNumber: match.game.orderNumber,
            name: match.game.name,
            minPlayers: match.game.minPlayers,
            maxPlayers: match.game.maxPlayers,
            company: match.game.company,
            series: match.game.series,
            ownerNote: match.game.ownerNote,
            createdAt: match.game.createdAt,
            updatedAt: match.game.updatedAt,
            matchScore: match.matchScore,
            incompletePlayers: match.incompletePlayers,
        }));
        return NextResponse.json({ matches: matchesDto, type: "single" });
    } catch (error) {
        console.error("POST /api/match error", error);
        return NextResponse.json({ error: "Failed to find matches" }, { status: 500 });
    }
}

