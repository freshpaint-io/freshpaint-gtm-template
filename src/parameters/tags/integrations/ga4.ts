import { equals, text } from '../common';

const isGA4Event = equals('tagType', 'ga4Event');
const onlyForGA4 = [isGA4Event];

const instanceName = text({
  name: 'ga4InstanceName',
  displayName: 'Specific Measurement ID (optional)',
  help: 'If multiple Measurement IDs are configured for the GA4 destination type, specify one to deliver to (if left blank, this event will be delivered to all configured Measurement IDs)',
  simpleValueType: true,
  enablingConditions: onlyForGA4,
});
