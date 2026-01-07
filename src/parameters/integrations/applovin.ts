import { commonEventName, commonEventProperties, commonInstanceId } from '../common';
import { tagTypeEq } from '../helpers';
import { appLovinEvent } from '../integration';

export default function AppLovinParams() {
  const isAppLovinEvent = tagTypeEq(appLovinEvent);
  const onlyForAppLovin = [isAppLovinEvent];

  return [
    commonInstanceId(onlyForAppLovin),
    commonEventName(onlyForAppLovin),
    commonEventProperties(onlyForAppLovin),
  ];
}
