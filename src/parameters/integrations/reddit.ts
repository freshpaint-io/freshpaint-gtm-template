import { tagTypeEq, text } from '../helpers';
import { commonEventName, commonEventPropertiesJSONValue } from '../common';
import { redditAdsEvent } from '../integration';

export default function RedditAdsParams() {
  const isRedditAdsEvent = tagTypeEq(redditAdsEvent);
  const onlyForRedditAds = [isRedditAdsEvent];

  return [
    commonEventName(onlyForRedditAds),
    text({
      name: 'redditAdsInstanceName',
      displayName: 'Specific Account ID (optional)',
      help: 'If multiple Account IDs are configured for the Reddit Ads destination type, specify one to deliver to (if left blank, this event will be delivered to all configured Account IDs)',
      simpleValueType: true,
      enablingConditions: onlyForRedditAds,
    }),
    commonEventPropertiesJSONValue(onlyForRedditAds),
  ];
}
