import { describe, it } from 'mocha'
import { expect } from 'chai'
import { InMemoryEntityRepository } from '../GenericEntity/infra/InMemoryEntityRepository'
import { ServerGame } from './ServerGame'
import { LifeCycle } from '../../Component/LifeCycle'
import { ServerGameEventDispatcherSystem } from '../../Systems/GameEventDispatcher/ServerGameEventDispatcherSystem'
import { InMemorySystemRepository } from '../../Systems/Generic/infra/InMemorySystemInteractor'
import { newEvent } from '../../Events/port/GameEvents'
import { ServerLifeCycleSystem } from '../../Systems/LifeCycle/ServerLifeCycleSystem'
import { FakeIdentifierAdapter } from '../../Systems/LifeCycle/infra/FakeIdentifierAdapter'
import { Action } from '../../Events/port/Action'
import { EntityType } from '../../Events/port/EntityType'

describe('Feature Server Game', () => {
    describe('Scenario : Server Game Create', () => {
        const entityRepository = new InMemoryEntityRepository()
        const systemRepository = new InMemorySystemRepository()
        const serverGameEventDispatcherSystem = new ServerGameEventDispatcherSystem(entityRepository, systemRepository)
        const serverLifeCycleSystem = new ServerLifeCycleSystem(entityRepository, systemRepository, new FakeIdentifierAdapter())
        const createSimpleMatchLobbyEvent = newEvent(Action.create, EntityType.simpleMatchLobby)
        it('When the Server Game is created', () => {
            systemRepository.addSystem(serverGameEventDispatcherSystem)
            systemRepository.addSystem(serverLifeCycleSystem)
            return serverGameEventDispatcherSystem.onGameEvent(newEvent(Action.create, EntityType.serverGame))
        })
        it('Then the Server Game is created', () => {
            expect(entityRepository.retrieveEntityByClass(ServerGame).retrieveComponent(LifeCycle).isCreated).is.true
        })
        it(`And the event ${createSimpleMatchLobbyEvent.action} is sent to ${createSimpleMatchLobbyEvent.targetEntityType}`, () => {
            expect(serverGameEventDispatcherSystem.hasEvent(createSimpleMatchLobbyEvent)).is.true
        })
    })
})
