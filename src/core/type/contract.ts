export interface IEqualityCheckOpt {

  /**
   * if true, then there is no difference between null and undefined:
   *   isEqual(null, undefined) -> true
   *   isEqual(undefined, null) -> true
   */
  isNullEqualsUndefined?: boolean;

  sortArrays?: boolean; // should arrays be sorted before comparison?

}
