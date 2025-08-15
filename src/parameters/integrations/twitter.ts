import { equals, paramTable, radio, select, text } from '../helpers';

export default function TwitterParams() {
  const isTwitterEvent = equals('tagType', 'twitterAdsEvent');
  const onlyForTwitter = [isTwitterEvent];

  const eventNameSelect = select({
    name: 'param_table_key_column',
    displayName: 'Event parameter name',
    macrosInSelect: false,
    selectItems: [
      {
        value: 'value',
        displayValue:
          "'value' - amount of an action valuable to your business, such as a purchase. Example: 12.99",
      },
      {
        value: 'currency',
        displayValue:
          "'currency' - use if the 'value' parameter is set. ISO 4217 currency code. Example: USD",
      },
      {
        value: 'content_name',
        displayValue:
          "'content_name' - name of the page or product. Example: Promotional User Sign-up Complete",
      },
      {
        value: 'content_category',
        displayValue: "'content_category' - category of the page or product. Example: 30day Trial",
      },
      {
        value: 'content_ids',
        displayValue:
          "'content_ids' - product IDs associated with the Purchase event. Example: ['SKU-AB12','SKU-DE45'].",
      },
      {
        value: 'content_type',
        displayValue:
          "'content_type' - use either 'product' or 'product_group' based on the content_ids",
      },
      {
        value: 'num_items',
        displayValue:
          "'num_items' - number of items associated with the conversion event. Example: 3.",
      },
      {
        value: 'order_id',
        displayValue:
          "'order_id' - order ID associated with the user's purchase. Example: OID-8767-1",
      },
    ],
    simpleValueType: true,
  });

  const eventValueText = text({
    name: 'param_table_value_column',
    displayName: 'Value for the event parameter',
    simpleValueType: true,
  });

  return [
    radio({
      name: 'twitterEventName',
      displayName: 'Select tag event:',
      radioItems: [
        { value: 'PageView', displayValue: 'PageView' },
        { value: 'ViewContent', displayValue: 'ViewContent' },
        { value: 'Search', displayValue: 'Search' },
        { value: 'AddToCart', displayValue: 'AddToCart' },
        { value: 'AddToWishlist', displayValue: 'AddToWishlist' },
        { value: 'InitiateCheckout', displayValue: 'InitiateCheckout' },
        { value: 'AddPaymentInfo', displayValue: 'AddPaymentInfo' },
        { value: 'Purchase', displayValue: 'Purchase' },
        { value: 'Signup', displayValue: 'Signup' },
        { value: 'Download', displayValue: 'Download' },
        { value: 'CompleteRegistration', displayValue: 'CompleteRegistration' },
      ],
      simpleValueType: true,
      enablingConditions: onlyForTwitter,
    }),
    paramTable({
      name: 'twitterEventParameters',
      displayName: 'Event Parameters',
      paramTableColumns: [
        { param: eventNameSelect, isUnique: true },
        { param: eventValueText, isUnique: false },
      ],
      enablingConditions: onlyForTwitter,
    }),
  ];
}
