import { commonEventName } from '../common';
import { tagTypeEq, nonEmpty, radio, simpleTable, text, googleCM360Event } from '../helpers';

export default function GoogleCM360Params() {
  const isGoogleCM360Event = tagTypeEq(googleCM360Event);
  const onlyForGoogleCM360 = [isGoogleCM360Event];

  return [
    text({
      name: 'googleCM360InstanceName',
      displayName: 'Specific Advertiser ID (optional)',
      help: 'If multiple Advertiser IDs are configured for the Google Campaign Manager 360 Conversions API destination type, specify one to deliver to (if left blank, this event will be delivered to all configured Conversion IDs)',
      simpleValueType: true,
      enablingConditions: onlyForGoogleCM360,
    }),
    commonEventName(onlyForGoogleCM360),
    text({
      name: 'googleCM360ActivityIDString',
      displayName: 'Activity ID',
      help: 'This is the Floodlight Activity ID (typically numeric) that conversions will be associated with. It differs from the Floodlight Activity tag string used by the native Floodlight Counter tag.',
      simpleValueType: true,
      valueValidators: [nonEmpty()],
      enablingConditions: onlyForGoogleCM360,
    }),
    simpleTable({
      name: 'googleCM360EventProperties',
      displayName: 'Event Properties',
      help: 'Google Campaign Manager 360 Conversions API accepts custom properties of the form u1, u2, etc (up to u100), as well as several additional properties. See Freshpaint documentation for a detailed list of accepted properties.',
      enablingConditions: onlyForGoogleCM360,
    }),
    radio({
      name: 'googleCM360FloodlightCountingMethod',
      displayName: 'Counting Method',
      radioItems: [
        {
          value: 'STANDARD',
          displayValue: 'Standard',
          help: 'Count every conversion.',
        },
        {
          value: 'UNIQUE',
          displayValue: 'Unique',
          help: 'Count the first conversion for each unique user during each 24-hour day, from midnight to midnight, Eastern Time (US).',
        },
        {
          value: 'SESSION',
          displayValue: 'Per Session',
          help: 'Count one conversion per user per session. Session length is set by the site where the Floodlight tag is deployed.',
        },
      ],
      simpleValueType: true,
      enablingConditions: onlyForGoogleCM360,
    }),
  ];
}
