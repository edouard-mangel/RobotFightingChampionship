import { Controller } from '../../Components/Controller'
import { Physical, position } from '../../Components/Physical'
import { ControlStatus } from '../../Components/port/ControlStatus'
import { ShapeType } from '../../Components/port/ShapeType'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityId } from '../../Event/entityIds'
import { feature, featureEventDescription, clientScenario, whenEventOccurs, theEventIsSent, serverScenario, theEntityWithIdHasTheExpectedComponent } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { updatePointerState } from './updatePointerState'
feature(featureEventDescription(Action.updatePlayerPointerPosition), () => {
    clientScenario(`${Action.updatePlayerPointerState} 1 - forward to server`, updatePointerState(EntityId.playerA, position(1, 1), ControlStatus.Idle), EntityId.playerA,
        (game, adapters) => () => {
        }, [
            (game, adapters) => whenEventOccurs(game, updatePointerState(EntityId.playerAPointer, position(1, 1), ControlStatus.Idle)),
            (game, adapters) => theEventIsSent(TestStep.Then, adapters, 'server', updatePointerState(EntityId.playerAPointer, position(1, 1), ControlStatus.Idle))
        ])
    serverScenario(`${Action.updatePlayerPointerState} 2 - Update server pointer on client pointer update`, updatePointerState(EntityId.playerA, position(1, 1), ControlStatus.Active),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerAPointer).withPhysicalComponent(position(0, 0), ShapeType.pointer).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerAPointer, Physical, new Physical(EntityId.playerAPointer, position(0, 0), ShapeType.pointer)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerAPointer, Controller, new Controller(EntityId.playerAPointer, ControlStatus.Idle)),
            (game, adapters) => whenEventOccurs(game, updatePointerState(EntityId.playerAPointer, position(1, 1), ControlStatus.Active)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.playerAPointer, Physical, new Physical(EntityId.playerAPointer, position(1, 1), ShapeType.pointer)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerAPointer, Controller, new Controller(EntityId.playerAPointer, ControlStatus.Active))
        ])
})
