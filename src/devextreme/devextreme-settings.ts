import { FilterRowOperationDescriptions } from 'devextreme/common/grids';

export const fiterRowOperationDescriptions: FilterRowOperationDescriptions = {
  startsWith: 'Начинается с',
  endsWith: 'Заканчивается на',
  contains: 'Содержит',
  notContains: 'Не содержит',
  equal: 'Полностью совпадает',
  notEqual: 'Полностью не совпадает',
  lessThan: 'До',
  greaterThan: 'После',
  lessThanOrEqual: 'До (включительно)',
  greaterThanOrEqual: 'После (включительно)',
};

export const pagerInfoText = 'Страница {0} из {1} ({2} элемент(ов))';
export const allowedPageSizes = [20, 50, 100, 150, 200];

export const stringFilterOperations = [
  'contains',
  'startswith',
  'endswith',
  '=',
  '<>',
];
export const dateNumberFilterOperations = ['=', '<', '>', '<=', '>='];

export const headerFilterTexts = {
  cancel: 'Отмена',
  ok: 'Применить',
  emptyValue: 'Пустое значение',
};
