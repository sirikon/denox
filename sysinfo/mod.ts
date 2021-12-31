import { cmdOutput } from "../shell/mod.ts";

export const getRelease = async () =>
  (await cmdOutput("lsb_release", "-cs")).replace("\n", "").toLowerCase();

export const getDistribution = async () =>
  (await cmdOutput("lsb_release", "-is")).replace("\n", "").toLowerCase();
