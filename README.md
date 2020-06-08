# imageHash.js

A simple image hashing library written in JavaScript.

Implemented algorithms:

- Block Hash
- Difference Hash
- Average Hash
- Median Hash
- Color Histogram Similarity

## Dependencies

- [get-pixels](https://github.com/scijs/get-pixels)
- [sharp](https://github.com/lovell/sharp)

## Usage

```javascript
const {
  BHash,
  AHash,
  DHash,
  MHash,
  hammingDistance,
  colorSimiliarity,
  HashMethod,
} = require("./imageHash");

const firstImg = "path/to/first-image";
const secondImg = "path/to/second-image";

(async () => {
  // Difference Hash
  console.log(await DHash(firstImg));

  // Average Hash
  console.log(await AHash(firstImg));

  // Median Hash
  console.log(await MHash(firstImg));

  // Block Hash
  console.log(await BHash(firstImg));

  // Hamming Distance between two images with Block Hash
  console.log(await hammingDistance(firstImg, secondImg, HashMethod.BHASH));

  // Color Based Histogram similarity between two images
  console.log(await colorSimiliarity(firstImg, secondImg));
})();
```

## References

https://ieeexplore.ieee.org/document/4041692

https://pdfs.semanticscholar.org/b59b/14d3a0d7047a63cbbcfc25582fb915f60664.pdf

https://content-blockchain.org/research/testing-different-image-hash-functions/
