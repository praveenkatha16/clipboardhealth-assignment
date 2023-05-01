# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here

The function logic can be simplified as follows:

1. If the event is undefined, null, or 0, it should return `TRIVIAL_PARTITION_KEY`, i.e., '0'.
2. If the event is defined but the partition key is `undefined`, it should return the hash of the stringified event.
3. If the partition key is defined, it should first be converted to a string if it is not already one. If the resulting string is less than `MAX_PARTITION_KEY_LENGTH`(256) characters, it should be returned as is; otherwise, its hash should be returned.

For better readability, I have extracted the functions `_toString` and `_createHash`.

Note: In the original code, if the partition key was undefined and the event was defined, the code would check if the hash was less than `MAX_PARTITION_KEY_LENGTH` (256). However, this logic is unnecessary as the hash function always returns 128 characters hash, which is always less than 256. Therefore, I have removed this check.
