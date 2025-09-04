// TODOS:
// 1. Bing:
//    a. Implement - Page view (SPA)
//    b. Add support for custom event props (Define your own event parameters)

const callInWindow = require("callInWindow");
const injectScript = require("injectScript");
const log = require("logToConsole");
const makeTableMap = require("makeTableMap");
const makeNumber = require("makeNumber");
const getType = require("getType");
const JSON = require('JSON');

function parseSimpleTable(inputProps) {
  const props = {};
  for (let prop of inputProps) {
    props[prop.name] = prop.value;
  }
  return props;
}

function parseSimpleTableAndParseNumericAndJSONValues(inputProps, destType) {
  const props = {};
  for (let prop of inputProps) {
    let val = prop.value;
    if (val) {
      if (prop.name === "value" || prop.name === "quantity" || prop.name === "item_count" || prop.name === "price" || prop.name === "total" || prop.name === "revenue" || prop.name === "num_items") {
        // prop name is one of the designated numeric prop names, attempt to cast to number, with warning on cast error
        val = makeNumber(val);
        if (val !== val) { // Check for NaN
          val = prop.value;
          log("WARNING: Freshpaint " + destType + " GTM Template could not parse prop '" + prop.name + "' as numeric, leaving as string: " + val);
        }
      } else if (prop.name === "contents" || prop.name === "products" || prop.name === "items") {
        // prop name is one of the designated json object or array names, attempt to parse to JSON, with warning parse error
        val = JSON.parse(val);
        if (!val) {
          val = prop.value;
          log("WARNING: Freshpaint " + destType + " GTM Template could not parse prop '" + prop.name + "' as JSON, leaving as string: " + val);
        }
      }
    }

    props[prop.name] = val;
  }
  return props;
}

function parseParamTable(inputProps, overrides) {
  const keyName = (overrides && overrides.keyColumnName) || "param_table_key_column";
  const valueName = (overrides && overrides.valueColumnName) || "param_table_value_column";

  const props = {};
  for (let prop of inputProps) {
    props[prop[keyName]] = prop[valueName];
  }
  return props;
}

function parseParamTableToArray(inputProps, overrides) {
  const keyName = (overrides && overrides.keyColumnName) || "param_table_key_column";
  const valueName = (overrides && overrides.valueColumnName) || "param_table_value_column";

  const props = [];
  for (let prop of inputProps) {
    props.push(prop);
  }
  return props;
}

function getEventPropsFromGoogEventSettingsVar(inputProps) {
  if (getType(inputProps) !== "object") {
    return {};
  }

  let eventProps = {};

  for (let key in inputProps) {
    if (key === "user_properties") {
      continue;
    }

    eventProps[key] = inputProps[key];
  }

  return eventProps;
}

function getUserPropsFromGoogEventSettingsVar(inputProps) {
  if (getType(inputProps) !== "object") {
    return {};
  }

  let userProps = {};

  for (let key in inputProps) {
    if (key === "user_properties") {
      for (let userKey in inputProps[key]) {
        userProps[userKey] = inputProps[key][userKey];
      }
    }
  }

  return userProps;
}

function objectIsEmpty(inputProps) {
  if (getType(inputProps) !== "object") {
    return true;
  }

  for (let key in inputProps) {
    return false;
  }

  return true;
}

const processEvent = () => {
  let envID = undefined;

  // initialize environment
  // if already done before then this is a no-op
  callFreshpaintProxy("init", {
    envID: envID,
    initPersistantProps: {
      "$gtm": true,
    },
    initConfig: {
    },
  });

  switch (data.tagType) {
    case "init":
      processInit();
      break;
    case "track":
      processTrack();
      break;
    case "identify":
      processIdentify();
      break;
    case "addEventProperties":
      processAddEventProperties();
      break;
    case "ga4Event":
      processGA4Event();
      break;
    case "fbPixelEvent":
      processFBPixelEvent();
      break;
    case "tikTokAdsEvent":
      processTikTokAdsEvent();
      break;
    case "linkedInAdsEvent":
      processLinkedInAdsEvent();
      break;
    case "linkedInAdsCAPIEvent":
      processLinkedInAdsCAPIEvent();
      break;
    case "mntnEvent":
      processMntnEvent();
      break;
    case "twitterAdsEvent":
      processTwitterEvent();
      break;
    case "bingAdsEvent":
      processBingEvent();
      break;
    case "impactEvent":
      processImpactEvent();
      break;
    case "googleAdsEvent":
      processGoogleAdsEvent();
      break;
    case "googleAdsCallConversionsEvent":
      processGoogleAdsCallConversionsEvent();
      break;
    case "theTradeDeskEvent":
      processTheTradeDeskEvent();
      break;
    case "stackAdaptEvent":
      processStackAdaptEvent();
      break;
    case "pinterestAdsEvent":
      processPinterestAdsEvent();
      break;
    case "redditAdsEvent":
      processRedditAdsEvent();
      break;
    case "floodlightEvent":
      processFloodlightEvent();
      break;
    case "basisEvent":
      processBasisEvent();
      break;
    case "googleCM360Event":
      processGoogleCM360Event();
      break;
    case "viantEvent":
      processViantEvent();
      break;
    default:
      log("ERROR: Freshpaint GTM Template unsupported tagType '" + data.tagType + "'");
      data.gtmOnFailure();
      break;
  }
};

