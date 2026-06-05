'use client';

import { createContext, useContext, useState } from 'react';

const CountryContext = createContext(null);

const countriesByRegion = {
  ASIA: [
    { code: "IN", name: "INDIA", countryCode: "IN", currency: "₹", currencyCode: "INR" },
    { code: "JP", name: "JAPAN", countryCode: "JP", currency: "¥", currencyCode: "JPY" },
  ],
  AMERICA: [
    { code: "US", name: "USA", countryCode: "US", currency: "$", currencyCode: "USD" },
    { code: "CA_EN", name: "CANADA (EN)", countryCode: "CA", currency: "$", currencyCode: "CAD" },
    { code: "CA_FR", name: "CANADA (FR)", countryCode: "CA", currency: "$", currencyCode: "CAD" },
    { code: "MX", name: "MÉXICO", countryCode: "MX", currency: "$", currencyCode: "MXN" },
    { code: "BR", name: "BRASIL", countryCode: "BR", currency: "R$", currencyCode: "BRL" },
  ],
  EUROPE: [
    { code: "AT", name: "AUSTRIA", countryCode: "AT", currency: "€", currencyCode: "EUR" },
    { code: "BE", name: "BELGIUM (NL)", countryCode: "BE", currency: "€", currencyCode: "EUR" },
    { code: "DK", name: "DENMARK", countryCode: "DK", currency: "kr", currencyCode: "DKK" },
    { code: "DE", name: "DEUTSCHLAND", countryCode: "DE", currency: "€", currencyCode: "EUR" },
    { code: "ES", name: "ESPAÑA", countryCode: "ES", currency: "€", currencyCode: "EUR" },
    { code: "FI", name: "FINLAND", countryCode: "FI", currency: "€", currencyCode: "EUR" },
    { code: "FR", name: "FRANCE", countryCode: "FR", currency: "€", currencyCode: "EUR" },
    { code: "GR", name: "GREECE", countryCode: "GR", currency: "€", currencyCode: "EUR" },
    { code: "GB", name: "UNITED KINGDOM", countryCode: "GB", currency: "£", currencyCode: "GBP" },
    { code: "IT", name: "ITALIA", countryCode: "IT", currency: "€", currencyCode: "EUR" },
  ],
};

const DEFAULT_COUNTRY = {
  code: "IN",
  name: "INDIA",
  countryCode: "IN",
  currency: "₹",
  currencyCode: "INR",
};

export function CountryProvider({ children }) {
  const [selectedCountry, setSelectedCountry] = useState(DEFAULT_COUNTRY);

  return (
    <CountryContext.Provider value={{ 
      selectedCountry, 
      setSelectedCountry, 
      countriesByRegion,
      currency: selectedCountry.currency,
      currencyCode: selectedCountry.currencyCode 
    }}>
      {children}
    </CountryContext.Provider>
  );
}

export const useCountry = () => useContext(CountryContext);
