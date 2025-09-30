import { commonEventName, commonEventProperties } from '../common';
import { select, tagTypeEq, text } from '../helpers';
import { snapchatEvent } from '../integration';

export default function SnapchatParams() {
  const isSnapchatEvent = tagTypeEq(snapchatEvent);
  const onlyForSnapchat = [isSnapchatEvent];

  // See: https://developers.snap.com/api/marketing-api/Conversions-API/Parameters#server-parameters
  const selectableEventNames = [
    { value: 'PURCHASE', displayValue: 'Purchase' },
    { value: 'SAVE', displayValue: 'Save' },
    { value: 'START_CHECKOUT', displayValue: 'Start Checkout' },
    { value: 'ADD_CART', displayValue: 'Add Cart' },
    { value: 'VIEW_CONTENT', displayValue: 'View Content' },
    { value: 'ADD_BILLING', displayValue: 'Add Billing' },
    { value: 'SIGN_UP', displayValue: 'Sign Up' },
    { value: 'SEARCH', displayValue: 'Search' },
    { value: 'PAGE_VIEW', displayValue: 'Page View' },
    { value: 'SUBSCRIBE', displayValue: 'Subscribe' },
    { value: 'AD_CLICK', displayValue: 'Ad Click' },
    { value: 'AD_VIEW', displayValue: 'Ad View' },
    { value: 'COMPLETE_TUTORIAL', displayValue: 'Complete Tutorial' },
    { value: 'LEVEL_COMPLETE', displayValue: 'Level Complete' },
    { value: 'INVITE', displayValue: 'Invite' },
    { value: 'LOGIN', displayValue: 'Login' },
    { value: 'SHARE', displayValue: 'Share' },
    { value: 'RESERVE', displayValue: 'Reserve' },
    { value: 'ACHIEVEMENT_UNLOCKED', displayValue: 'Achievement Unlocked' },
    { value: 'ADD_TO_WISHLIST', displayValue: 'Add To Wishlist' },
    { value: 'SPENT_CREDITS', displayValue: 'Spent Credits' },
    { value: 'RATE', displayValue: 'Rate' },
    { value: 'START_TRIAL', displayValue: 'Start Trial' },
    { value: 'LIST_VIEW', displayValue: 'List View' },
    { value: 'APP_INSTALL', displayValue: 'App Install' },
    { value: 'APP_OPEN', displayValue: 'App Open' },
    { value: 'CUSTOM_EVENT_1', displayValue: 'Custom Event 1' },
    { value: 'CUSTOM_EVENT_2', displayValue: 'Custom Event 2' },
    { value: 'CUSTOM_EVENT_3', displayValue: 'Custom Event 3' },
    { value: 'CUSTOM_EVENT_4', displayValue: 'Custom Event 4' },
    { value: 'CUSTOM_EVENT_5', displayValue: 'Custom Event 5' },
  ];

  return [
    text({
      name: 'snapchatInstanceName',
      displayName: 'Pixel ID',
      help: 'If multiple Pixel IDs are configured for the Snapchat destination type, specify one to deliver to (if left blank, this event will be delivered to all configured Pixel IDs)',
      simpleValueType: true,
      enablingConditions: onlyForSnapchat,
    }),
    commonEventName(onlyForSnapchat),
    select({
      name: 'snapchatEventName',
      displayName: 'Snapchat Event Name',
      help: 'This will be the event_name that is sent to Snapchat.',
      simpleValueType: true,
      selectItems: selectableEventNames,
      // Arbitrary default value. This is a required field in the Snapchat API, so choosing a valid value.
      defaultValue: 'PAGE_VIEW',
      enablingConditions: onlyForSnapchat,
    }),
    commonEventProperties(onlyForSnapchat),
  ];
}
