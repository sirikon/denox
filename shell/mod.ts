const cmdBase = async (args: string[], pipeStdout: boolean) => {
  const process = Deno.run({
    cmd: args,
    stdout: pipeStdout ? "piped" : "inherit",
  });
  const status = await process.status();
  if (!status.success) {
    Deno.exit(status.code);
  }
  return process;
};

export const cmd = (...args: string[]) => cmdBase(args, false);
export const cmdOutput = async (...args: string[]) => {
  const process = await cmdBase(args, true);
  return new TextDecoder().decode(await process.output());
};

export const bash = (script: string) => cmd("bash", "-c", script);
export const sh = (script: string) => cmd("sh", "-c", script);
