# imageHash.js

Picture similarity comparison implemented by javascript.

Implemented algorithms:

- Block Hash
- Difference Hash
- Average Hash
- Median Hash

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
```

## References

https://content-blockchain.org/research/testing-different-image-hash-functions/
