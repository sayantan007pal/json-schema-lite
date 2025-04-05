/**
 * @import { JsonNode } from "./jsonast.d.ts"
 */


export class Output {
  valid;
  instanceLocation;
  absoluteKeywordLocation;
  keywordLocation;
  errors;

  /**
   * @param {boolean} valid
   * @param {JsonNode} keywordNode
   * @param {JsonNode} instanceNode
   * @param {Output[]} [errors]
   */
  constructor(valid, keywordNode, instanceNode, errors) {
    this.valid = valid;
    this.absoluteKeywordLocation = keywordNode.location;
    this.instanceLocation = instanceNode.location;

    // Extract keywordLocation from absoluteKeywordLocation
    const hashIndex = keywordNode.location.indexOf("#");
    if (hashIndex !== -1) {
      this.keywordLocation = keywordNode.location.substring(hashIndex);
    }

    // Only add errors when validation fails or when errors are explicitly provided
    if (!valid || errors) {
      this.errors = errors || [];
    }
  }
}
