import { commonEventProperties, equals, nonEmpty, text } from '../helpers';

export default function TikTokAdsParams() {
  const isTikTokAdsEvent = equals('tagType', 'tikTokAdsEvent');
  const onlyForTikTokAds = [isTikTokAdsEvent];

  return [
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
