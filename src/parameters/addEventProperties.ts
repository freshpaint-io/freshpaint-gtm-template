import { tagTypeEq, simpleTable } from './helpers';
import { addEventProperties } from './integration';

export default function AddEventPropertiesParams() {
  const isAddEventProperties = tagTypeEq(addEventProperties);
  const onlyForAddEventProperties = [isAddEventProperties];

  return [
    simpleTable({
      name: 'addEventPropertiesSharedProperties',
      displayName: 'Shared Event Properties',
      help: 'Any properties that should be included with all events going forward.',
      enablingConditions: onlyForAddEventProperties,
      valueValidators: [
        {
          type: 'TABLE_ROW_COUNT',
          args: [1],
        },
      ],
    }),
  ];
}
