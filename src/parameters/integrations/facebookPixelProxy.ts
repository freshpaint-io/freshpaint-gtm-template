import { commonEventName, commonEventProperties, commonInstanceId } from '../common';
import { tagTypeEq } from '../helpers';
import { facebookPixelProxyEvent } from '../integration';

export default function FacebookPixelProxyParams() {
  const isFacebookPixelProxyEvent = tagTypeEq(facebookPixelProxyEvent);
  const onlyForFacebookPixelProxy = [isFacebookPixelProxyEvent];

  return [
    commonInstanceId(onlyForFacebookPixelProxy),
    commonEventName(onlyForFacebookPixelProxy),
    commonEventProperties(onlyForFacebookPixelProxy),
  ];
}
