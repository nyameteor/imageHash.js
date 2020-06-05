const getPixels = require("get-pixels");
const sharp = require("sharp");

// resize the picture to reduce the amount of calculation
const resizeImage = async (imgPath) => {
  await sharp(imgPath).resize(8, 8).jpeg().toFile("resize.jpg");
};

// get hash value of picture
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
  console.log(difference);
  return parseInt(difference, 2).toString(16);
};

// init 2d array
const Create2DArray = (rows) => {
  var arr = [];
  for (var i = 0; i < rows; i++) {
    arr[i] = [];
  }
  return arr;
};

// async retrive pixels
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

// converted image to a grayscale two-dimensional array
const convertGrayscale = async (imgPath) => {
  resizeImage(imgPath);
  let pixels = await retrivePixels("resize.jpg");
  const row = pixels.shape[0];
  const col = pixels.shape[1];
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
  return arr;
};
