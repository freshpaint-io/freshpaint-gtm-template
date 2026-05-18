import { commonEventName, commonEventProperties } from '../common';
import { tagTypeEq, nonEmpty, text } from '../helpers';
import { simplifiCAPIEvent } from '../integration';

export default function SimplifiCAPIParams() {
  const isSimplifiCAPIEvent = tagTypeEq(simplifiCAPIEvent);
  const onlyForSimplifiCAPI = [isSimplifiCAPIEvent];

  return [
    commonEventName(onlyForSimplifiCAPI),
    text({
      name: 'simplifiAudienceKey',
      displayName: 'Simpli.fi Audience Key',
      help: 'Property that identifies the Simpli.fi Conversion Audience you want to attribute the conversion to. Each conversion event must have an audience_key matching the relevant Simpli.fi Conversion Audience key.',
      simpleValueType: true,
      enablingConditions: onlyForSimplifiCAPI,
      valueValidators: [nonEmpty()],
    }),
    commonEventProperties(onlyForSimplifiCAPI),
  ];
}
