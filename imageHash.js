const getPixels = require("get-pixels");
const sharp = require("sharp");
const path = require("path");
const HashMethod = require("./hashMethod");

/**
 * resize the picture to reduce the amount of calculation
 * 调整图片大小，以减少计算量
 *
 * @param {string} imgPath
 * @param {int} length
 * @param {int} width
 * @returns {string}
 */
const resizeImage = async (imgPath, length, width) => {
  resizeImgPath = path.join("resize", path.basename(imgPath));
  await sharp(imgPath).resize(length, width).jpeg().toFile(resizeImgPath);
  return resizeImgPath;
};

/**
 * calculate the hamming distance with hash value
 * 使用 hash 值计算汉明距离
 *
 * @param {string} firstImg
 * @param {string} secondImg
 * @param {object} hashMethod
 */
const hammingDistance = async (firstImg, secondImg, hashMethod) => {
  const calculateDistance = (hash1, hash2) => {
    const difference =
      parseInt(hash1, 16).toString(10) ^ parseInt(hash2, 16).toString(10);
    binary = parseInt(difference, 10).toString(2);
    // console.log(difference);
    distance = 0;
    for (let i = 0; i < binary.length; i++) {
      if (binary[i] == "1") {
        distance += 1;
      }
    }
    console.log("hamming distance = ", distance);
  };
  // default method = DHash
  let method = DHash;
  switch (hashMethod) {
    case HashMethod.AHASH: {
      method = AHash;
      break;
    }
    case HashMethod.DHASH: {
      method = DHash;
      break;
    }
    case HashMethod.MHASH: {
      method = MHash;
      break;
    }
    case HashMethod.BHASH: {
      method = BHash;
      break;
    }
    default:
      console.log(`Sorry, we are out of ${expr}, use DHash as default`);
  }
  const hash1 = await method(firstImg);
  const hash2 = await method(secondImg);
  calculateDistance(hash1, hash2);
};

/**
 * Difference Hash
 * From each row, the pixels are examined from left to right,
 * if left pixel value > right pixel value, add 1 to hash string, else add 0
 * 获取图片的差异哈希值
 * 从每一行开始，从左到右检查像素，如果左像素值 > 右像素值，哈希字串加 1，否则加 0
 *
 * @param {string} imgPath
 * @returns {string}
 */
const DHash = async (imgPath) => {
  let arr = await convertGrayscale(imgPath);
  let difference = "";
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[0].length; j++) {
      if (arr[i][j] > arr[i][j + 1]) {
        difference += "1";
      } else {
        difference += "0";
      }
    }
  }
  hexadecimal = parseInt(difference, 2).toString(16);
  console.log("difference hash = ", hexadecimal);
  return hexadecimal;
};

/**
 * Average Hash
 * From each row, the pixels are examined from left to right,
 * if current pixel value > average value, add 1 to hash string, else add 0
 * 获取图片的平均哈希值
 * 从每一行开始，从左到右检查像素，如果当前像素值 > 平均哈希值，哈希字串加 1，否则加 0
 *
 * @param {string} imgPath
 * @returns {string}
 */
const AHash = async (imgPath) => {
  let arr = await convertGrayscale(imgPath);
  let average = 0,
    sum = 0;
  let difference = "";
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[0].length; j++) {
      sum += arr[i][j];
    }
  }
  average = Math.round(sum / (arr.length * arr[0].length));
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[0].length; j++) {
      if (arr[i][j] > average) {
        difference += "1";
      } else {
        difference += "0";
      }
    }
  }
  hexadecimal = parseInt(difference, 2).toString(16);
  console.log("average hash = ", hexadecimal);
  return hexadecimal;
};

/**
 * Median Hash
 * From each row, the pixels are examined from left to right,
 * if current pixel value > median value, add 1 to hash string, else add 0
 * 获取图片的中位哈希值
 * 从每一行开始，从左到右检查像素，如果当前像素值 > 中位哈希值，哈希字串加 1，否则加 0
 *
 * @param {string} imgPath
 * @returns
 */
const MHash = async (imgPath) => {
  let arr = await convertGrayscale(imgPath);
  const median = getMedian(arr);
  let difference = "";
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[0].length; j++) {
      if (arr[i][j] > median) {
        difference += "1";
      } else {
        difference += "0";
      }
    }
  }
  hexadecimal = parseInt(difference, 2).toString(16);
  console.log("median hash = ", hexadecimal);
  return hexadecimal;
};

