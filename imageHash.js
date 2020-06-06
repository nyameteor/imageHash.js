const getPixels = require("get-pixels");
const sharp = require("sharp");
const path = require("path");
const fs = require('fs');
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
  const resizeDir = "./img/resize";
  if (!fs.existsSync(resizeDir)) {
    fs.mkdirSync(resizeDir, { recursive: true });
  }
  const resizeImgPath = path.join(resizeDir, path.basename(imgPath));
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
const hamming_distance = async (firstImg, secondImg, hashMethod) => {
  const calculate_distance = (hash1, hash2) => {
    console.log(hash1, hash2);
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
    console.log(distance);
  };
  switch (hashMethod) {
    case HashMethod.AHASH: {
      const hash1 = await AHash(firstImg);
      const hash2 = await AHash(secondImg);
      calculate_distance(hash1, hash2);
      break;
    }
    case HashMethod.DHASH: {
      const hash1 = await DHash(firstImg);
      const hash2 = await DHash(secondImg);
      calculate_distance(hash1, hash2);
      break;
    }
    case HashMethod.MHASH: {
      const hash1 = await MHash(firstImg);
      const hash2 = await MHash(secondImg);
      calculate_distance(hash1, hash2);
      break;
    }
    case HashMethod.BHASH: {
      const hash1 = await BHash(firstImg, 8);
      const hash2 = await BHash(secondImg, 8);
      calculate_distance(hash1, hash2);
      break;
    }
    default:
      console.log(`Sorry, we are out of ${expr}.`);
  }
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
  console.log(average, hexadecimal);
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
  console.log(median, hexadecimal);
  return hexadecimal;
};

const BHash = async (imgPath, bits) => {
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

const totalValueRGB = (pixels, x, y) => {
  const r = pixels.get(x, y, 0);
  const g = pixels.get(x, y, 1);
  const b = pixels.get(x, y, 2);
  return r + g + b;
};

const getMedian = (pixels) => {
  // 2d array convert to 1d
  arr = [].concat(...pixels);
  arr = arr.sort();
  const len = arr.length;
  const mid = Math.ceil(len / 2);
  const median = len % 2 == 0 ? (arr[mid] + arr[mid - 1]) / 2 : arr[mid - 1];
  return median;
};

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
      if (v > m || (Math.abs(v - m) < 1 && m > halfBlockValue)) {
        blocks[j] = 1;
      } else {
        blocks[j] = 0;
      }
    }
  }
  return blocks;
};

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
  console.log(hexadecimal);
  return hexadecimal;
};

/**
 * init 2d array
 * 初始化 2d 数组
 *
 * @param {number} rows
 * @returns {Array}
 */
const Create2DArray = (rows) => {
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
  let arr = Create2DArray(row);
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
