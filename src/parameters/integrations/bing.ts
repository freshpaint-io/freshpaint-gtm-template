import { equals, group, nonEmpty, select, text } from '../helpers';

export default function BingParams() {
  const isBingEvent = equals('tagType', 'bingAdsEvent');
  const onlyForBingAds = [isBingEvent];

  const isEmptyEvent = equals('bingEventAction', '');
  const isCustomEvent = equals('bingEventType', 'CUSTOM');
  const isUserDefinedEvent = equals('bingEventType', 'userDefined');
  const isPageViewSPA = equals('bingEventType', 'pageViewSPA');

  const isVariableRevenueEvent = equals('bingEventType', 'VARIABLE_REVENUE');
  const isHotelEvent = equals('bingEventType', 'hotel');
  const isEcommerceEvent = equals('bingEventType', 'ecommerce');
  const isTravelEvent = equals('bingEventType', 'travel');

  const currencyText = () =>
    text({
      name: 'bingCurrency',
      displayName: 'Currency',
      simpleValueType: true,
      help: 'Currency value must be ISO standard currency code',
      enablingConditions: [isVariableRevenueEvent, isCustomEvent, isHotelEvent],
      defaultValue: 'USD',
    });

  const revenueText = () =>
    text({
      name: 'bingRevenue',
      displayName: 'Revenue Value',
      simpleValueType: true,
      enablingConditions: [isVariableRevenueEvent, isCustomEvent],
    });

  const customEventActionText = () =>
    text({
      name: 'bingCustomEventAction',
      displayName: 'Define your own event action',
      simpleValueType: true,
      enablingConditions: [isCustomEvent, isUserDefinedEvent, isEmptyEvent],
    });

  const customEventCategoryText = () =>
    text({
      name: 'bingEventCategory',
      displayName: 'Event category',
      simpleValueType: true,
      enablingConditions: [isCustomEvent],
    });

  const customEventLabelText = () =>
    text({
      name: 'bingEventLabel',
      displayName: 'Event label',
      simpleValueType: true,
      enablingConditions: [isCustomEvent],
    });

  const customEventValueText = () =>
    text({
      name: 'bingEventValue',
      displayName: 'Event value',
      simpleValueType: true,
      enablingConditions: [isCustomEvent],
    });

  const pageTitleText = () =>
    text({
      name: 'bingPageTitle',
      displayName: 'Page title',
      simpleValueType: true,
      help: 'Can leave empty to re-use document title',
      enablingConditions: [isPageViewSPA],
    });

  const pagePathText = () =>
    text({
      name: 'bingPagePath',
      displayName: 'Page path',
      simpleValueType: true,
      help: "Must start with a '/', ex: '/spa_page'",
      enablingConditions: [isPageViewSPA],
    });

  const eventActionSelect = () =>
    select({
      name: 'bingEventAction',
      displayName: 'Event action',
      macrosInSelect: true,
      selectItems: [
        { value: '', displayValue: 'Custom (input action name manually)' },
        { value: 'add_payment_info', displayValue: 'Add payment info (add_payment_info)' },
        { value: 'add_to_cart', displayValue: 'Add to cart (add_to_cart)' },
        { value: 'add_to_wishlist', displayValue: 'Add to wishlist (add_to_wishlist)' },
        { value: 'begin_checkout', displayValue: 'Begin checkout (begin_checkout)' },
        { value: 'checkout_progress', displayValue: 'Checkout progress (checkout_progress)' },
        { value: 'exception', displayValue: 'Exception (exception)' },
        { value: 'generate_lead', displayValue: 'Generate lead (generate_lead)' },
        { value: 'login', displayValue: 'Log in (login)' },
        { value: 'purchase', displayValue: 'Purchase (purchase)' },
        { value: 'refund', displayValue: 'Refund (refund)' },
        { value: 'remove_from_cart', displayValue: 'Remove from cart (remove_from_cart)' },
        { value: 'screen_view', displayValue: 'Screen view (screen_view)' },
        { value: 'search', displayValue: 'Search (search)' },
        { value: 'select_content', displayValue: 'Select content (select_content)' },
        { value: 'set_checkout_option', displayValue: 'Set checkout option (set_checkout_option)' },
        { value: 'share', displayValue: 'Share (share)' },
        { value: 'sign_up', displayValue: 'Sign up (sign_up)' },
        { value: 'view_item', displayValue: 'View item (view_item)' },
        { value: 'view_item_list', displayValue: 'View item list (view_item_list)' },
        { value: 'view_promotion', displayValue: 'View promotion (view_promotion)' },
        { value: 'view_search_results', displayValue: 'View search results (view_search_results)' },
      ],
      simpleValueType: true,
      help: 'If you select "Custom" and then leave the "Define your own event action" field blank, an empty event action value will be sent',
      enablingConditions: [isEcommerceEvent, isHotelEvent, isTravelEvent],
    });

  function travelGroup() {
    const destIDText = text({
      name: 'bingTravelDestid',
      displayName: 'Travel destination ID',
      simpleValueType: true,
    });

    const originIDText = text({
      name: 'bingTravelOriginid',
      displayName: 'Travel origin ID',
      simpleValueType: true,
    });

    const pageTypeSelect = select({
      name: 'bingTravelPagetype',
      displayName: 'Travel page type',
      macrosInSelect: true,
      selectItems: [
        { value: 'home', displayValue: 'Home' },
        { value: 'searchresults', displayValue: 'Search Results' },
        { value: 'offerdetail', displayValue: 'Offer Detail' },
        { value: 'conversionintent', displayValue: 'Conversion Intent' },
        { value: 'conversion', displayValue: 'Conversion' },
        { value: 'cancel', displayValue: 'Cancel' },
        { value: 'other', displayValue: 'Other' },
      ],
      simpleValueType: true,
    });

    const startDateText = text({
      name: 'bingTravelStartdate',
      displayName: 'Travel start date',
      simpleValueType: true,
      help: 'Value must be in YYYY-MM-DD date format',
    });

    const endDateText = text({
      name: 'bingTravelEnddate',
      displayName: 'Travel end date',
      simpleValueType: true,
      help: 'Value must be in YYYY-MM-DD date format',
    });

    const totalValueText = text({
      name: 'bingTravelTotalvalue',
      displayName: 'Travel total value',
      simpleValueType: true,
    });

    return group({
      name: 'bingTravelParams',
      displayName: 'Travel event parameters',
      groupStyle: 'NO_ZIPPY',
      subParams: [
        destIDText,
        originIDText,
        pageTypeSelect,
        startDateText,
        endDateText,
        totalValueText,
      ],
      enablingConditions: [isTravelEvent],
    });
  }

  function hotelGroup() {
    const basePriceText = text({
      name: 'bingHctBasePrice',
      displayName: 'Hotel base price',
      simpleValueType: true,
    });

    const bookingXrefText = text({
      name: 'bingHctBookingXref',
      displayName: 'Hotel booking reference #',
      simpleValueType: true,
    });

    const checkinDateText = text({
      name: 'bingHctCheckinDate',
      displayName: 'Hotel check-in date',
      simpleValueType: true,
      help: 'Value must be in YYYY-MM-DD date format',
    });

    const checkoutDateText = text({
      name: 'bingHctCheckoutDate',
      displayName: 'Hotel check-out date',
      simpleValueType: true,
      help: 'Value must be in YYYY-MM-DD date format',
    });

    const lengthOfStayText = text({
      name: 'bingHctLengthOfStay',
      displayName: 'Hotel length of stay',
      simpleValueType: true,
    });

    const partnerHotelIdText = text({
      name: 'bingHctPartnerHotelId',
      displayName: 'Partner hotel ID',
      simpleValueType: true,
    });

    const totalPriceText = text({
      name: 'bingHctTotalPrice',
      displayName: 'Hotel total price',
      simpleValueType: true,
    });

    const pageTypeSelect = select({
      name: 'bingHctPagetype',
      displayName: 'Hotel page type',
      macrosInSelect: true,
      selectItems: [
        { value: 'home', displayValue: 'Home' },
        { value: 'searchresults', displayValue: 'Search Results' },
        { value: 'offerdetail', displayValue: 'Offer Detail' },
        { value: 'conversionintent', displayValue: 'Conversion Intent' },
        { value: 'conversion', displayValue: 'Conversion' },
        { value: 'property', displayValue: 'Property' },
        { value: 'cart', displayValue: 'Cart' },
        { value: 'purchase', displayValue: 'Purchase' },
        { value: 'cancel', displayValue: 'Cancel' },
        { value: 'other', displayValue: 'Other' },
      ],
      simpleValueType: true,
    });

    const hotelLabel = {
      type: 'LABEL',
      name: 'bingHotelLabel',
      displayName:
        'The hotel total price (hct_total_price) and currency parameters are required when you include other hotel parameters.',
    };

    return group({
      name: 'bingHotelParams',
      displayName: 'Hotel event parameters',
      groupStyle: 'NO_ZIPPY',
      subParams: [
        basePriceText,
        bookingXrefText,
        checkinDateText,
        checkoutDateText,
        lengthOfStayText,
        partnerHotelIdText,
        totalPriceText,
        pageTypeSelect,
        hotelLabel,
      ],
      enablingConditions: [isHotelEvent],
    });
  }

  function ecommerceGroup() {
    const prodIdText = text({
      name: 'bingEcommProdId',
      displayName: 'Retail product ID',
      simpleValueType: true,
    });

    const pageTypeSelect = select({
      name: 'bingEcommPagetype',
      displayName: 'Retail page type',
      macrosInSelect: true,
      selectItems: [
        { value: 'home', displayValue: 'Home' },
        { value: 'searchresults', displayValue: 'Search Results' },
        { value: 'category', displayValue: 'Category' },
        { value: 'product', displayValue: 'Product' },
        { value: 'cart', displayValue: 'Cart' },
        { value: 'purchase', displayValue: 'Purchase' },
        { value: 'other', displayValue: 'Other' },
      ],
      simpleValueType: true,
      help: 'The pagetype parameter is required when you include the prodid parameter.',
    });

    const totalValueText = text({
      name: 'bingEcommTotalValue',
      displayName: 'Retail total value',
      simpleValueType: true,
    });

    const categoryText = text({
      name: 'bingEcommCategory',
      displayName: 'Retail category',
      simpleValueType: true,
    });

    return group({
      name: 'bingEcomParams',
      displayName: 'Ecommerce event parameters',
      groupStyle: 'NO_ZIPPY',
      subParams: [prodIdText, pageTypeSelect, totalValueText, categoryText],
      enablingConditions: [isEcommerceEvent],
    });
  }

  return [
    text({
      name: 'bingAdsInstanceName',
      displayName: 'Specific Tag ID (optional)',
      help: 'If multiple Tag IDs are configured for the Bing Ads destination type, specify one to deliver to (if left blank, this event will be delivered to all configured Tag IDs)',
      simpleValueType: true,
      enablingConditions: onlyForBingAds,
    }),
    select({
      name: 'bingEventType',
      displayName: 'Track Type',
      help: 'Select "Page View" only when your Freshpaint Bing Ads configuration has "Automatically Send Page View Events" unchecked',
      macrosInSelect: false,
      notSetText: '-',
      valueValidators: [nonEmpty()],
      selectItems: [
        { value: 'CUSTOM_PAGE_LOAD', displayValue: 'Page View' },
        { value: 'VARIABLE_REVENUE', displayValue: 'Variable revenue for destination URL' },
        { value: 'CUSTOM', displayValue: 'Custom conversion' },
        { value: 'ecommerce', displayValue: 'Vertical: Ecommerce' },
        { value: 'hotel', displayValue: 'Vertical: Hotel' },
        { value: 'travel', displayValue: 'Vertical: Travel' },
        { value: 'userDefined', displayValue: 'Define your own' },
      ],
      simpleValueType: true,
      enablingConditions: onlyForBingAds,
    }),

    // params that load depending on which 'Track Type' is selected
    currencyText(),
    revenueText(),
    customEventActionText(),
    customEventCategoryText(),
    customEventLabelText(),
    customEventValueText(),
    pageTitleText(),
    pagePathText(),

    eventActionSelect(),
    travelGroup(),
    hotelGroup(),
    ecommerceGroup(),
  ];
}
