import { commonEventName, commonEventProperties, commonInstanceId } from '../common';
import { tagTypeEq } from '../helpers';
import { googleDataManagerConversionApiEvent } from '../integration';
import { googleAdsConversionId, googleAdsConversionName } from './googleAdsConversionApi';

export default function GoogleDataManagerConversionApiParams() {
  const isGoogleDataManagerConversionApiEvent = tagTypeEq(googleDataManagerConversionApiEvent);
  const onlyForGoogleDataManagerConversionApi = [isGoogleDataManagerConversionApiEvent];

  return [
    commonInstanceId(onlyForGoogleDataManagerConversionApi),
    googleAdsConversionId(onlyForGoogleDataManagerConversionApi),
    commonEventName(onlyForGoogleDataManagerConversionApi),
    googleAdsConversionName(onlyForGoogleDataManagerConversionApi),
    commonEventProperties(onlyForGoogleDataManagerConversionApi),
  ];
}
