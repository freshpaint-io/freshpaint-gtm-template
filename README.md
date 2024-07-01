# Freshpaint GTM Template

## Overview
As described in the [Freshpaint documentation](https://documentation.freshpaint.io/integrations/google-tag-manager-integration), this template is used to send events to Freshpaint including:
* Server-side destinations
  * Google Analytics 4 (proxy)
  * Google Ads
  * Google Ads Call Conversion
  * Facebook Conversions API
  * Floodlight
  * Basis
  * LinkedIn Ads
  * Bing Ads
  * Impact.com
  * Stackadapt
  * theTradeDesk
  * Twitter Ads
* track
* identify

It may also be used for to invoke the following Freshpaint data layer function:
* addEventProperties

## Updating the Template
After a new template version is merged to main, a separate change must be made to [metadata.yaml](metadata.yaml) and pushed to main, with these changes:
* sha: sha of the just-pushed version
* changeNotes: description of the changes in the new version

For more info, including how multiple versions may be maintained, see [here](https://developers.google.com/tag-platform/tag-manager/templates/gallery#update_your_template)