export const objectShallowEquals = (a, b) => {
  if (!(typeof a === 'object' && typeof b === 'object')) throw new Error('First and second arguments should be object')

  for (let key in a) {
    if (!(key in b) || a[key] !== b[key]) {
      return false;
    }
  }

  for (let key in b) {
    if (!(key in a) || a[key] !== b[key]) {
      return false;
    }
  }

  return true;
}
