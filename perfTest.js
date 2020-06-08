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
    console.log(filename);
    sum += await hammingDistance(
      path.join(dirname, filename),
      path.join(secDirname, filename),
      method
    );
  }
  const endTime = new Date().getTime();
  console.log("sum = ", sum);
  console.log("use time = ", endTime - startTime);
};

// Performance Test
main("grayscale", HashMethod.DHASH);
main("grayscale", HashMethod.AHASH);
main("grayscale", HashMethod.MHASH);
main("grayscale", HashMethod.BHASH);
main("smoothing", HashMethod.DHASH);
main("smoothing", HashMethod.AHASH);
main("smoothing", HashMethod.MHASH);
main("smoothing", HashMethod.BHASH);
main("add_bright", HashMethod.DHASH);
main("add_bright", HashMethod.AHASH);
main("add_bright", HashMethod.MHASH);
main("add_bright", HashMethod.BHASH);
main("dec_bright", HashMethod.DHASH);
main("dec_bright", HashMethod.AHASH);
main("dec_bright", HashMethod.MHASH);
main("dec_bright", HashMethod.BHASH);
main("add_contrast", HashMethod.DHASH);
main("add_contrast", HashMethod.AHASH);
main("add_contrast", HashMethod.MHASH);
main("add_contrast", HashMethod.BHASH);
main("dec_contrast", HashMethod.DHASH);
main("dec_contrast", HashMethod.AHASH);
main("dec_contrast", HashMethod.MHASH);
main("dec_contrast", HashMethod.BHASH);
