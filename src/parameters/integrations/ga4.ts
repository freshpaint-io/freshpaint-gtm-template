import {
  commonEventName,
  commonEventProperties,
  commonEventPropsVariable,
  commonUserProperties,
} from '../common';
import { tagTypeEq, text } from '../helpers';
import { ga4Event } from '../integration';

export default function ga4Params() {
  const isGA4Event = tagTypeEq(ga4Event);
  const onlyForGA4 = [isGA4Event];

  return [
    text({
      name: 'ga4InstanceNames',
      displayName: 'Specific Measurement ID(s) (optional)',
      help: 'If multiple Measurement IDs are configured for the Google Analytics 4 Proxy destination type, specify one or more specific Measurement IDs, comma delimited, to deliver to (if left blank, this event will be delivered to all configured Measurement IDs)',
      simpleValueType: true,
      enablingConditions: onlyForGA4,
    }),
    commonEventName(onlyForGA4),
    commonEventPropsVariable(onlyForGA4),
    commonEventProperties(onlyForGA4),
    commonUserProperties(onlyForGA4),
  ];
}
