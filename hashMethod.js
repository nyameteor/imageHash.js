class HashMethod {
  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}

HashMethod.DHASH = new HashMethod("dhash");
HashMethod.AHASH = new HashMethod("ahash");
HashMethod.MHASH = new HashMethod("mhash");

// Freeze objects to prevent modification
// 冻结对象，防止修改
Object.freeze(HashMethod);

module.exports = HashMethod;