/**
 * Block Hash
 * The block hash algorithm divides the image into blocks,
 * and generates a value for each block, either 1 or 0.
 * These values are combined serially from left to right into a hash.
 * 块哈希算法将图像划分为多个块 ，并为每个 block 生成一个值 1 或 0，
 * 这些值从左到右依次组合成一个哈希。
 *
 * @param {string} imgPath
 * @param {number} [bits=8]
 * @returns {string}
 */
const BHash = async (imgPath, bits = 8) => {
  let pixels = await retrivePixels(imgPath);
  const width = pixels.shape[0];
  const height = pixels.shape[1];
  blocksizeX = Math.ceil(width / bits);
  blockSizeY = Math.ceil(height / bits);

  result = [];

  for (let y = 0; y < bits; y++) {
    for (let x = 0; x < bits; x++) {
      value = 0;

      for (let iy = 0; iy < blockSizeY; iy++) {
        for (let ix = 0; ix < blocksizeX; ix++) {
          const cx = x * blocksizeX + ix;
          const cy = y * blockSizeY + iy;
          value += totalValueRGB(pixels, cx, cy);
        }
      }

      result.push(value);
    }
  }
  const blocksArr = blocksToBits(result, blockSizeY * blocksizeX);
  return bitsToHexHash(blocksArr);
};

/**
 * get total value of rgb
 * 返回当前像素的 rgb 值之和
 * todo: 考虑是否加权
 *
 * @param {object} pixels
 * @param {number} x
 * @param {number} y
 * @returns {number}
 */
const totalValueRGB = (pixels, x, y) => {
  const r = pixels.get(x, y, 0);
  const g = pixels.get(x, y, 1);
  const b = pixels.get(x, y, 2);
  return r + g + b;
};

/**
 * get median value from 2d array
 * 从二维数组中获取中位数
 *
 * @param {object} pixels
 * @returns {number}
 */
const getMedian = (pixels) => {
  // 2d array convert to 1d
  arr = [].concat(...pixels);
  arr = arr.sort();
  const len = arr.length;
  const mid = Math.ceil(len / 2);
  const median = len % 2 == 0 ? (arr[mid] + arr[mid - 1]) / 2 : arr[mid - 1];
  return median;
};

/**
 * get blocks with bits wirte
 * 获取 blocks 的 bits 值
 *
 * @param {object} blocks
 * @param {int} pixlesPerBlock
 * @returns {object}
 */
const blocksToBits = (blocks, pixlesPerBlock) => {
  halfBlockValue = (pixlesPerBlock * 256 * 3) / 2;

  bandsize = Math.ceil(blocks.length / 4);
  for (let i = 0; i < 4; i++) {
    const m = getMedian(blocks.slice(i * bandsize, (i + 1) * bandsize));
    for (let j = i * bandsize; j < (i + 1) * bandsize; j++) {
      v = blocks[j];

      // Output a 1 if the block is brighter than the median.
      // To avoid generating hashes of all zeros or ones,
      // in that case output 0 if the median is in the lower value space, 1 otherwise
      // 如果 block > 中位数, 则输出 1
      // 为了避免生成全零或零占据大部分的哈希值, 若中位数在较低值空间中，则输出0，否则输出1
      if (v >= m || (Math.abs(v - m) < 1 && m > halfBlockValue)) {
        blocks[j] = 1;
      } else {
        blocks[j] = 0;
      }
    }
  }
  return blocks;
};

/**
 * convert blocks with bits to hexadecimal hash string
 * 将具有位值的块转换为十六进制哈希字符串
 *
 * @param {object} bits
 * @returns {string}
 */
const bitsToHexHash = (bits) => {
  bitsStr = "";
  for (let i = 0; i < bits.length; i++) {
    if (bits[i] === 1) {
      bitsStr += "1";
    } else {
      bitsStr += "0";
    }
  }
  hexadecimal = parseInt(bitsStr, 2).toString(16);
  console.log("block hash = ", hexadecimal);
  return hexadecimal;
};

/**
 * convert image to a 64-dimensional vector
 * 将图像转换为 64 维向量
 *
 * @param {string} imgPath
 * @returns {object}
 */
