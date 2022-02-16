export interface IEqualityOpt {

  sortArrays?: boolean; // should arrays be sorted before comparison?

  /**
   * if true, then there is no difference between null and undefined:
   *   equality(null, undefined) -> true
   *   equality(undefined, null) -> true
   */
  nullEqualsUndefined?: boolean;

}
