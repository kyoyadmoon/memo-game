import _ from "lodash";
import config from "../configs";
const { iconNames, iconColors } = config;

export const randomIconName = () => {
  const nameIndex = _.random(iconNames.MaterialCommunityIcons.length - 1);
  return iconNames.MaterialCommunityIcons[nameIndex];
};

export const randomIconColor = () => {
  const colorIndex = _.random(iconColors.length - 1);
  return iconColors[colorIndex];
};

export const createUniqRandomIcons = (num, srcIcons = []) => {
  const uniqIcons = [...srcIcons];
  while (uniqIcons.length < num) {
    const newRandomIcon = {
      name: randomIconName(),
      color: randomIconColor()
    };
    if (_.find(uniqIcons, newRandomIcon) === undefined) {
      uniqIcons.push(newRandomIcon);
    }
  }
  return uniqIcons;
};
