const { hammingDistance } = require("./imageHash");
const HashMethod = require("./hashMethod");
const path = require("path");

dirname = "/Users/chiya/Documents/Work_Git/coco_data/croped";
const main = async (subdir, method) => {
  let sum = 0;
  const secDirname = path.join(dirname, subdir);
  const startTime = new Date().getTime();
  for (let i = 1; i <= 100; i++) {
    let filename = "0" + i + ".jpg";
    // console.log(filename);
    sum += await hammingDistance(
      path.join(dirname, filename),
      path.join(secDirname, filename),
      method
    );
  }
  const endTime = new Date().getTime();
  console.log("---------------------------");
  console.log("transfer = ", subdir, "method = ", method);
  console.log("sum = ", sum);
  console.log("use time = ", endTime - startTime);
  console.log("---------------------------");
};

const test = async () => {
  // Performance Test
  await main("grayscale", HashMethod.DHASH);
  await main("grayscale", HashMethod.AHASH);
  await main("grayscale", HashMethod.MHASH);
  await main("grayscale", HashMethod.BHASH);
  await main("smoothing", HashMethod.DHASH);
  await main("smoothing", HashMethod.AHASH);
  await main("smoothing", HashMethod.MHASH);
  await main("smoothing", HashMethod.BHASH);
  await main("add_bright", HashMethod.DHASH);
  await main("add_bright", HashMethod.AHASH);
  await main("add_bright", HashMethod.MHASH);
  await main("add_bright", HashMethod.BHASH);
  await main("dec_bright", HashMethod.DHASH);
  await main("dec_bright", HashMethod.AHASH);
  await main("dec_bright", HashMethod.MHASH);
  await main("dec_bright", HashMethod.BHASH);
  await main("add_contrast", HashMethod.DHASH);
  await main("add_contrast", HashMethod.AHASH);
  await main("add_contrast", HashMethod.MHASH);
  await main("add_contrast", HashMethod.BHASH);
  await main("dec_contrast", HashMethod.DHASH);
  await main("dec_contrast", HashMethod.AHASH);
  await main("dec_contrast", HashMethod.MHASH);
  await main("dec_contrast", HashMethod.BHASH);
};

test();
