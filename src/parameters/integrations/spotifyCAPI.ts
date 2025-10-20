import { commonEventName, commonEventProperties, commonInstanceId } from '../common';
import { select, tagTypeEq } from '../helpers';
import { spotifyCAPIEvent } from '../integration';

export default function SpotifyCAPIParams() {
  const isSpotifyCAPIEvent = tagTypeEq(spotifyCAPIEvent);
  const onlyForSpotifyCAPI = [isSpotifyCAPIEvent];

  // See: https://adshelp.spotify.com/s/article/Spotify-Conversions-API-US
  // Note: the doc above is not clear on names, but each event below has been manually verified by calling the Spotify CAPI with that event_name.
  const selectableEventNames = [
    { value: 'ADD_TO_CART', displayValue: 'Add to Cart' },
    { value: 'ALIAS', displayValue: 'Alias' },
    { value: 'LEAD', displayValue: 'Lead' },
    { value: 'VIEW', displayValue: 'Page View' },
    { value: 'PURCHASE', displayValue: 'Purchase' },
    { value: 'SIGN_UP', displayValue: 'Sign Up' },
    { value: 'PRODUCT', displayValue: 'View Product' },
    { value: 'CHECK_OUT', displayValue: 'Start Checkout' },
    { value: 'CUSTOM_EVENT_1', displayValue: 'Custom Event 1' },
    { value: 'CUSTOM_EVENT_2', displayValue: 'Custom Event 2' },
    { value: 'CUSTOM_EVENT_3', displayValue: 'Custom Event 3' },
    { value: 'CUSTOM_EVENT_4', displayValue: 'Custom Event 4' },
    { value: 'CUSTOM_EVENT_5', displayValue: 'Custom Event 5' },
  ];

  return [
    commonInstanceId(onlyForSpotifyCAPI),
    commonEventName(onlyForSpotifyCAPI),
    select({
      name: 'spotifyCAPIEventName',
      displayName: 'Spotify CAPI Event Name',
      help: 'This will be the event_name that is sent to Spotify.',
      simpleValueType: true,
      selectItems: selectableEventNames,
      // Arbitrary default value. This is a required field in the Spotify CAPI API, so choosing a valid value.
      defaultValue: 'VIEW',
      enablingConditions: onlyForSpotifyCAPI,
    }),
    commonEventProperties(onlyForSpotifyCAPI),
  ];
}
