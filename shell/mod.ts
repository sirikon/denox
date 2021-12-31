import { Result } from "../result/mod.ts";

export type CmdResult = Result<
  { output: () => Promise<string> },
  { code: number }
>;
export type CmdOptions = Omit<Deno.RunOptions, "cmd">;

export const cmd = async (
  args: string[],
  opts?: CmdOptions,
): Promise<CmdResult> => {
  const process = Deno.run({
    cmd: args,
    ...opts,
  });
  const status = await process.status();
  if (status.success) {
    return {
      success: true,
      output: () => process.output().then((d) => new TextDecoder().decode(d)),
    };
  }
  return {
    success: false,
    code: status.code,
    error: new Error("uh"),
  };
};

export const bash = (script: string, opts?: CmdOptions) =>
  cmd(["bash", "-c", script], opts);
export const sh = (script: string, opts?: CmdOptions) =>
  cmd(["sh", "-c", script], opts);
