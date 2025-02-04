# Freshpaint GTM Template

## Overview
As described in the [Freshpaint documentation](https://documentation.freshpaint.io/integrations/google-tag-manager-integration), this template is used to send events to Freshpaint including:
* Server-side destinations
  * Google Analytics 4 (proxy)
  * Google Ads
  * Google Ads Call Conversion
  * Google Campaign Manager 360 API
  * Facebook Conversions API
  * Basis
  * theTradeDesk
  * Stackadapt
  * Bing Ads
  * TikTok Ads
  * Impact.com
  * LinkedIn Ads
  * Reddit Ads
  * Pinterest Ads
  * Twitter Ads
* track
* identify

It may also be used for to invoke the following Freshpaint data layer function:
* addEventProperties

## Determining latest gallery template version
See "Last Updated" at [Community Template Gallery: Freshpaint](https://tagmanager.google.com/gallery/#/owners/freshpaint-io/templates/freshpaint-gtm-template)
## Updating the Template
### Testing the template
It's critical to have done a file-import of the template via the GTM UI before merge, including:
* Testing functionality
* Ensuring there are no parsing errors on import
  * If there are parsing errors, the change will not show 
### Updating template metadata for gallery
After a new template version is merged to main, a separate change must be made to [metadata.yaml](metadata.yaml) and pushed to main, with these changes:
* sha: sha of the just-pushed version
* changeNotes: description of the changes in the new version

For more info, including how multiple versions may be maintained, see [here](https://developers.google.com/tag-platform/tag-manager/templates/gallery#update_your_template)