const generateOptions = (integration) => {
  const integrations = {
    All: false,
  };
  integrations[integration] = true;

  return {
    integrations: integrations,
  };
};

const generateOptionsFromInstances = (integration, instanceNames, supportMulti) => {
  const integrations = {
    All: false,
  };

  let instanceNamesToUse;
  if (instanceNames) {
    instanceNamesToUse = instanceNames.trim();
  }

  if (instanceNamesToUse) {
    instanceNamesToUse = instanceNamesToUse.split(',');
    if (instanceNamesToUse.length > 1 && !supportMulti) {
      // Indicate to caller this isn't supported
      return undefined;
    }
    for (let i = 0; i < instanceNamesToUse.length; i++) {
      const instanceDelimiter = '::';
      integrations[integration + instanceDelimiter + instanceNamesToUse[i].toString().trim()] = true;
    }

    return {
      integrations: integrations,
    };
  } else {
    return generateOptions(integration);
  }
};

const generateOptionsFromParamTable = (optInOptOut, paramTable) => {
  const props = parseParamTableToArray(paramTable || []);
  if (props === undefined) {
        return props;
  }

  if (props.length === 0) {
    return {};
  }

  const optIn = (optInOptOut === "OPTIN");
  const integrations = {
    All: !optIn,
  };

  for (const prop of props) {
    let specifier = prop["param_table_key_column"];
    if (prop["param_table_value_column"] != "") {
      const instanceDelimiter = '::';
      specifier = specifier + instanceDelimiter + prop["param_table_value_column"] ;
    }

    integrations[specifier] = optIn;
  }

  return {
    integrations: integrations,
  };
};

const processInit = () => {
  // Init handled upstream
  data.gtmOnSuccess();
};

const processTrack = () => {
  if (data.commonEventName) {
    const props = parseSimpleTableAndParseNumericAndJSONValues(data.commonEventPropertiesJSONValue || [], "track");

    const options = generateOptionsFromParamTable(data.commonOptinOptOut, data.commonOptinOptOutInstances);

    track(data.commonEventName, props, options);

      data.gtmOnSuccess();
  } else {
      log("ERROR: Freshpaint Track GTM Template missing eventName");
      data.gtmOnFailure();
  }
};

const processIdentify = () => {
    const options = generateOptionsFromParamTable(data.commonOptinOptOut, data.identifyOptinOptOutInstances);
    if (options === undefined) {
        // log msg occurred in generateOptionsFromParamTable above
        data.gtmOnFailure();
        return;
    }

    let identifier = undefined;
    if (data.identifyIdentifier) {
      identifier = data.identifyIdentifier;
    }

    const props = parseSimpleTable(data.commonUserProperties || []);
    identify(identifier, props, options);

    data.gtmOnSuccess();
};

const processAddEventProperties = () => {
    const props = parseSimpleTable(data.addEventPropertiesSharedProperties || []);

    addEventProperties(props);

    data.gtmOnSuccess();
};

