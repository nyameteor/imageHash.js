# imageHash.js

Picture similarity comparison implemented by javascript.

Implemented algorithms:

- Block Hash
- Difference Hash
- Average Hash
- Median Hash
- Color Histogram Similarity 

## Usage

```javascript
const { BHash, AHash, DHash, MHash, hamming_distance } = require("./imageHash");
const HashMethod = require("./hashMethod");

const firstImg = "path/to/first-image";
const secondImg = "path/to/second-image";

// Difference Hash
DHash(firstImg);

// Average Hash
AHash(firstImg);

// Median Hash
MHash(firstImg);

// Block Hash
BHash(firstImg);

// Hamming Distance between two images with Block Hash
hamming_distance(firstImg, secondImg, HashMethod.BHASH);

// Color Based Histogram similarity between two images
colorSimiliarity(firstImg, secondImg);
```

## References

https://ieeexplore.ieee.org/document/4041692

https://pdfs.semanticscholar.org/b59b/14d3a0d7047a63cbbcfc25582fb915f60664.pdf

https://content-blockchain.org/research/testing-different-image-hash-functions/