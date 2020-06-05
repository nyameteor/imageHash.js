var getPixels = require("get-pixels");
var sharp = require("sharp");
var path = require("path");

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
 * @param {*} firstImg
 * @param {*} secondImg
 */
const hamming_distance = async (firstImg, secondImg) => {
  const hash1 = await getHash(firstImg);
  const hash2 = await getHash(secondImg);
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

/**
 * get hash value of the picture
 * 获取图片的 hash 值
 *
 * @param {string} imgPath
 * @returns {string}
 */
const getHash = async (imgPath) => {
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
 * 异步获取像素
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
      // The weighted average method is used to grayscale the picture
      // (the human eye has the highest sensitivity to green and the lowest sensitivity to blue)
      arr[i][j] = Math.round(0.299 * r + 0.578 * g + 0.114 * b);
    }
  }
  // console.log(arr);
  return arr;
};

hamming_distance(
  "/Users/chiya/Documents/Work_Git/image-hash-js/img/632.jpg",
  "/Users/chiya/Documents/Work_Git/image-hash-js/img/139.jpg"
);
