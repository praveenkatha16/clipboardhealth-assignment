const { deterministicPartitionKey } = require("./dpk");

const crypto = require("crypto");

function mockCrypto(hashValue) {
  const hashMock = {
    update: jest.fn().mockReturnThis(),
    digest: jest.fn().mockReturnValueOnce(hashValue),
  };
  jest.spyOn(crypto, "createHash").mockImplementationOnce(() => hashMock);
  return hashMock;
}

describe("deterministicPartitionKey", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  test("Returns the hash of the event if no partition key is provided", () => {
    const event = { foo: "bar" };
    const hashMock = mockCrypto("foo-bar-hash");

    expect(deterministicPartitionKey(event)).toBe("foo-bar-hash");
    expect(hashMock.update).toHaveBeenCalledWith(JSON.stringify(event));
  });

  test("Returns stringified partition key if its not a string and less than 256 characters", () => {
    const event = { partitionKey: 1234 };
    const hashMock = mockCrypto();

    expect(deterministicPartitionKey(event)).toBe("1234");
    expect(hashMock.update).not.toHaveBeenCalled();
    expect(hashMock.update).not.toHaveBeenCalled();
  });

  test("Returns hash of stringified partition key if its not a string and longer than 256 characters", () => {
    const event = {
      partitionKey: { foo: "1234".repeat(32), bar: "2345".repeat(32) },
    };
    const hashMock = mockCrypto("foo-bar-hash");

    expect(deterministicPartitionKey(event)).toBe("foo-bar-hash");
    expect(hashMock.update).toHaveBeenCalledWith(
      JSON.stringify(event.partitionKey)
    );
  });

  test("Returns the partition key string if it is less than or equal to 256 characters", () => {
    const event = { partitionKey: "random_key" };
    const hashMock = mockCrypto();

    expect(deterministicPartitionKey(event)).toBe("random_key");
    expect(hashMock.update).not.toHaveBeenCalled();
    expect(hashMock.update).not.toHaveBeenCalled();
  });

  test("Returns the hash of the partition key if it is longer than 256 characters", () => {
    const event = { partitionKey: "x".repeat(257) };
    const hashMock = mockCrypto("partition-key-hash");

    expect(deterministicPartitionKey(event)).toBe("partition-key-hash");
    expect(hashMock.update).toHaveBeenCalledWith(event.partitionKey);
  });
});
