import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { newEvent } from '../../Event/GameEvent'
export const playerReadyForMatch = (matchId: string, playerId: string) => newEvent(Action.ready, new Map([
    [EntityType.match, [matchId]],
    [EntityType.player, [playerId]]
]))
