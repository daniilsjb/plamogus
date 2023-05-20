export const partition = (data, pred) => {
  const xs = [];
  const ys = [];

  for (const item of data) {
    if (pred(item)) {
      xs.push(item);
    } else {
      ys.push(item);
    }
  }

  return [xs, ys];
};