const processGA4Event = () => {
  const ga4ProxySDKKey = "Google Analytics 4 Proxy";
  let options = generateOptions(ga4ProxySDKKey);

  let instanceNamesToUse;
  if (data.ga4InstanceNames) {
    instanceNamesToUse = data.ga4InstanceNames.trim();
  }
  if (instanceNamesToUse) {
    options = generateOptionsFromInstances(ga4ProxySDKKey, instanceNamesToUse, true);
  }

  const userPropsFromVar = getUserPropsFromGoogEventSettingsVar(data.ga4EventPropsVariable);
  const userProps = parseSimpleTable(data.commonUserProperties || []);
  const allUserProps = mergeObj(userPropsFromVar, userProps);
  if (!objectIsEmpty(allUserProps)) {
    identify(undefined, allUserProps, options);
  }

  const eventPropsFromVar = getEventPropsFromGoogEventSettingsVar(data.ga4EventPropsVariable);

  if (data.commonEventName) {
    const props = parseSimpleTable(data.commonEventProperties || []);

    track(data.commonEventName, mergeObj(eventPropsFromVar, props), options);

    data.gtmOnSuccess();
  } else {
    log("ERROR: Freshpaint Google Analytics 4 Proxy GTM Template missing eventName");
    data.gtmOnFailure();
  }
};

const mergeObj = (obj, obj2) => {
  for (let key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      obj[key] = obj2[key];
    }
  }
  return obj;
};

const processFBPixelEvent = () => {
  const facebookCAPISDKKey = "Facebook Conversions API";
  let options = generateOptions(facebookCAPISDKKey);

  const eventName =
    data.fbEventName === "custom" ?
      data.fbCustomEventName : (
        data.fbEventName === "variable" ?
          data.fbVariableEventName : data.fbStandardEventName
      );
  const objectProps =
    data.fbObjectPropertyList && data.fbObjectPropertyList.length ?
      makeTableMap(data.fbObjectPropertyList, "name", "value") : {};
  const objectPropsFromVar =
    getType(data.fbObjectPropertiesFromVariable) === "object" ?
      data.fbObjectPropertiesFromVariable : {};
  const mergedObjectProps = mergeObj(objectPropsFromVar, objectProps);

  // Convert value, num_items to numeric; contents / products to JSON if present
  for (let propKey in mergedObjectProps) {
    let propValue = mergedObjectProps[propKey];
    if (propValue) {
      if (propKey === "value" || propKey === "num_items") {
        let val = makeNumber(propValue);
        if (val !== val) { // Check for NaN
          val = propValue;
          log("WARNING: Freshpaint Facebook Conversions API GTM Template could not parse prop '" + propKey + "' as numeric, leaving as string: " + propValue);
        }
        mergedObjectProps[propKey] = val;
      } else if (propKey === "contents" || propKey === "products" || propKey == "content_ids") {
        let val = JSON.parse(propValue);
        if (!val) {
          log("WARNING: Freshpaint Facebook Conversions API GTM Template could not parse '" + propKey + "' json, leaving as string: " + propValue);
          val = propValue;
        }
        mergedObjectProps[propKey] = val;
      }
    }
  }

  // Process instanceNames
  let instanceNamesToUse;
  if (data.fbInstanceNames) {
    instanceNamesToUse = data.fbInstanceNames.trim();
  }
  if (instanceNamesToUse) {
    options = generateOptionsFromInstances(facebookCAPISDKKey, instanceNamesToUse, true);
  } else if (data.commonDestConfigNames) {
    // Support legacy commonDestConfigNames when fbInstanceNames not specified
    mergedObjectProps.dest_config_names = data.commonDestConfigNames;
  }

  track(eventName, mergedObjectProps, options);

  data.gtmOnSuccess();
};

const processTikTokAdsEvent = () => {
  const tikTokSDKKey = "TikTok Ads";
  let options = generateOptions(tikTokSDKKey);

  const eventName = data.tikTokAdsEventName;

  const objectProps =
    data.commonEventProperties && data.commonEventProperties.length ?
      makeTableMap(data.commonEventProperties, "name", "value") : {};

  // Convert value to numeric; contents / products to JSON if present
  for (let propKey in objectProps) {
    let propValue = objectProps[propKey];
    if (propValue) {
      if (propKey === "value") {
        let val = makeNumber(propValue);
        if (val !== val) { // Check for NaN
          val = propValue;
          log("WARNING: Freshpaint TikTok Ads GTM Template could not parse prop '" + propKey + "' as numeric, leaving as string: " + propValue);
        }
        objectProps[propKey] = val;
      } else if (propKey === "contents" || propKey === "products") {
        let val = JSON.parse(propValue);
        if (!val) {
          log("WARNING: Freshpaint TikTok Ads GTM Template could not parse '" + propKey + "' json, leaving as string: " + propValue);
          val = propValue;
        }
        objectProps[propKey] = val;
      }
    }
  }

  track(eventName, objectProps, options);

  data.gtmOnSuccess();
};

