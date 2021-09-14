import { describe, before, Func, it, Test } from 'mocha'
import { expect } from 'chai'
import { GameEvent } from './GameEvent'
import { GenericGameSystem } from '../Systems/Game/GenericGame'
import { Entity } from '../Entities/GenericEntity/ports/Entity'
import { PotentialClass } from '../Entities/GenericEntity/ports/PotentialClass'
import { FakeClientAdapters } from '../Systems/Game/infra/FakeClientAdapters'
import { LifeCycle } from '../Components/LifeCycle'
import { TestStep } from './TestStep'
import { GenericAdapter } from '../Systems/Game/port/genericAdapters'
import { FakeServerAdapters } from '../Systems/Game/infra/FakeServerAdapters'
import { GenericComponent } from '../Components/GenericComponent'
import { Component } from '../Components/port/Component'
import { Action } from './Action'
import { ClientGameSystem } from '../Systems/Game/ClientGame'
import { ServerGameSystem } from '../Systems/Game/ServerGame'
type ScenarioType = 'client' | 'server'
export const featureEventDescription = (action:Action): string => `Feature : ${action} events`
export const scenarioEventDescription = (ref:string, event: GameEvent|GameEvent[], scenarioType:ScenarioType): string => ((Array.isArray(event))
    ? `
    Scenario ${ref} - ${scenarioType}:\n${event.map(event => `        Event action '${event.action}.'
        Entity references :'${stringifyWithDetailledSetAndMap(event.entityRefences)}'`).join('\n        And\n')}`
    : `
    Scenario ${ref} - ${scenarioType}:
        Event action '${event.action}.'
        Entity references :'${stringifyWithDetailledSetAndMap(event.entityRefences)}'
    `
)
export const whenEventOccurs = (game:GenericGameSystem, event:GameEvent) => it(eventMessage(event), () => game.onGameEvent(event))
export const theEntityIsOnRepository = <PotentialEntity extends Entity> (
    testStep:TestStep,
    adapters: FakeServerAdapters,
    potentialEntityOrEntityId: PotentialClass<PotentialEntity> | string
) => (typeof potentialEntityOrEntityId === 'string')
        ? it(entityIdOnRepository(testStep, potentialEntityOrEntityId),
            () => expect(adapters
                .entityInteractor
                .hasEntityById(potentialEntityOrEntityId))
                .to.be.true)
        : it(entityNameOnRepository<PotentialEntity>(testStep, potentialEntityOrEntityId),
            () => expect(adapters
                .entityInteractor
                .hasEntityByClass(potentialEntityOrEntityId))
                .to.be.true)

export const theEntityIsNotOnRepository = <PotentialEntity extends Entity> (
    testStep:TestStep,
    adapters: FakeServerAdapters,
    potentialEntityOrEntityId: PotentialClass<PotentialEntity>|string
) => (typeof potentialEntityOrEntityId === 'string')
        ? it(entityIdIsNotOnRepository(testStep, potentialEntityOrEntityId),
            () => expect(adapters
                .entityInteractor
                .hasEntityById(potentialEntityOrEntityId))
                .to.be.false)
        : it(entityNameNotOnRepository<PotentialEntity>(testStep, potentialEntityOrEntityId),
            () => expect(adapters
                .entityInteractor
                .hasEntityByClass(potentialEntityOrEntityId))
                .to.be.false)

export const theEntityIsCreated = <PotentialEntity extends Entity> (
    testStep:TestStep,
    adapters: GenericAdapter,
    potentialEntityClassOrId: PotentialClass<PotentialEntity>|string
) => (typeof potentialEntityClassOrId === 'string')
        ? it(entityIdCreated(testStep, potentialEntityClassOrId),
            () => expect(adapters
                .entityInteractor
                .retrieveEntityById(potentialEntityClassOrId)
                .retrieveComponent(LifeCycle)
                .isCreated)
                .to.be.true)
        : it(entityNameCreated<PotentialEntity>(testStep, potentialEntityClassOrId),
            () => expect(adapters
                .entityInteractor
                .retrieveEntityByClass(potentialEntityClassOrId)
                .retrieveComponent(LifeCycle)
                .isCreated)
                .to.be.true)
