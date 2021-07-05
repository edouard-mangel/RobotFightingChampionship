import { GameEvent } from '../../Events/port/GameEvent'
import { DrawingPort } from './port/DrawingPort'
import { GenericSystem } from '../Generic/GenericSystem'
import { EntityInteractor } from '../../Entities/GenericEntity/ports/EntityInteractor'
import { errorMessageOnUnknownEventAction, MissingTargetEntityId, newEvent } from '../../Events/port/GameEvents'
import { GenericGameEventDispatcherSystem } from '../GameEventDispatcher/GenericGameEventDispatcherSystem'
import { EntityType } from '../../Events/port/EntityType'
import { Action } from '../../Events/port/Action'
export const simpleMatchLobbyShow = newEvent(Action.show, EntityType.nothing, EntityType.simpleMatchLobby)
export const mainMenuShowEvent = (mainMenuEntityId:string) => newEvent(Action.show, EntityType.nothing, EntityType.mainMenu, mainMenuEntityId)
export const mainMenuHideEvent = (mainMenuEntityId:string) => newEvent(Action.hide, EntityType.nothing, EntityType.mainMenu, mainMenuEntityId)
export class DrawingSystem extends GenericSystem {
    constructor (interactWithEntities: EntityInteractor, gameEventDispatcher: GenericGameEventDispatcherSystem, drawingPort:DrawingPort) {
        super(interactWithEntities, gameEventDispatcher)
        this.drawingPort = drawingPort
    }

    onGameEvent (gameEvent: GameEvent): Promise<void> {
        if (gameEvent.targetEntityId === undefined) throw new Error(MissingTargetEntityId)
        if (gameEvent.action === 'Show') return this.drawingPort.drawEntity(gameEvent.targetEntityId)
        if (gameEvent.action === 'Hide') return this.drawingPort.eraseEntity(gameEvent.targetEntityId)
        throw errorMessageOnUnknownEventAction(DrawingSystem.name, gameEvent)
    }

    private drawingPort: DrawingPort
}