const processTwitterEvent = () => {
  const options = generateOptions("Twitter Ads");

  const eventName = data.twitterEventId;
  const props = parseParamTable(data.twitterEventParameters || []);

  track(eventName, props, options);

  data.gtmOnSuccess();
};

const processBingEvent = () => {
  const bingAdsSDKKey = "Bing Ads";

  let options = generateOptions(bingAdsSDKKey);
  if (data.bingAdsInstanceName) {
    const instanceNameToUse = data.bingAdsInstanceName.trim();
    options = generateOptionsFromInstances(bingAdsSDKKey, instanceNameToUse, false);
    if (options === undefined) {
      log("ERROR: Multiple Bing Ads Tag IDs not supported: " + instanceNameToUse);
      data.gtmOnFailure();
      return;
    }
  }

  // Check for deprecated page-load tag, nop if so
  if (data.bingEventType === "PAGE_LOAD") {
    data.gtmOnSuccess();
    return;
  }

  // Check for custom page-load tag
  if (data.bingEventType === "CUSTOM_PAGE_LOAD") {
    track("page_view", {}, options);

    data.gtmOnSuccess();
    return;
  }

  // Proceed with non-page-load tag
  let eventName;
  const props = { tpp: "1" };
  const includePropsFromData = (mapping) => {
    for (let propKey in mapping) {
      const dataKey = mapping[propKey];
      if (data[dataKey]) {
        props[propKey] = data[dataKey];
      }
    }
  };

  if (data.bingEventType === "VARIABLE_REVENUE") {
    eventName = "revenue_generated";
    props.action = "";
    props.label = "";
    includePropsFromData({
      currency: "bingCurrency",
      revenue: "bingRevenue",
    });
  } else if (data.bingEventType === "CUSTOM") {
    eventName = data.bingCustomEventAction || "";
    props.action = eventName;
    props.currency = data.bingCurrency || "USD";
    includePropsFromData({
      label: "bingEventLabel",
      category: "bingEventCategory",
      event_value: "bingEventValue",
      revenue: "bingRevenue",
    });
  } else if (data.bingEventType === "ecommerce" || data.bingEventType === "hotel" || data.bingEventType === "travel") {
    let action = data.bingEventAction;
    if (action === "") {
      action = data.bingCustomEventAction;
    }
    eventName = action;
    props.action = action;
    props.label = "";

    if (data.bingEventType === "ecommerce") {
      includePropsFromData({
        product_id: "bingEcommProdId",
        pagetype: "bingEcommPagetype",
        ecomm_totalvalue: "bingEcommTotalValue",
        ecomm_category: "bingEcommCategory",
      });
    } else if (data.bingEventType === "hotel") {
      props.currency = data.bingCurrency || "USD";
      includePropsFromData({
        hct_base_price: "bingHctBasePrice",
        hct_booking_xref: "bingHctBookingXref",
        hct_checkin_date: "bingHctCheckinDate",
        hct_checkout_date: "bingHctCheckoutDate",
        hct_length_of_stay: "bingHctLengthOfStay",
        hct_partner_hotel_id: "bingHctPartnerHotelId",
        hct_total_price: "bingHctTotalPrice",
        hct_pagetype: "bingHctPagetype",
      });
    } else if (data.bingEventType === "travel") {
      includePropsFromData({
        travel_destid: "bingTravelDestid",
        travel_originid: "bingTravelOriginid",
        travel_pagetype: "bingTravelPagetype",
        travel_startdate: "bingTravelStartdate",
        travel_enddate: "bingTravelEnddate",
        travel_totalvalue: "bingTravelTotalvalue",
      });
    }
  } else if (data.bingEventType === "userDefined") {
    eventName = data.bingCustomEventAction || "";
    props.action = eventName;
    props.label = "";
  }

  track(eventName, props, options);

  data.gtmOnSuccess();
};

const impactNumericKeys = {
  "amount": true,
  "discount": true,
  "latitude": true,
  "longitude": true,
  "order_revenue": true,
  "order_shipping": true,
  "order_tax": true,
};

