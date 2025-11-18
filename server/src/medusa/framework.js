import EventEmitter from 'events';

/**
 * A super-lightweight Medusa-inspired application container. The real Medusa
 * framework provides dependency injection, workflows, and module
 * orchestration—this file implements just enough to give our demo a taste of
 * that developer experience without relying on the npm package (which is not
 * available in this offline environment).
 */
export class MedusaApp extends EventEmitter {
  constructor({ config = {}, modules = [] } = {}) {
    super();
    this.config = config;
    this.registry = new Map();
    this.instances = new Map();

    modules.forEach((definition) => this.registerModule(definition));
  }

  registerModule({ key, deps = [], factory }) {
    if (!key || typeof factory !== 'function') {
      throw new Error('Every module needs a key and a factory function.');
    }
    this.registry.set(key, { deps, factory });
  }

  resolve(key) {
    if (this.instances.has(key)) {
      return this.instances.get(key);
    }
    const definition = this.registry.get(key);
    if (!definition) {
      throw new Error(`Module "${key}" has not been registered.`);
    }

    const dependencyBag = definition.deps.reduce((bag, depKey) => {
      bag[depKey] = this.resolve(depKey);
      return bag;
    }, {});

    const instance = definition.factory({
      app: this,
      config: this.config,
      ...dependencyBag
    });

    this.instances.set(key, instance);
    this.emit('module:resolved', key);
    return instance;
  }
}
