export type ConfigFromEnvironmentData = {
  params: ConfigFromEnvironmentParam[];
};

export type ConfigFromEnvironmentParam = {
  name: string;
  opts?: ConfigFromEnvironmentParamOpts<unknown>;
};

export type ConfigFromEnvironmentParamOpts<TParam> = {
  default?: string;
  map?: (value: string) => TParam;
};

export class ConfigFromEnvironmentBuilder<
  TConfig extends Record<never, never>,
> {
  constructor(
    private _data: ConfigFromEnvironmentData,
  ) {}

  public key<TParamKey extends string, TParam = string>(
    name: TParamKey,
    opts?: ConfigFromEnvironmentParamOpts<TParam>,
  ) {
    return new ConfigFromEnvironmentBuilder<
      TConfig & { [key in TParamKey]: TParam }
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
    const result: Record<string, unknown> = {};
    for (const param of this._data.params) {
      const value = Deno.env.get(param.name);
      const mapper = param.opts?.map || ((v: string) => v);
      if (value) {
        result[param.name] = mapper(value);
        continue;
      }
      if (param.opts?.default) {
        result[param.name] = mapper(param.opts.default);
        continue;
      }
      throw new Error(`Missing required environment variable: ${param.name}`);
    }
    return result as TConfig;
  }
}

export const configFromEnvironment = () =>
  new ConfigFromEnvironmentBuilder({ params: [] });
