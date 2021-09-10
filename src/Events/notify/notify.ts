import { PhaseType } from '../../Components/port/Phase'
import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { newEvent } from '../../Event/GameEvent'
export const badPlayerNotificationMessage = (playerId:string):string => `This is not "${playerId}" phase.`
export const wrongPhaseNotificationMessage = (phaseType:PhaseType):string => `Wrong phase. Currently playing "${phaseType}" phase.`
export const outOfRangeNotificationMessage:string = 'The target is out of Range.'
export const notEnoughActionPointNotificationMessage:string = 'Not enough action point.'
export const notifyEvent = (playerId: string, message:string) => newEvent(Action.notify, new Map([
    [EntityType.player, [playerId]],
    [EntityType.message, [message]]
]))