const processImpactEvent = () => {
  const options = generateOptions("impactdotcom");

  // make track call
  const props = parseParamTable(data.impactOtherEventParameters || []);

  if (data.impactEventTypeIdOrCodeSelector === "event_type_code") {
    props.event_type_code = data.impactEventTypeIdOrCode;
  } else {
    props.event_type_id = data.impactEventTypeIdOrCode;
  }

  // Convert any potentially numeric values to numbers
  for (let key in props) {
    if (!impactNumericKeys[key]) {
      continue;
    }

    props[key] = makeNumber(props[key]);
    if (props[key] !== props[key]) { // Check for NaN
      log("WARNING: Freshpaint impact.com GTM Template could not parse prop '" + key + "' as numeric, leaving as string: " + props[key]);
    }
  }

  props.order_id = data.impactOrderId;

  // Convert items, if any, to json object
  let itemsVal = props.items;
  if (itemsVal) {
    itemsVal = JSON.parse(itemsVal);
    if (!itemsVal) {
      log("WARNING: Freshpaint impact.com GTM Template parsing items json, leaving as string: " + props.items);
      itemsVal = props.items;
    }

    props.items = itemsVal;
  }

  track(data.impactEventTypeIdOrCode, props, options);

  data.gtmOnSuccess();
};

const constructECUserDataProps = (ecUserData) => {
  const props = {};
  if (ecUserData && typeof ecUserData === "object") {
    if (ecUserData.email) {
      props.email = ecUserData.email;
    }
    if (ecUserData.phone_number) {
      props.phone_number = ecUserData.phone_number;
    }
    if (ecUserData.address && typeof ecUserData.address === "object" && ecUserData.address[0] && typeof ecUserData.address[0] === "object") {
      props.address = ecUserData.address[0];
    }
  }
  return props;
};

const processGoogleAdsEvent = () => {
  const googleAdsSDKKey = "Google AdWords New";
  let options = generateOptions(googleAdsSDKKey);

  // make track call

  if (data.commonEventName && data.googleAdsConversionLabel) {
    let props = {};

    props.conversion_label = data.googleAdsConversionLabel;

    let instanceNameToUse;
    if (data.googleAdsInstanceName) {
      instanceNameToUse = data.googleAdsInstanceName.trim();
    }
    if (instanceNameToUse) {
      options = generateOptionsFromInstances(googleAdsSDKKey, instanceNameToUse, false);
      if (options === undefined) {
        log("ERROR: Multiple Google Ads Conversion IDs not supported: " + instanceNameToUse);
        data.gtmOnFailure();
        return;
      }
    } else if (data.googleAdsConversionId) {
        // Support legacy googleAdsConversionId when googleAdsInstanceName not specified
        props.conversion_id = data.googleAdsConversionId;
    }

    if (data.googleAdsConversionValue) {
        props.value = data.googleAdsConversionValue;
    }
    if (data.googleAdsOrderId) {
        props.transaction_id = data.googleAdsOrderId;
    }
    if (data.googleAdsCurrencyCode) {
        props.currency = data.googleAdsCurrencyCode;
    }
    if (data.googleAdsEnhancedConversionsCheckbox) {
      options.enhanced_conversions_enabled = true;

      const ecUserData = data.googleAdsEnhancedConversionsUserDataVariable;
      const ecProps = constructECUserDataProps(ecUserData);
      props = mergeObj(props, ecProps);
    }

    track(data.commonEventName, props, options);

    data.gtmOnSuccess();
  } else {
    log("ERROR: Freshpaint Google Ads GTM Template missing eventNme and / or conversionLabel");
    data.gtmOnFailure();
  }
};

const processGoogleAdsCallConversionsEvent = () => {
  let tagIdConversionLabel = "AW-" + data.googleAdsCallConversionsConversionId + "/" + data.googleAdsConversionLabel;

  registerCallConversion(tagIdConversionLabel, data.googleAdsCallConversionsDisplayedPhoneNbr);

  data.gtmOnSuccess();
};

const processLinkedInAdsEvent = () => {
  const options = generateOptions("linkedin-ads");

  const conversionIdsToUse = data.linkedInAdsConversionIds.trim();
  const conversionIds = conversionIdsToUse.split(',');

  if (conversionIds.length === 0) {
    log("ERROR: Freshpaint LinkedIn Ads GTM Template missing Conversion ID(s): " + data.commonEventName);
    data.gtmOnFailure();
    return;
  } else if (conversionIds.length > 3) {
    log("ERROR: Freshpaint LinkedIn Ads GTM Template supports only up to 3 Conversion IDs: " + data.commonEventName);
    data.gtmOnFailure();
    return;
  }

  // make track call(s) for each conversionId
  conversionIds.forEach(id => {
    const props = {};
    props.conversion_id = id.trim();

    track(data.commonEventName, props, options);
  });

  data.gtmOnSuccess();
};

