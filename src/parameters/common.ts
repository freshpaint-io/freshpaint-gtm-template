import {
  EnablingCondition,
  Text,
  Select,
  text,
  nonEmpty,
  simpleTable,
  radio,
  paramTable,
  select,
} from './helpers';
import { trackDestinationSelectItems } from './integration';

export const commonEventName = (enablingConditions: Array<EnablingCondition> = []): Text => {
  return text({
    name: 'commonEventName',
    displayName: 'Freshpaint Event Name',
    help: 'This will be the event name that you see in Freshpaint - it is sent to only certain destinations, including Google Analytics 4 (Proxy).',
    simpleValueType: true,
    valueValidators: [nonEmpty()],
    enablingConditions,
  });
};

export const commonSelectableEventName = (
  enablingConditions: Array<EnablingCondition> = [],
): Select => {
  const allEventNames = [
    // Snapchat events
    // See: https://developers.snap.com/api/marketing-api/Conversions-API/Parameters#server-parameters
    { value: 'ACHIEVEMENT_UNLOCKED', displayValue: 'Snapchat Achievement Unlocked' },
    { value: 'ADD_BILLING', displayValue: 'Snapchat Add Billing' },
    { value: 'ADD_CART', displayValue: 'Snapchat Add Cart' },
    { value: 'ADD_TO_WISHLIST', displayValue: 'Snapchat Add To Wishlist' },
    { value: 'AD_CLICK', displayValue: 'Snapchat Ad Click' },
    { value: 'AD_VIEW', displayValue: 'Snapchat Ad View' },
    { value: 'APP_INSTALL', displayValue: 'Snapchat App Install' },
    { value: 'APP_OPEN', displayValue: 'Snapchat App Open' },
    { value: 'COMPLETE_TUTORIAL', displayValue: 'Snapchat Complete Tutorial' },
    { value: 'CUSTOM_EVENT_1', displayValue: 'Snapchat Custom Event 1' },
    { value: 'CUSTOM_EVENT_2', displayValue: 'Snapchat Custom Event 2' },
    { value: 'CUSTOM_EVENT_3', displayValue: 'Snapchat Custom Event 3' },
    { value: 'CUSTOM_EVENT_4', displayValue: 'Snapchat Custom Event 4' },
    { value: 'CUSTOM_EVENT_5', displayValue: 'Snapchat Custom Event 5' },
    { value: 'INVITE', displayValue: 'Snapchat Invite' },
    { value: 'LEVEL_COMPLETE', displayValue: 'Snapchat Level Complete' },
    { value: 'LIST_VIEW', displayValue: 'Snapchat List View' },
    { value: 'LOGIN', displayValue: 'Snapchat Login' },
    { value: 'PAGE_VIEW', displayValue: 'Snapchat Page View' },
    { value: 'PURCHASE', displayValue: 'Snapchat Purchase' },
    { value: 'RATE', displayValue: 'Snapchat Rate' },
    { value: 'RESERVE', displayValue: 'Snapchat Reserve' },
    { value: 'SAVE', displayValue: 'Snapchat Save' },
    { value: 'SEARCH', displayValue: 'Snapchat Search' },
    { value: 'SHARE', displayValue: 'Snapchat Share' },
    { value: 'SIGN_UP', displayValue: 'Snapchat Sign Up' },
    { value: 'SPENT_CREDITS', displayValue: 'Snapchat Spent Credits' },
    { value: 'START_CHECKOUT', displayValue: 'Snapchat Start Checkout' },
    { value: 'START_TRIAL', displayValue: 'Snapchat Start Trial' },
    { value: 'SUBSCRIBE', displayValue: 'Snapchat Subscribe' },
    { value: 'VIEW_CONTENT', displayValue: 'Snapchat View Content' },

    // Spotify events
    // See: https://adshelp.spotify.com/s/article/Spotify-Conversions-API-US
    // Note: the doc above is not clear on names, but each event below has been manually verified by calling the Spotify CAPI with that event_name.
    { value: 'ALIAS', displayValue: 'Spotify CAPI Alias' },
    { value: 'ADD_TO_CART', displayValue: 'Spotify CAPI Add to Cart' },
    { value: 'CUSTOM_EVENT_1', displayValue: 'Spotify CAPI Custom Event 1' },
    { value: 'CUSTOM_EVENT_2', displayValue: 'Spotify CAPI Custom Event 2' },
    { value: 'CUSTOM_EVENT_3', displayValue: 'Spotify CAPI Custom Event 3' },
    { value: 'CUSTOM_EVENT_4', displayValue: 'Spotify CAPI Custom Event 4' },
    { value: 'CUSTOM_EVENT_5', displayValue: 'Spotify CAPI Custom Event 5' },
    { value: 'LEAD', displayValue: 'Spotify CAPI Lead' },
    { value: 'VIEW', displayValue: 'Spotify CAPI Page View' },
    { value: 'PURCHASE', displayValue: 'Spotify CAPI Purchase' },
    { value: 'SIGN_UP', displayValue: 'Spotify CAPI Sign Up' },
    { value: 'CHECK_OUT', displayValue: 'Spotify CAPI Start Checkout' },
    { value: 'PRODUCT', displayValue: 'Spotify CAPI View Product' },
  ];
  return select({
    name: 'commonSelectableEventName',
    displayName: 'Freshpaint Selectable Event Name',
    help: 'Scroll for destination specific event names below.',
    simpleValueType: true,
    selectItems: allEventNames,
    defaultValue: 'PURCHASE',
    enablingConditions,
  });
};
export const commonEventProperties = (enablingConditions: Array<EnablingCondition> = []) => {
  return simpleTable({
    name: 'commonEventProperties',
    displayName: 'Event Properties',
    enablingConditions,
  });
};
export const commonUserProperties = (enablingConditions: Array<EnablingCondition> = []) => {
  return simpleTable({
    name: 'commonUserProperties',
    displayName: 'User Properties',
    enablingConditions,
  });
};

