function multi(a, b) {
  const c = createVector(a.x * b.x - a.y * b.y, a.y * b.x + b.y * a.x);
  return c;
}

function dft(X) {
  let converted = [];
  const N = X.length;
  for (let k = 0; k < N; k++) {
    let sum = createVector(0, 0);
    const omega = 2 * PI * k;
    for (let n = 0; n < N; n++) {
      const phi = (omega * n) / N;
      const exp = createVector(cos(phi), -sin(phi));
      const data = createVector(X[n].x, X[n].y);
      const mult = multi(data, exp);
      sum.add(mult.x, mult.y);
    }
    sum = createVector(sum.x / N, sum.y / N);
    freq = k;
    amp = sqrt(sum.x * sum.x + sum.y * sum.y);
    phase = atan2(sum.y, sum.x);
    converted.push({ freq: freq, amp: amp, phase: phase });
  }
  // converted[0].amp = 0;
  return converted;
}
