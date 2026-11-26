import { ICONS } from "@/lib/icons";
import { neutralColors, severityGoodColors } from "@/lib/enum-colors";
import type { EnumOption } from "@/lib/enum-option";

export const userActiveOption: EnumOption = {
  labelKey: "common.userStatus.active",
  icon: ICONS.memberActive,
  colors: severityGoodColors,
};

export const userInactiveOption: EnumOption = {
  labelKey: "common.userStatus.inactive",
  icon: ICONS.memberInactive,
  colors: neutralColors,
};
