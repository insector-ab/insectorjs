import moment from 'moment';
import {strip} from 'underscore.string';
import {Model} from 'guins/model';
import {Registry, InstanceRegistry} from 'guins/registry';
import {Factory} from 'guins/factory';

import {addSymbolsToClass} from 'insectorjs/utils';
import {Graph} from 'insectorjs/models/graph';

/**
 * NodeState
 */
export class NodeState {}
addSymbolsToClass(NodeState, {
    NORMAL: 'NORMAL',
    AUTOSAVE: 'AUTOSAVE',
    DELETED: 'DELETED'
});

/**
 * Class Node
 */
export class Node extends Model {

    get id() {
        return this.get('id');
    }

    get identity() {
        if (this.has('discriminator')) {
            return this.get('discriminator');
        }
        return super.identity;
    }

    get nodeState() {
        return this.get('node_state');
    }
    set nodeState(value) {
        this.set('node_state', value);
    }

    get name() {
        return this.get('name');
    }
    set name(value) {
        return this.set('name', value);
    }

    get description() {
        return this.get('description');
    }
    set description(value) {
        return this.set('description', value);
    }

    get createdById() {
        return this.get('created_by_id');
    }

    // get createdBy() {
    //     try {
    //         return nodeRegistry.get(this.createdById);
    //     } catch (err) {}
    //     return null;
    // }

    get createdByFullname() {
        if (this.createdBy) {
            return this.createdBy.fullname;
        } else if (this.has('created_by_firstname') || this.has('created_by_surname')) {
            return strip(this.get('created_by_firstname', '') + ' ' + this.get('created_by_surname', ''));
        }
        return null;
    }

    get createdAt() {
        return moment(this.get('created_at'));
    }

    get modifiedById() {
        return this.get('modified_by_id');
    }

    // get modifiedBy() {
    //     try {
    //         return nodeRegistry.get(this.modifiedById);
    //     } catch (err) {}
    //     return null;
    // }

    get modifiedByFullname() {
        if (this.modifiedBy) {
            return this.modifiedBy.fullname;
        } else if (this.has('modified_by_firstname') || this.has('modified_by_surname')) {
            return strip(this.get('modified_by_firstname', '') + ' ' + this.get('modified_by_surname', ''));
        }
        return null;
    }

    get modifiedAt() {
        return moment(this.get('modified_at'));
    }

    get deletable() {
        return true;
    }

    get isPersisted() {
        return this.has('id');
    }

    get isModified() {
        return this.modified && (this.modified.isAfter(this.modifiedAt) || !this.isPersisted);
    }

    get isNew() {
        return !this.isPersisted && this._modified == null;
    }

    isModifiedBefore(datetime) {
        return this.modifiedAt && this.modifiedAt.isBefore(datetime);
    }

    _getDefaults() {
        let d = super._getDefaults();
        d.identity = Node.identity;
        d.discriminator = Node.discriminator;
        return d;
    }

}

Node.identity = 'node.Node';
Node.discriminator = 'node';

/**
 * nodeGraph
 * @type {Graph}
 */
export var nodeGraph = Graph.getInstance('node', {nodeRegistryKey: 'uuid', edgeRegistryKey: 'uuid', identityKey: 'discriminator'});

/**
 * nodeIdentities
 * @type {Registry}
 */
export var nodeIdentities = new Registry();
// Register Classes/Constructors
nodeIdentities.register(Node.discriminator, Node);

/**
 * nodeFactory
 * @type {Factory}
 */
export var nodeFactory = new Factory(nodeIdentities, 'discriminator');

/**
 * nodeRegistry
 * @type {InstanceRegistry}
 */
export var nodeRegistry = InstanceRegistry.get('node', 'uuid', nodeFactory);
// Do not allow Instances that cannot be created via factory
nodeRegistry.allowNonFactoryInstances = false;