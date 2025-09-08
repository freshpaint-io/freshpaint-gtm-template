import { commonEventProperties } from '../common';
import { tagTypeEq, nonEmpty, text } from '../helpers';
import { tikTokAdsEvent } from '../integration';

export default function TikTokAdsParams() {
  const isTikTokAdsEvent = tagTypeEq(tikTokAdsEvent);
  const onlyForTikTokAds = [isTikTokAdsEvent];

  return [
    text({
      name: 'tikTokAdsInstanceNames',
      displayName: 'Specific Pixel ID(s) (optional)',
      help: 'If multiple Pixel IDs are configured for the TikTok Ads API destination type, specify one or more specific Pixel IDs, comma delimited, to deliver to (if left blank, this event will be delivered to all configured Pixel IDs)',
      simpleValueType: true,
      enablingConditions: onlyForTikTokAds,
    }),
    text({
      name: 'tikTokAdsEventName',
      displayName: 'TikTok Event Name',
      help: 'Enter the name of the TikTok event you want to track. This can be a standard event name or a custom event name.',
      simpleValueType: true,
      enablingConditions: onlyForTikTokAds,
      valueValidators: [nonEmpty()],
    }),
    commonEventProperties(onlyForTikTokAds),
  ];
}
