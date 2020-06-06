# Image Hash using javascript

picture similarity comparison implemented by javascript
Implemented algorithms

- Block Hash
- Difference Hash
- Average Hash
- Median Hash

## Usage

clone this repositor

```bash
git clone https://github.com/AbyssLink/image-hash-js.git
cd image-hash-js
```

then make a new javascript file and write these for test

```javascript
const { BHash, AHash, DHash, MHash, hamming_distance } = require("./imageHash");
const HashMethod = require("./hashMethod");

firstImg = "path/to/first-image";
secondImg = "path/to/second-image";

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

## About

References: https://content-blockchain.org/research/testing-different-image-hash-functions/

```json
"dependencies": {
    "get-pixels": "^3.3.2",
    "sharp": "^0.25.3"
}
```
