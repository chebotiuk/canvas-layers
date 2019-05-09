export const scale = (values, [tMin, tMax]) => {
  if (values.length === 0) return []
  
  const max = Math.max.apply(null, values);
  const min = Math.min.apply(null, values);

  let valueDiff = max - min;
  let diff = tMax - tMin;
  let incrementEvery = valueDiff / diff;

  return values.map(
    value => {
      const a = Math.round((value - min) / incrementEvery) + tMin
      return a
    }
  )
}
