import { MapelMateri, INITIAL_MATERIALS } from "./materials";
import { EXTRA_MATERIALS } from "./materialsExtra";

export const ALL_INITIAL_MATERIALS: Record<string, MapelMateri> = {
  ...INITIAL_MATERIALS,
  ...EXTRA_MATERIALS,
};
