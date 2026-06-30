/**
 * English string archive — kept for reference if the app ever needs multi-language support.
 * These are the original English UI strings before the Swedish translation (ticket #87).
 * NOT used at runtime.
 */

export const EN = {
  // EventFormStepper
  stepper: {
    back: "Back",
    next: "Next",
    submit: "Submit",
    requiredFieldsTooltip: "Please fill out all required fields before continuing.",
  },

  // StepEventDetails
  details: {
    organiserLabel: "Organiser",
    organiserPlaceholder: "Organiser name",
    orgNrLabel: "Organisation number",
    orgNrPlaceholder: "XXXXXX-XXXX",
    orgNrAutoFilled: "Auto-filled from your account",
    titleLabel: "Title",
    titlePlaceholder: "Event Title",
    categoriesLabel: "Select Categories",
    categoriesHelp: "Max {MAX_CATEGORIES} categories — click a selected category to open subcategories",
    subcategoriesSuffix: "Subcategories",
    unselectAll: "Unselect All",
    selectAll: "Select All",
    filtersLabel: "Filters",
    descriptionLabel: "Description",
    descriptionPlaceholder: "Event Description",
    eventUrlLabel: "Event URL",
    eventUrlPlaceholder: "https://event-link.com",
    bookingUrlLabel: "Booking URL",
    bookingUrlPlaceholder: "https://booking-link.com",
    notAllRequired: "* Not all fields above are required",
  },

  // StepEventLocation
  location: {
    streetNameLabel: "Street Name",
    streetNamePlaceholder: "Street name",
    streetName2Label: "Street Name 2",
    streetName2Placeholder: "Apartment, suite, etc.",
    houseNumberLabel: "House Number",
    houseNumberPlaceholder: "123",
    cityLabel: "City",
    cityPlaceholder: "City name",
    postalCodeLabel: "Postal Code",
    postalCodePlaceholder: "12345",
    gpsLabel: "GPS Coordinates",
    gpsAriaLabel: "Show GPS help",
    gpsPlaceholder: "e.g., 56.0465, 12.6945",
    notAllRequired: "* Not all fields above are required",
  },

  // StepEventDateTime
  datetime: {
    timingTypeLabel: "Select Timing Type",
    singleInstance: "Single instance",
    multipleDates: "Multiple dates",
    recurringWeekly: "Recurring (weekly)",
    alwaysOpen: "Always Open",
    selectDate: "Select date",
    selectDateRange: "Select date range",
    startTimeLabel: "Start Time",
    startTimePlaceholder: "Start",
    endTimeLabel: "End Time",
    endTimePlaceholder: "End",
    weekdayShort: { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" },
    alwaysOpenDescription: "This event will be listed as always open.",
    notAllRequired: "* Not all fields above are required",
  },

  // StepSpotlight
  spotlight: {
    label: "Spotlight",
    description: "Promote this event in spotlight. Toggle off to skip spotlight settings.",
    startDateLabel: "Spotlight start date",
    endDateLabel: "Spotlight end date",
    pickDate: "Pick a date",
    period: "Spotlight period:",
    daysPrice: "{days} days × 99 kr",
    vat: "VAT (included)",
    total: "Total (incl. VAT)",
    priceNote: "The price is 99 SEK per day plus 125 SEK VAT. VAT is included in the total",
  },

  // SpotlightPurchaseDialog (my-events spotlight placement purchase flow)
  spotlightPurchase: {
    title: "Spotlight your event",
    choosePackagePrompt: "Choose how long your event stays in the spotlight.",
    packagesError: "Could not load packages. Please try again.",
    continue: "Continue",
    days: "{days} days",
    daysInSpotlight: "{days} days in the spotlight",
    choosePaymentMethod: "Choose a payment method",
    demoBadgeTitle: "Demo / test mode.",
    demoBadgeBody:
      "Payments are simulated for now — no real money is charged. Real payments will be wired up later.",
    back: "Back",
    pay: "Pay",
    processing: "Processing payment…",
    paymentSuccess: "Payment successful",
    spotlightUntil: "Your event is now in the spotlight until {date}.",
    done: "Done",
    errorTitle: "Something went wrong",
    forbidden: "You can only spotlight events that you own.",
    checkoutFailed: "Could not start the payment.",
    confirmFailed: "Could not confirm the payment.",
    genericError: "Something went wrong. Please try again later.",
    close: "Close",
    retry: "Try again",
    badge: "Spotlight",
    toastSuccess: "Your event is now in the spotlight",
  },

  // StepEventReview
  review: {
    heading: "Review your event info",
    eventTitle: "Event Title",
    organiser: "Organiser",
    orgNr: "Organisation number",
    description: "Description",
    location: "Location",
    eventUrl: "Event URL",
    bookingUrl: "Booking URL",
    start: "Start",
    end: "End",
    dates: "Dates",
    weekdays: "Weekdays",
    spotlight: "Spotlight",
    spotlightEnabled: "Enabled",
    spotlightDisabled: "Disabled",
    period: "Period:",
    daysPrice: "{days} days × 99 kr",
    vat: "VAT (included)",
    total: "Total (incl. VAT)",
    priceNote: "The price is 99 kr per day plus 125 kr VAT. VAT is included in the total",
  },

  // Zod validation messages (create-event-schema.ts)
  validation: {
    organiserRequired: "Organiser is required",
    orgNrRequired: "Organisation number is required",
    orgNrFormat: "Use format XXXXXX-XXXX",
    orgNrInvalid: "Invalid organisation number (checksum)",
    titleRequired: "Title is required",
    descriptionRequired: "Description is required",
    categoryRequired: "Please select at least one category",
    invalidUrl: "Must be a valid URL",
    streetNameRequired: "Street name is required",
    cityRequired: "City is required",
    postalCodeRequired: "Postal code is required",
    maxChars: "Max 50 characters",
    startTimeRequired: "Start time is required",
    endTimeRequired: "End time is required",
  },
} as const;
