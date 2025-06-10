/**
 * Принимает на вход сущность-наследника интерфейса Entity и значения, необходимые к обновлению ее свойств. Возвращает готовый объект с переданными значениями.
 * @param changingEntity - сущность, свойства которой необходимо обновить
 * @param values - объект свойств с их значениями
 * @returns - объект-наследник интрефейса Entity со значениями его свойств из объекта value
 */
export function updateValuesOfEntityDataTypeObject<
  T extends Entity | AuditionEntity,
>(changingEntity: T, values: any): T {
  const properties = Object.getOwnPropertyNames(values);
  properties.forEach((key) => {
    changingEntity[key as keyof T] = values[key];
  });

  return changingEntity;
}

export const isNotEmpty = (value: any) =>
  value !== undefined && value !== null && value !== '';
