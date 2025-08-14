import { commonEventName } from '../common';
import { equals, nonEmpty, text } from '../helpers';

export default function TddParams() {
  const isTddEvent = equals('tagType', 'theTradeDeskEvent');
  const onlyForTdd = [isTddEvent];

  return [
    text({
      name: 'theTradeDeskInstanceName',
      displayName: 'Specific Advertiser ID (optional)',
      help: 'If multiple Advertiser IDs are configured for theTradeDesk destination type, specify one to deliver to (if left blank, this event will be delivered to all configured Advertiser IDs)',
      simpleValueType: true,
      enablingConditions: onlyForTdd,
    }),
    commonEventName(onlyForTdd),
    text({
      name: 'theTradeDeskTrackerOrUPixelIDValue',
      displayName: 'Event Tracker ID',
      help: '(a.k.a. Tracking Tag ID as used in the Static Tracking Tag)',
      simpleValueType: true,
      enablingConditions: onlyForTdd,
      valueValidators: [nonEmpty()],
    }),
    text({
      name: 'theTradeDeskValue',
      displayName: 'Value',
      simpleValueType: true,
      enablingConditions: onlyForTdd,
    }),
    text({
      name: 'theTradeDeskPrivacySettings',
      displayName: 'Privacy Settings array (optional)',
      help: 'Privacy Settings array object',
      simpleValueType: true,
      enablingConditions: onlyForTdd,
    }),
    text({
      name: 'theTradeDeskDataProcessingOption',
      displayName: 'Data Processing Option (optional)',
      help: 'Data Processing Option object',
      simpleValueType: true,
      enablingConditions: onlyForTdd,
    }),
  ];
}
