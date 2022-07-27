import { Reflect } from "reflect_metadata/mod.ts";

// deno-lint-ignore no-explicit-any
type Clazz<T = unknown> = new (...args: any[]) => T;

// deno-lint-ignore ban-types
export type RegistrationOptions = {};

export class IocContainer {
  private registeredClazzez: Clazz[] = [];
  private clazzInfo: { [key: number]: { dependencies: Clazz[]; options: RegistrationOptions } } = {};
  private instances: { [key: number]: unknown } = {};

  public register(clazz: Clazz, dependencies: Clazz[], options: RegistrationOptions) {
    let index = this.registeredClazzez.indexOf(clazz);
    if (index === -1) {
      index = this.registeredClazzez.push(clazz) - 1;
    }
    this.clazzInfo[index] = { dependencies, options };
  }

  public resolve<T>(clazz: Clazz<T>): T {
    const index = this.registeredClazzez.indexOf(clazz);
    if (index === -1) {
      throw new Error(`Class ${clazz.name} not registered`);
    }

    if (this.instances[index] == null) {
      const info = this.clazzInfo[index];
      const dependentInstances = info.dependencies.map((d) => this.resolve(d));
      this.instances[index] = new clazz(...dependentInstances);
    }

    return this.instances[index] as T;
  }
}

export const registerDecorator = (ioc: IocContainer, opts?: RegistrationOptions) => {
  return (clazz: Clazz) => {
    const dependencies = Reflect.getMetadata("design:paramtypes", clazz) || [];
    ioc.register(clazz, dependencies, opts || {});
  };
};
