export const resolvePersonDataThunkPredicates = (
  squadNumber: number | null,
  onlyIsNotUnderControl: boolean,
  archived: boolean | null
) => {
  const predicates = [];
  let resolvedPredicate = "";

  if (archived != null) {
    predicates.push(['"archived"', '"="', archived]);
  }

  if (squadNumber != null) {
    predicates.push(['"squadNumber"', '"="', squadNumber]);
  }
  if (onlyIsNotUnderControl) {
    predicates.push(['"isUnderControl"', '"="', !onlyIsNotUnderControl]);
  }

  if (predicates.length > 0) {
    if (predicates.length > 1) {
      //more that 1 predicate
      resolvedPredicate += `?filter=[[${predicates.join('],"and",[')}]]`;
      predicates.forEach((predicate) => {});
    } else if (predicates.length == 1) {
      //1 predicate
      resolvedPredicate += `?filter=[${predicates}]`;
    }
  }
  return resolvedPredicate;
};
