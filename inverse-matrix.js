function cofactors(M, C = []) {
  for (let i=0; i<M.length; i++) {
    for (let j=0; j<M[i].length; j++) {
      if (C[i] && C[i][j] && C[i][j].value !== undefined)
      {
        continue;
      }
      const sub2x2 = getSubmatrix(i, j, M, C)
      C[i][j].value = sub2x2[0][0]*sub2x2[1][1] - sub2x2[0][1]*sub2x2[1][0];
    }
  }

  return C
}

function getSubmatrix(row, col, M, C) {
  if (C[row] && C[row][col])
  {
    return C[row][col].matrix;
  }
  if (!C[row]) C[row] = []

  m = []
  ir = 0
  ic = 0

  for (let i=0; i<M.length; i++) {
    if (i === row) continue;
    if (!m[ir]) m[ir] = []

    for (let j=0; j<M[i].length; j++) {
      if (j === col) continue;
      
      m[ir].push(M[i][j])
    }
    ir++
  }

  C[row][col] = {
    matrix: m,
  }
  return m
}


function getInverse(M, mod = 26) {
  const C = cofactors(M);

  let D = 0
  for (let i=0; i<M[0].length; i++) {
    D += (1 - (i % 2) * 2) * M[0][i] * C[0][i].value 
  }

  D = D % mod;
  if (D < 0) D = mod + D;
  D = extended_gcd(D, mod);
  
  const m = [];
  for (let i=0; i<M.length; i++) {
    m.push([]);
    for (let j=0; j<M[i].length; j++) {

      // we use the transpose matrix (flipping i & j)
      // we also need to do the mod twice, once for cofactor 
      let cofactor = (C[j][i].value * Math.pow(-1, i + j + 2)) % mod;
      if (cofactor < 0) cofactor = mod + cofactor

      // and mod again for the value
      let v = D * (cofactor) % mod;

      if (v < 0) v = mod + v;
      m[i].push(v);
    }
  }

  return m;
}

function extended_gcd(a, m) {
  a = a % m;

  for (let x=1; x<m; x++) {
    if ((a * x) % m === 1)
    {
      return x;
    }
  }

  throw new Error("[extended_gcd]: could not determine X")
}


const A = [
  [0,1,2],
  [3,4,6],
  [8,1,17]
]
const AI = getInverse(A);

console.log('input matrix:')
console.table(A);
console.log('\ninverse matrix:')
console.table(AI);