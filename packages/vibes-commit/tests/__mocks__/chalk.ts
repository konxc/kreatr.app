// Mock chalk for Jest tests
const identity = (text: string) => text;

const mockChalk = {
  green: identity,
  red: identity,
  yellow: identity,
  blue: identity,
  cyan: identity,
  magenta: identity,
  gray: identity,
  white: identity,
  dim: identity,
  bold: Object.assign(identity, {
    cyan: identity,
    yellow: identity,
  }),
};

export default mockChalk;
