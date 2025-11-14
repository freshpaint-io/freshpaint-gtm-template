export const appLovinEvent = 'appLovinEvent';
export const basisEvent = 'basisEvent';
export const bingAdsEvent = 'bingAdsEvent';
export const fbPixelEvent = 'fbPixelEvent';
export const ga4Event = 'ga4Event';
export const googleAdsCallConversionsEvent = 'googleAdsCallConversionsEvent';
export const googleAdsConversionApiEvent = 'googleAdsConversionApiEvent';
export const googleAdsEvent = 'googleAdsEvent';
export const googleCM360Event = 'googleCM360Event';
export const impactEvent = 'impactEvent';
export const linkedInAdsCAPIEvent = 'linkedInAdsCAPIEvent';
export const mntnEvent = 'mntnEvent';
export const nextdoorEvent = 'nextdoorEvent';
export const pinterestAdsEvent = 'pinterestAdsEvent';
export const quoraCAPIEvent = 'quoraCAPIEvent';
export const redditAdsEvent = 'redditAdsEvent';
export const siriusXMEvent = 'siriusXMEvent';
export const snapchatEvent = 'snapchatEvent';
export const spotifyCAPIEvent = 'spotifyCAPIEvent';
export const stackAdaptEvent = 'stackAdaptEvent';
export const theTradeDeskEvent = 'theTradeDeskEvent';
export const tikTokAdsEvent = 'tikTokAdsEvent';
export const twitterAdsEvent = 'twitterAdsEvent';
export const viantEvent = 'viantEvent';
export const yelpCAPIEvent = 'yelpCAPIEvent';
// Aren't destinations
export const addEventProperties = 'addEventProperties';
export const identify = 'identify';
export const track = 'track';
// DEPRECATED
export const linkedInAdsEvent = 'linkedInAdsEvent';
export const floodlightEvent = 'floodlightEvent';

export const rootParamSelectItems = [
  { value: appLovinEvent, displayValue: 'AppLovin' },
  { value: basisEvent, displayValue: 'Basis' },
  { value: bingAdsEvent, displayValue: 'Bing Ads' },
  { value: fbPixelEvent, displayValue: 'Facebook Conversions API' },
  { value: ga4Event, displayValue: 'Google Analytics 4 (Proxy)' },
  { value: googleAdsCallConversionsEvent, displayValue: 'Google Ads Call Conversions' },
  { value: googleAdsConversionApiEvent, displayValue: 'Google Ads Conversion API' },
  { value: googleAdsEvent, displayValue: 'Google Ads' },
  { value: googleCM360Event, displayValue: 'Google Campaign Manager 360 Conversions API' },
  { value: impactEvent, displayValue: 'impact.com' },
  { value: linkedInAdsCAPIEvent, displayValue: 'LinkedIn Ads Conversions API' },
  { value: mntnEvent, displayValue: 'MNTN' },
  { value: nextdoorEvent, displayValue: 'Nextdoor' },
  { value: pinterestAdsEvent, displayValue: 'Pinterest Ads' },
  { value: quoraCAPIEvent, displayValue: 'Quora Conversions API' },
  { value: redditAdsEvent, displayValue: 'Reddit Ads' },
  { value: siriusXMEvent, displayValue: 'SiriusXM' },
  { value: snapchatEvent, displayValue: 'Snapchat' },
  { value: spotifyCAPIEvent, displayValue: 'Spotify Conversions API' },
  { value: stackAdaptEvent, displayValue: 'StackAdapt' },
  { value: theTradeDeskEvent, displayValue: 'theTradeDesk' },
  { value: tikTokAdsEvent, displayValue: 'TikTok Ads' },
  { value: twitterAdsEvent, displayValue: 'Twitter Ads' },
  { value: viantEvent, displayValue: 'Viant' },
  { value: yelpCAPIEvent, displayValue: 'Yelp Conversions API' },
  { value: addEventProperties, displayValue: 'AddEventProperties' },
  { value: identify, displayValue: 'Identify' },
  { value: track, displayValue: 'Track' },
  {
    value: linkedInAdsEvent,
    displayValue: 'LinkedIn Ads - DEPRECATED - instead use LinkedIn Ads Conversions API',
  },
  {
    value: floodlightEvent,
    displayValue:
      'Floodlight - DEPRECATED - instead use Google Campaign Manager 360 Conversions API',
  },
];

export const trackDestinationSelectItems = [
  { value: 'Amplitude', displayValue: 'Amplitude' },
  { value: 'AppLovin', displayValue: 'AppLovin' },
  { value: 'Basis', displayValue: 'Basis' },
  { value: 'Bing Ads', displayValue: 'Bing Ads' },
  { value: 'Facebook Conversions API', displayValue: 'Facebook Conversions API' },
  { value: 'Google Ads Conversion API', displayValue: 'Google Ads Conversion API' },
  { value: 'Google AdWords New', displayValue: 'Google Ads' },
  { value: 'Google Analytics 4 Proxy', displayValue: 'Google Analytics 4 (Proxy)' },
  { value: 'Google Analytics 4', displayValue: 'Google Analytics 4 (Server-Side)' },
  {
    value: 'Google Campaign Manager 360 Conversions API',
    displayValue: 'Google Campaign Manager 360 Conversions API',
  },
  { value: 'impactdotcom', displayValue: 'impact.com' },
  { value: 'LinkedIn Ads Conversions API', displayValue: 'LinkedIn Ads Conversions API' },
  { value: 'Mixpanel', displayValue: 'Mixpanel' },
  { value: 'MNTN', displayValue: 'MNTN' },
  { value: 'Nextdoor', displayValue: 'Nextdoor' },
  { value: 'pinterest-ads', displayValue: 'Pinterest Ads' },
  { value: 'Quora Conversions API', displayValue: 'Quora Conversions API' },
  { value: 'reddit-ads', displayValue: 'Reddit Ads' },
  { value: 'SiriusXM', displayValue: 'SiriusXM' },
  { value: 'Snapchat', displayValue: 'Snapchat' },
  { value: 'Spotify Conversions API', displayValue: 'Spotify Conversions API' },
  { value: 'StackAdapt', displayValue: 'StackAdapt' },
  { value: 'theTradeDesk', displayValue: 'theTradeDesk' },
  { value: 'TikTok Ads', displayValue: 'TikTok Ads' },
  { value: 'Twitter Ads', displayValue: 'Twitter Ads' },
  { value: 'viant', displayValue: 'Viant' },
  { value: 'Yelp Conversions API', displayValue: 'Yelp Conversions API' },
  { value: 'Webhooks', displayValue: 'Webhooks' },
  {
    value: 'linkedin-ads',
    displayValue: 'LinkedIn Ads - DEPRECATED - instead use LinkedIn Ads Conversions API',
  },
  {
    value: 'Floodlight',
    displayValue:
      'Floodlight - DEPRECATED - instead use Google Campaign Manager 360 Conversions API',
  },
];

export const identifyDestinationSelectItems = [
  { value: 'Google Analytics 4 Proxy', displayValue: 'Google Analytics 4 (Proxy)' },
  { value: 'Amplitude', displayValue: 'Amplitude' },
  { value: 'impactdotcom', displayValue: 'impact.com' },
  { value: 'Mixpanel', displayValue: 'Mixpanel' },
  { value: 'Webhooks', displayValue: 'Webhooks' },
];