const processLinkedInAdsCAPIEvent = () => {
  const linkedInCAPISDKKey = "LinkedIn Ads Conversions API";
  const options = generateOptions(linkedInCAPISDKKey);

  const conversionIdsToUse = data.linkedInAdsCAPIConversionIds.trim();
  const conversionIds = conversionIdsToUse.split(',');

  if (conversionIds.length === 0) {
    log("ERROR: Freshpaint LinkedIn Ads Conversions API GTM Template missing Conversion ID(s): " + data.commonEventName);
    data.gtmOnFailure();
    return;
  } else if (conversionIds.length > 3) {
    log("ERROR: Freshpaint LinkedIn Ads Conversions API GTM Template supports only up to 3 Conversion IDs: " + data.commonEventName);
    data.gtmOnFailure();
    return;
  }

  // make track call(s) for each conversionId
  conversionIds.forEach(id => {
    const props = parseSimpleTable(data.commonEventProperties || []);
    props.conversion_id = id.trim();

    track(data.commonEventName, props, options);
  });

  data.gtmOnSuccess();
};

const processMntnEvent = () => {
  const mntnSDKKey = "MNTN";

  let options = generateOptions(mntnSDKKey);
  if (data.mntnInstanceName) {
    const instanceNameToUse = data.mntnInstanceName.trim();
    options = generateOptionsFromInstances(mntnSDKKey, instanceNameToUse, false);
    if (options === undefined) {
      log("ERROR: Multiple MNTN Advertiser IDs not supported: " + instanceNameToUse);
      data.gtmOnFailure();
      return;
    }
  }

  const props = parseSimpleTable(data.commonEventProperties || []);
  track(data.commonEventName, props, options);

  data.gtmOnSuccess();
};

const processTheTradeDeskEvent = () => {
  const theTradeDeskSDKKey = "theTradeDesk";
  let options = generateOptions(theTradeDeskSDKKey);

  // make track call

  if (data.commonEventName && data.theTradeDeskTrackerOrUPixelIDValue) {
    const props = [];

    let instanceNameToUse;
    if (data.theTradeDeskInstanceName) {
      instanceNameToUse = data.theTradeDeskInstanceName.trim();
    }
    if (instanceNameToUse) {
      options = generateOptionsFromInstances(theTradeDeskSDKKey, instanceNameToUse, false);
      if (options === undefined) {
        log("ERROR: Multiple theTradeDesk Advertiser IDs not supported: " + instanceNameToUse);
        data.gtmOnFailure();
        return;
      }
    } else if (data.commonDestConfigNames) {
        // Support legacy commonDestConfigNames when theTradeDeskInstanceName not specified
        props.dest_config_names = data.commonDestConfigNames;
    }

    if (data.theTradeDeskValue) {
       let val = data.theTradeDeskValue;
       val = makeNumber(val);
       if (val !== val) { // Check for NaN
         val = data.theTradeDeskValue;
         log("WARNING: Freshpaint theTradeDesk GTM Template could not parse prop value as numeric, leaving as string: " + val);
       }
       props.value = val;
    }

    props.tracker_id = data.theTradeDeskTrackerOrUPixelIDValue;

    // Convert object values to object if specified

    if (data.theTradeDeskPrivacySettings) {
        let val = JSON.parse(data.theTradeDeskPrivacySettings);
        if (!val) {
          val = data.theTradeDeskPrivacySettings;
          log("WARNING: Freshpaint " + theTradeDeskSDKKey + " GTM Template could not parse prop '" + data.theTradeDeskPrivacySettings + "' as JSON, leaving as string: " + val);
        }

        props.privacy_settings = val;
    }

    if (data.theTradeDeskDataProcessingOption) {
        let val = JSON.parse(data.theTradeDeskDataProcessingOption);
        if (!val) {
          val = data.theTradeDeskDataProcessingOption;
          log("WARNING: Freshpaint " + theTradeDeskSDKKey + " GTM Template could not parse prop '" + data.theTradeDeskDataProcessingOption + "' as JSON, leaving as string: " + val);
        }

        props.data_processing_option = val;
    }

    track(data.commonEventName, props, options);

    data.gtmOnSuccess();
  } else {
    log("ERROR: Freshpaint theTradeDesk GTM Template missing eventName and / or trackerOrUPixelIDValue");
    data.gtmOnFailure();
  }
};

