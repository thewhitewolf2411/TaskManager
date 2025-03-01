class ClassRegistry {
  private instances: Record<string, any> = {};

  register<T>(className: string, instance: T): void {
    this.instances[className] = instance;
  }

  get<T>(className: string): T | undefined {
    return this.instances[className];
  }
}

const classRegistry = new ClassRegistry()

export default classRegistry