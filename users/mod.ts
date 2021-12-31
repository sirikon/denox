import { bash, cmdOutput } from "../shell/mod.ts";

export const ensureGroup = (groupName: string) =>
  bash(
    `getent group "${groupName}" &>/dev/null || groupadd --system "${groupName}"`,
  );

export const ensureUser = (userName: string, groupName: string, home: string) =>
  bash(`
    id -u "${userName}" &>/dev/null || useradd \\
      --system --gid "${groupName}" \\
      --home-dir "${home}" --create-home \\
      --shell "/usr/bin/bash" "${userName}"
  `);

export const getCurrentUser = async () =>
  (await cmdOutput("id", "-un")).replaceAll("\n", "").trim();