const processStackAdaptEvent = () => {
  const options = generateOptions("StackAdapt");

  if (data.commonEventName && data.stackAdaptConversionEventID) {
    const props = parseSimpleTable(data.commonEventProperties || []);

    props.conversion_id = data.stackAdaptConversionEventID;

    track(data.commonEventName, props, options);

    data.gtmOnSuccess();
  } else {
    log("ERROR: Freshpaint StackAdapt GTM Template missing eventName and / or stackAdaptConversionEventID");
    data.gtmOnFailure();
  }
};

const processPinterestAdsEvent = () => {
  const pinterestSDKKey = "pinterest-ads";
  let options = generateOptions(pinterestSDKKey);

  if (!data.commonEventName) {
    log("ERROR: Freshpaint Pinterest Ads GTM Template missing eventName");
    data.gtmOnFailure();
    return;
  }

  if (data.pinterestAdsInstanceName) {
    const instanceNameToUse = data.pinterestAdsInstanceName.trim();
    options = generateOptionsFromInstances(pinterestSDKKey, instanceNameToUse, false);
    if (options === undefined) {
      log("ERROR: Multiple Pinterest Ads Tag IDs not supported: " + instanceNameToUse);
      data.gtmOnFailure();
      return;
    }
  }

  const props = parseSimpleTable(data.commonEventProperties || []);

  track(data.commonEventName, props, options);

  data.gtmOnSuccess();
};

const processRedditAdsEvent = () => {
  const redditSDKKey = "reddit-ads";
  let options = generateOptions(redditSDKKey);

  if (data.commonEventName) {
    // TODO: Add bool parse support to either backend for string or here to cast to bool, for: test_mode, opt_out props if present
    const props = parseSimpleTableAndParseNumericAndJSONValues(data.commonEventPropertiesJSONValue || []);

    let instanceNameToUse;
    if (data.redditAdsInstanceName) {
      instanceNameToUse = data.redditAdsInstanceName.trim();
    }
    if (instanceNameToUse) {
      options = generateOptionsFromInstances(redditSDKKey, instanceNameToUse, false);
      if (options === undefined) {
        log("ERROR: Multiple Reddit Account IDs not supported: " + instanceNameToUse);
        data.gtmOnFailure();
        return;
      }
    }

    track(data.commonEventName, props, options);

    data.gtmOnSuccess();
  } else {
    log("ERROR: Freshpaint Reddit Ads GTM Template missing eventName");
    data.gtmOnFailure();
  }
};

const processFloodlightEvent = () => {
  if (!data.commonEventName) {
    log("ERROR: Freshpaint Floodlight GTM Template missing Freshpaint Event Name");
    data.gtmOnFailure();
    return;
  }
  if (!data.floodlightGroupTagString) {
    log("ERROR: Freshpaint Floodlight GTM Template missing Group Tag String");
    data.gtmOnFailure();
    return;
  }
  if (!data.floodlightActivityTagString) {
    log("ERROR: Freshpaint Floodlight GTM Template missing Activity Tag String");
    data.gtmOnFailure();
    return;
  }
  if (!data.floodlightCountingMethod) {
    log("ERROR: Freshpaint Floodlight GTM Template missing Counting Method");
    data.gtmOnFailure();
    return;
  }

  const floodlightSDKKey = "Floodlight";
  let options = generateOptions(floodlightSDKKey);

  let instanceNameToUse;
  if (data.floodlightInstanceName) {
    instanceNameToUse = data.floodlightInstanceName.trim();
  }
  if (instanceNameToUse) {
    options = generateOptionsFromInstances(floodlightSDKKey, instanceNameToUse, false);
    if (options === undefined) {
      log("ERROR: Multiple Floodlight Advertiser IDs not supported: " + instanceNameToUse);
      data.gtmOnFailure();
      return;
    }
  }

  let props = parseParamTable(data.floodlightCustomVariables || [], {keyColumnName: "key", valueColumnName: "value"});

  props.group_tag_string = data.floodlightGroupTagString;
  props.activity_tag_string = data.floodlightActivityTagString;
  props.counting_method = data.floodlightCountingMethod.toLowerCase();

  if (data.floodlightEnhancedConversionsCheckbox) {
    options.enhanced_conversions_enabled = true;

    const ecUserData = data.floodlightEnhancedConversionsUserDataVariable;
    const userDataProps = constructECUserDataProps(ecUserData);
    props = mergeObj(props, userDataProps);
  }

  track(data.commonEventName, props, options);
  data.gtmOnSuccess();
};

