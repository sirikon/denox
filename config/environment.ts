export type ConfigFromEnvironmentData = {
  params: ConfigFromEnvironmentParam[];
};

export type ConfigFromEnvironmentParam = {
  name: string;
  opts?: {
    default?: string;
  };
};

export class ConfigFromEnvironmentBuilder<
  TConfig extends Record<string, unknown>,
> {
  constructor(
    private _data: ConfigFromEnvironmentData,
  ) {}

  public key<TParamKey extends string>(
    name: TParamKey,
    opts?: NonNullable<ConfigFromEnvironmentParam["opts"]>,
  ) {
    return new ConfigFromEnvironmentBuilder<
      TConfig & { [key in TParamKey]: string }
    >(
      {
        ...this._data,

        params: [...this._data.params, {
          name,
          opts,
        }],
      },
    );
  }

  public read(): TConfig {
    const result: Record<string, string> = {};
    for (const param of this._data.params) {
      const value = Deno.env.get(param.name);
      if (value) {
        result[param.name] = value;
        continue;
      }
      if (param.opts?.default) {
        result[param.name] = param.opts.default;
        continue;
      }
      throw new Error(`Missing required environment variable: ${param.name}`);
    }
    return result as TConfig;
  }
}

export const configFromEnvironment = () =>
  new ConfigFromEnvironmentBuilder({ params: [] });