export const commonEventPropertiesJSONValue = (
  enablingConditions: Array<EnablingCondition> = [],
) => {
  return simpleTable({
    name: 'commonEventPropertiesJSONValue',
    displayName: 'Event Properties',
    help: 'Props named value, quantity, item_count, price, total, revenue, or num_items will be converted to numeric if possible; those named contents, products, or items will be converted to a JSON object / array if possible (keys must be quoted).',
    enablingConditions,
  });
};

// displayName and help cannot be passed in. They are overridden by the last-called instance of the function. :/
export const commonInstanceId = (enablingConditions: Array<EnablingCondition> = []) => {
  return text({
    name: 'commonInstanceId',
    displayName: 'Instance ID',
    help: 'If multiple instances are configured for this destination type, specify one to deliver to (if left blank, this event will be delivered to all configured instances)',
    simpleValueType: true,
    enablingConditions,
  });
};

export const commonGoogleAdsConversionLabel = (
  enablingConditions: Array<EnablingCondition> = [],
) => {
  return text({
    name: 'googleAdsConversionLabel',
    displayName: 'Conversion Label',
    simpleValueType: true,
    valueValidators: [nonEmpty()],
    enablingConditions,
  });
};

export const commonOptinOptOut = (enablingConditions: Array<EnablingCondition> = []) => {
  return radio({
    name: 'commonOptinOptOut',
    displayName: 'Opt-in / Opt-out',
    radioItems: [
      {
        value: 'OPTIN',
        displayValue: 'Opt-in',
        help: 'Deliver only to destination types / instances specified',
      },
      {
        value: 'OPTOUT',
        displayValue: 'Opt-out',
        help: 'Deliver to all but the destination types / instances specified',
      },
    ],
    simpleValueType: true,
    enablingConditions,
  });
};

export const commonOptinOptOutInstances = (enablingConditions: Array<EnablingCondition> = []) => {
  const destinationTypeKeySelect = select({
    name: 'param_table_key_column',
    displayName: 'Destination Type',
    macrosInSelect: false,
    selectItems: trackDestinationSelectItems,
    simpleValueType: true,
  });

  const destinationInstanceIdText = text({
    name: 'param_table_value_column',
    displayName: 'Instance ID (optional)',
    help: 'If multiple instances are configured for this destination type, specify one to deliver to (if left blank, this event will be delivered to all configured instances)',
    simpleValueType: true,
  });

  return paramTable({
    name: 'commonOptinOptOutInstances',
    displayName: 'Specific Destination Types / Instance IDs',
    help: "An Instance ID is required only when there are multiple instances configured for a destination type which supports multiple instance IDs, and you don't want to deliver to all.",
    paramTableColumns: [
      {
        param: destinationTypeKeySelect,
        isUnique: false,
      },
      {
        param: destinationInstanceIdText,
        isUnique: false,
      },
    ],
    enablingConditions,
  });
};