const processBasisEvent = () => {
  const basisSDKKey = "Basis";

  if (!data.commonEventName) {
    log("ERROR: Freshpaint Basis GTM Template missing Freshpaint Event Name");
    data.gtmOnFailure();
    return;
  }

  let options = generateOptions(basisSDKKey);
  if (data.basisInstanceName) {
    const instanceNameToUse = data.basisInstanceName.trim();
    options = generateOptionsFromInstances(basisSDKKey, instanceNameToUse, false);
    if (options === undefined) {
      log("ERROR: Multiple Basis Advertiser IDs not supported: " + instanceNameToUse);
      data.gtmOnFailure();
      return;
    }
  }

  const props = parseSimpleTable(data.commonEventProperties || []);

  track(data.commonEventName, props, options);
  data.gtmOnSuccess();
};

const processGoogleCM360Event = () => {
  const googleCM360SDKKey = "Google Campaign Manager 360 Conversions API";

  if (!data.commonEventName) {
    log("ERROR: Freshpaint CM360 GTM Template missing Freshpaint Event Name");
    data.gtmOnFailure();
    return;
  }
  if (!data.googleCM360ActivityIDString) {
    log("ERROR: CM360 requires a Floodlight activity ID");
    data.gtmOnFailure();
    return;
  }
  if (!data.googleCM360FloodlightCountingMethod) {
    data.googleCM360FloodlightCountingMethod = "standard";
  }

  let options = generateOptions(googleCM360SDKKey);
  if (data.googleCM360InstanceName) {
    const instanceNameToUse = data.googleCM360InstanceName.trim();
    options = generateOptionsFromInstances(googleCM360SDKKey, instanceNameToUse, false);
    if (options === undefined) {
      log("ERROR: Multiple CM360 Advertiser IDs not supported: " + instanceNameToUse);
      data.gtmOnFailure();
      return;
    }
  }

  const props = parseSimpleTable(data.googleCM360EventProperties || []);
  props.activity_id = data.googleCM360ActivityIDString;
  props.counting_method = data.googleCM360FloodlightCountingMethod.toLowerCase();

  track(data.commonEventName, props, options);
  data.gtmOnSuccess();
};

const processViantEvent = () => {
  const viantSDKKey = "viant";

  if (!data.commonEventName) {
    log("ERROR: Freshpaint Viant GTM Template missing Freshpaint Event Name");
    data.gtmOnFailure();
    return;
  }

  let options = generateOptions(viantSDKKey);
  if (data.viantInstanceName) {
    const instanceNameToUse = data.viantInstanceName.trim();
    options = generateOptionsFromInstances(viantSDKKey, instanceNameToUse, false);
    if (options === undefined) {
      log("ERROR: Multiple Viant Advertiser IDs not supported: " + instanceNameToUse);
      data.gtmOnFailure();
      return;
    }
  }

  track(data.commonEventName, {}, options);
  data.gtmOnSuccess();
};

const callFreshpaintProxy = (cmdName, args) => {
  return callInWindow("_freshpaint_gtm_proxy", cmdName, args);
};

const identify = (userID, props, options) => {
  callFreshpaintProxy("apply", {
    // envID is no longer used, left in for backward compatibility
    envID: undefined,
    methodName: "identify",
    methodArgs: [userID, props, options],
  });
};

// track returns true if valid (truthy) event name, false otherwise
//  optional for caller to check return value - this is mainly to avoid invalid sdk track calls
const track = (eventName, props, options) => {
  if (!eventName) {
    return false;
  }

  callFreshpaintProxy("apply", {
    envID: undefined,
    methodName: "track",
    methodArgs: [eventName, props, options],
  });

  return true;
};

const addEventProperties = (props) => {
  // register is the exposed sdk instance name for addEventProperties
  callFreshpaintProxy("apply", {
    envID: undefined,
    methodName: "register",
    methodArgs: [props],
  });
};

const registerCallConversion = (tagIdConversionLabel, phoneNbr) => {
  callFreshpaintProxy("apply", {
    envID: undefined,
    methodName: "registerCallConversion",
    methodArgs: [tagIdConversionLabel, phoneNbr],
  });
};

const JS_URL = "https://perfalytics.com/static/js/freshpaint-gtm.js";

if (!callFreshpaintProxy("isLoaded")) {
  injectScript(JS_URL, processEvent, data.gtmOnFailure, "freshpaint_gtm_proxy");
} else {
  processEvent();
}