export const theEventIsSent = (
    testStep:TestStep,
    adapters: FakeClientAdapters | FakeServerAdapters,
    gameEvent: GameEvent,
    eventSentQty?:number,
    skip?:boolean
) => (skip)
    ? it.skip(eventSentMessage(testStep, gameEvent, eventSentQty),
        () => expect(adapters
            .eventInteractor
            .retrieveEvent(gameEvent).length)
            .equal((eventSentQty) || 1))
    : it(eventSentMessage(testStep, gameEvent, eventSentQty),
        () => expect(adapters
            .eventInteractor
            .retrieveEvent(gameEvent).length)
            .equal((eventSentQty) || 1))
export const theEventIsNotSent = (
    testStep:TestStep,
    adapters: FakeClientAdapters | FakeServerAdapters,
    gameEvent: GameEvent
) => it(eventNotSentMessage(testStep, gameEvent),
    () => expect(adapters
        .eventInteractor
        .hasEvent(gameEvent))
        .to.be.false)
export const theEntityWithIdHasTheExpectedComponent = <PotentialComponent extends Component> (
    testStep:TestStep,
    adapters: FakeServerAdapters,
    entityId: string,
    potentialComponent:PotentialClass<PotentialComponent>,
    expectedComponent: GenericComponent
) => it(entityHasComponent<PotentialComponent>(testStep, entityId, potentialComponent, expectedComponent),
        () => {
            const component = adapters
                .entityInteractor
                .retrieveEntityById(entityId)
                .retrieveComponent(potentialComponent)
            expect(component).deep.equal(expectedComponent, componentDetailedComparisonMessage<PotentialComponent>(component, expectedComponent))
        })
export const theEntityWithIdDoNotHaveAnyComponent = <PotentialComponent extends Component> (
    testStep:TestStep,
    adapters: FakeServerAdapters,
    entityId: string,
    potentialComponent:PotentialClass<PotentialComponent>,
    expectedComponent: GenericComponent
) => it(entityDontHaveComponent(testStep, entityId, expectedComponent),
        () => expect(adapters
            .entityInteractor
            .retrieveEntityById(entityId)
            .hasComponents()).to.be.false)

export const stringifyWithDetailledSetAndMap = (value:any) => JSON.stringify(value, detailledStringifyForSetAndMap)
export const entityIsNotVisible = (
    testStep:TestStep,
    adapters: FakeClientAdapters,
    entityId:string
) => it(entityIsNotVisibleMessage(testStep, entityId),
    () => expect(adapters
        .drawingInteractor
        .drawIds
        .some(id => id === entityId))
        .to.be.false)
export const entityIsVisible = (
    testStep:TestStep,
    adapters: FakeClientAdapters,
    entityId:string
) => it(entityIsVisibleMessage(testStep, entityId),
    () => expect(adapters
        .drawingInteractor
        .drawIds
        .some(id => id === entityId))
        .to.be.true)
export const serverScenario = (
    ref:string,
    gameEvent:GameEvent|GameEvent[],
    nextIdentifiers:string[]|undefined,
    beforeMochaFunc:((game:ServerGameSystem, adapters:FakeServerAdapters)=>Func)|undefined,
    tests:((game:ServerGameSystem, adapters:FakeServerAdapters)=>Test)[],
    skip?:boolean
) => (skip)
    ? describe.skip(scenarioEventDescription(ref, gameEvent, 'server'), () => {
        const { adapters, game } = createServer(nextIdentifiers)
        // eslint-disable-next-line no-unused-expressions
        if (beforeMochaFunc)before(beforeMochaFunc(game, adapters))
        tests.forEach(test => test(game, adapters))
    })
    : describe(scenarioEventDescription(ref, gameEvent, 'server'), () => {
        const { adapters, game } = createServer(nextIdentifiers)
        // eslint-disable-next-line no-unused-expressions
        if (beforeMochaFunc)before(beforeMochaFunc(game, adapters))
        tests.forEach(test => test(game, adapters))
    })
export const clientScenario = (
    ref:string,
    gameEvent:GameEvent|GameEvent[],
    nextIdentifiers:string[]|undefined,
    beforeMochaFunc:((game:ClientGameSystem, adapters:FakeServerAdapters)=>Func)|undefined,
    tests:((game:ClientGameSystem, adapters:FakeClientAdapters)=>Test)[]
) => describe(scenarioEventDescription(ref, gameEvent, 'client'), () => {
    const { adapters, game } = createClient(nextIdentifiers)
    // eslint-disable-next-line no-unused-expressions
    if (beforeMochaFunc)before(beforeMochaFunc(game, adapters))
    tests.forEach(test => test(game, adapters))
})

