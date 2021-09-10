import { Component } from '../../Components/port/Component'
import { stringifyWithDetailledSetAndMap } from '../../Event/test'
import { ComponentManagement } from './ports/ComponentManagement'
import { Entity } from './ports/Entity'
import { PotentialClass } from './ports/PotentialClass'
export abstract class GenericEntity implements Entity, ComponentManagement {
    constructor (id:string) {
        this.id = id
    }

    deleteAllComponents () {
        this.components.clear()
    }

    hasComponents (): boolean {
        if (this.components.size > 0) return true
        return false
    }

    hasComponent (potentialComponent: PotentialClass<Component>): boolean {
        for (const component of this.components.values()) if (component instanceof potentialComponent) return true
        return false
    }

    addComponent (component: Component):void {
        this.components.add(component)
    }

    retrieveComponent <Class extends Component> (potentialComponent: PotentialClass<Class>):Class {
        for (const component of this.components.values()) if (component instanceof potentialComponent) return component as Class
        throw new Error(`Component '${potentialComponent.name}' missing on entity id '${this.id}'.\nAvailable components: ${stringifyWithDetailledSetAndMap(this.components)}`)
    }

    deleteComponent <Class extends Component> (potentialComponent: PotentialClass<Class>):void {
        const isDeleted = this.components.delete(this.retrieveComponent(potentialComponent))
        if (!isDeleted) throw new Error(`Component '${potentialComponent.name}' is not deleted.`)
    }

    readonly id: string
    private components:Set<Component> = new Set<Component>()
}
