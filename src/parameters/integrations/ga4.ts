import { commonEventName, commonEventProperties, commonUserProperties } from '../common';
import { ga4Event, tagTypeEq, text } from '../helpers';

export default function ga4Params() {
  const isGA4Event = tagTypeEq(ga4Event);
  const onlyForGA4 = [isGA4Event];

  return [
    text({
      name: 'ga4InstanceNames',
      displayName: 'Specific Measurement ID(s) (optional)',
      help: 'If multiple Measurement IDs are configured for the Google Analytics 4 Proxy destination type, specify one or more specific Measurement IDs to deliver to (if left blank, this event will be delivered to all configured Measurement IDs)',
      simpleValueType: true,
      enablingConditions: onlyForGA4,
    }),
    commonEventName(onlyForGA4),
    text({
      name: 'ga4EventPropsVariable',
      displayName: 'Event Properties Variable',
      help: 'If specified, must be a variable returning an object, such as a Google Tag: Event Settings or Custom JavaScript variable, in {{varname}} format',
      simpleValueType: true,
      enablingConditions: onlyForGA4,
    }),
    commonEventProperties(onlyForGA4),
    commonUserProperties(onlyForGA4),
  ];
}