const colorVector = async (imgPath) => {
  let pixels = await retrivePixels(imgPath);
  const width = pixels.shape[0];
  const height = pixels.shape[1];
  let vectors = Array(64).fill(0);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const r = getPartition(pixels.get(x, y, 0));
      const g = getPartition(pixels.get(x, y, 1));
      const b = getPartition(pixels.get(x, y, 2));
      const index =
        r * Math.pow(4, 2) + g * Math.pow(4, 1) + b * Math.pow(4, 0);
      vectors[index] += 1;
    }
  }

  console.log(vectors);
  return vectors;
};

/**
 * Simplify the color space and divide the value of 0~255 into four areas
 * There are 4 zones of red, green and blue,
 * which constitute a total of 64 combinations (4 to the 3rd power)
 * 简化色彩空间，将 0~255 的值等分为四个区
 * 由于红绿蓝分别有4个区，共构成64种组合（4的3次方）
 *
 * @param {int} value
 * @returns {int}
 */
const getPartition = (value) => {
  if (value >= 0 && value <= 63) {
    return 0;
  } else if (value >= 64 && value <= 127) {
    return 1;
  } else if (value >= 128 && value <= 191) {
    return 2;
  } else if (value >= 192 && value <= 255) {
    return 3;
  }
};

/**
 * calculate the cosine similiarity of two images based on color histogram
 * 基于颜色直方图计算两个图像的余弦相似度
 *
 * @param {string} firstImg
 * @param {string} secondImg
 * @returns {number}
 */
const colorSimiliarity = async (firstImg, secondImg) => {
  let vector1 = await colorVector(firstImg);
  let vector2 = await colorVector(secondImg);
  // calculate cosine similiarity of two vectors
  let dividend = 0,
    divisor = 1;
  for (let i = 0; i < vector1.length; i++) {
    dividend += vector1[i] * vector2[i];
  }
  let absVector1 = 0,
    absVector2 = 0;
  for (let i = 0; i < vector1.length; i++) {
    absVector1 += Math.pow(vector1[i], 2);
    absVector2 += Math.pow(vector2[i], 2);
  }
  absVector1 = Math.pow(absVector1, 0.5);
  absVector2 = Math.pow(absVector2, 0.5);
  divisor = absVector1 * absVector2;
  similarity = dividend / divisor;
  console.log(similarity);
  return similarity;
};

/**
 * init 2d array
 * 初始化 2d 数组
 *
 * @param {number} rows
 * @returns {Array}
 */
const create2DArray = (rows) => {
  var arr = [];
  for (var i = 0; i < rows; i++) {
    arr[i] = [];
  }
  return arr;
};

/**
 * async retrieve pixels
 * 异步获取图片像素
 *
 * @param {string} imgPath
 * @returns {getPixel instance}
 */
const retrivePixels = (imgPath) => {
  return new Promise((resolve, reject) =>
    getPixels(imgPath, (err, pixels) => {
      if (err) {
        reject(err);
      }
      resolve(pixels);
    })
  );
};

/**
 * converted image to a grayscale two-dimensional array
 * 将图像转换为灰度二维数组
 *
 * @param {string} imgPath
 * @returns {Array}
 */
const convertGrayscale = async (imgPath) => {
  // TODO: add calculate support of different size image
  const resizeImgPath = await resizeImage(imgPath, 8, 8);
  let pixels = await retrivePixels(resizeImgPath);
  const row = pixels.shape[0];
  const col = pixels.shape[1];
  // console.log(row, col);
  // new array to store image info
  let arr = create2DArray(row);
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      const r = pixels.get(i, j, 0);
      const g = pixels.get(i, j, 1);
      const b = pixels.get(i, j, 2);
      /*
       * The weighted average method to grayscale the picture
       * (principle: the human eye has the highest sensitivity to green and the lowest sensitivity to blue)
       * 加权平均法对图片进行灰度处理
       * (原理: 人眼对绿色的敏感度最高，对蓝色的敏感度最低)
       */
      arr[i][j] = Math.round(0.299 * r + 0.578 * g + 0.114 * b);
    }
  }
  // console.log(arr);
  return arr;
};

exports.convertGrayscale = convertGrayscale;
exports.hammingDistance = hammingDistance;
exports.colorSimiliarity = colorSimiliarity;
exports.BHash = BHash;
exports.DHash = DHash;
exports.AHash = AHash;
exports.MHash = MHash;
