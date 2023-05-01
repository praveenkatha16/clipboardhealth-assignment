const crypto = require("crypto");

const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256;

exports.deterministicPartitionKey = (event) => {
  if (!event) return TRIVIAL_PARTITION_KEY;

  if (!event.partitionKey) return _createHash(JSON.stringify(event));

  const partitionKeyStr = _toString(event.partitionKey);

  return partitionKeyStr.length > MAX_PARTITION_KEY_LENGTH
    ? _createHash(partitionKeyStr)
    : partitionKeyStr;
};

function _toString(data) {
  return typeof data === "string" ? data : JSON.stringify(data);
}

function _createHash(data) {
  return crypto.createHash("sha3-512").update(data).digest("hex");
}
