export const stripeMessages = [
  {
    name: "action_required.requested_capabilities",
    message:
      "You need to request capabilities for the connected account. For details, see Request and unrequest capabilities.",
  },
  {
    name: "requirements.past_due",
    message:
      "Additional verification information is required to enable payout or charge capabilities on this account.",
  },
  {
    name: "requirements.pending_verification",
    message:
      "Stripe is currently verifying information on the connected account.",
  },
  {
    name: "rejected.fraud",
    message: "Account is rejected due to suspected fraud or illegal activity.",
  },
  {
    name: "rejected.terms_of_service",
    message:
      "Account is rejected due to suspected terms of service violations.",
  },
  {
    name: "rejected.listed",
    message:
      "Account is rejected because it’s on a third-party prohibited persons or companies list (such as financial services provider or government).",
  },
  {
    name: "rejected.other",
    message: "Account is rejected for another reason.",
  },
  {
    name: "listed",
    message:
      "Account might be on a prohibited persons or companies list (Stripe will investigate and either reject or reinstate the account appropriately).",
  },
  {
    name: "under_review",
    message: "Account is under review by Stripe.",
  },
  {
    name: "other",
    message:
      "Account isn’t rejected but is disabled for another reason while being reviewed.",
  },
];

export const accountMessages = [
  {
    name: ".id_number",
    message: "Social security number (SSN) is invalid.",
  },
  {
    name: ".address.city",
    message: "Provided city name is invalid.",
  },
  {
    name: ".address.line1",
    message: "Provided street Address is invalid.",
  },
  {
    name: ".address.postal_code",
    message: "Provided postal code is invalid.",
  },
  {
    name: ".address.state",
    message: "Provided state is invalid.",
  },
  {
    name: ".ssn_last_4",
    message: "Last 4 numbers of SSN is invalid.",
  },
  {
    name: ".dob.day",
    message: "Birth Day is invalid.",
  },
  {
    name: ".dob.month",
    message: "Birth Month is invalid.",
  },
  {
    name: ".dob.year",
    message: "Birth Year is invalid.",
  },
  {
    name: ".date",
    message: "Terms of Service date is invalid.",
  },
  {
    name: ".ip",
    message: "Terms of Service IP is invalid.",
  },
];