const createClient = (nextIdentifiers?:string[]):{adapters:FakeClientAdapters, game:ClientGameSystem} => {
    const adapters = new FakeClientAdapters(nextIdentifiers)
    const game = new ClientGameSystem(adapters)
    return { adapters, game }
}
const createServer = (nextIdentifiers?:string[]):{adapters:FakeServerAdapters, game:ServerGameSystem} => {
    const adapters = new FakeServerAdapters(nextIdentifiers)
    const game = new ServerGameSystem(adapters)
    return { adapters, game }
}
const detailledStringifyForSetAndMap = (key:string, value:any):any => (value instanceof Set)
    ? [...value.values()]
    : (value instanceof Map)
        ? mapToObjectLiteral(value)
        : value
const entityDontHaveComponent = (testStep: TestStep, entityId: string, expectedComponent: GenericComponent): string => `${testStep} the entity with id '${entityId}' don't have any component. 
    ${stringifyWithDetailledSetAndMap(expectedComponent)}`
const entityHasComponent = <PotentialComponent extends Component> (testStep: TestStep, entityId: string, potentialComponent: PotentialClass<PotentialComponent>, expectedComponent: GenericComponent): string => `${testStep} the entity with id '${entityId}' has the expected '${potentialComponent.name}' component : 
    ${stringifyWithDetailledSetAndMap(expectedComponent)}`
const entityNameNotOnRepository = <PotentialEntity extends Entity> (testStep: TestStep, potentialEntityOrEntityId: PotentialClass<PotentialEntity>): string => `${testStep} there is no ${potentialEntityOrEntityId.name} entity on entities repository.`
const entityNameOnRepository = <PotentialEntity extends Entity> (testStep: TestStep, potentialEntityOrEntityId: PotentialClass<PotentialEntity>): string => `${testStep} there is a '${potentialEntityOrEntityId.name}' entity on entities repository.`
const entityNameCreated = <PotentialEntity extends Entity> (testStep: TestStep, potentialEntityClassOrId: PotentialClass<PotentialEntity>): string => `${testStep} the '${potentialEntityClassOrId.name}' entity is created.`
const entityIdOnRepository = (testStep: TestStep, potentialEntityOrEntityId: string): string => `${testStep} there is an entity with id '${potentialEntityOrEntityId}' on entities repository.`
const entityIdIsNotOnRepository = (testStep: TestStep, potentialEntityOrEntityId: string): string => `${testStep} there is no entity with id '${potentialEntityOrEntityId}' on entities repository.`
const entityIdCreated = (testStep: TestStep, potentialEntityClassOrId: string): string => `${testStep} the entity with id '${potentialEntityClassOrId}' is created.`
const componentDetailedComparisonMessage = <PotentialComponent extends Component> (component: PotentialComponent, expectedComponent: GenericComponent): string => `DETAILS\nexpected >>>>>>>> ${stringifyWithDetailledSetAndMap(component)} \nto deeply equal > ${stringifyWithDetailledSetAndMap(expectedComponent)} \n`
const eventMessage = (event:GameEvent): string => `When the event action '${event.action}' occurs with entity references '${stringifyWithDetailledSetAndMap(event.entityRefences)}'.`
const eventNotSentMessage = (testStep: TestStep, gameEvent: GameEvent): string => `${testStep} the event with action '${gameEvent.action}' is not sent with the following entity references:'${stringifyWithDetailledSetAndMap(gameEvent.entityRefences)}.`
const eventSentMessage = (testStep: TestStep, gameEvent: GameEvent, eventSentQty: number | undefined): string => `${testStep} the event with action '${gameEvent.action}' is sent with the following entity references:'${stringifyWithDetailledSetAndMap(gameEvent.entityRefences)}'${(eventSentQty) ? ` ${eventSentQty} times.` : '.'}`
const mapToObjectLiteral = (value: Map<any, any>): any => Array.from(value).reduce((obj: any, [key, value]) => {
    obj[key] = value
    return obj
}, {})
const entityIsNotVisibleMessage = (testStep: TestStep, entityId: string): string => `${testStep} the entity with id '${entityId}' is not visible.`
const entityIsVisibleMessage = (testStep: TestStep, entityId: string): string => `${testStep} the entity with id '${entityId}' is visible.`
