---
title: Numbers
order: 2
---

# Numbers

Curating patterns to your user's cultural expectations will always provide a better experience. However, knowing all the distinctions between groups of people and their behaviors are very challenging.

The table below has a list of most of the possible combinations of locales.

<locale-table></locale-table>
## Counting

Use numerals when counting, do not spell numbers unless they are larger than 6 digits. In this exception, you may used named numbers. Some names are [localized depending on the scale](https://en.wikipedia.org/wiki/Names_of_large_numbers).

- 3 apples
- 100 large ducks
- 1 million people

## Unit measurement

Localization of units is typically in Metric, except for a few countries. Please refer to the [list of metricified countries](https://en.wikipedia.org/wiki/Metrication#Chronology_and_status_of_conversion_by_country) to determine if special changes must be made based on locale. Abbreviations are permitted as long as they are non-ambiguous to other units.

- `fr-FR` 10 meters
- `en-US` 3 in
- `my` 3 လမု

## Decimals

Use numerals when providing percentages, pay attention to [localization methods](https://en.wikipedia.org/wiki/Percent_sign) of using the percent sign (%).

- `en-US` 50%
- `tr-TR` %50
- `fr-FR` 50 %

## Datetime

Use a [localized long form](https://en.wikipedia.org/wiki/Date_format_by_country) of dates where appropriate. If there is limited space, follow the format of YYYY-MM-DD [(ISO-8601)](https://en.wikipedia.org/wiki/ISO_8601).

- `fi-FI` 20. joulukuuta 2012
- `en-PH` 20 December 2012
- `es-AR` 20 de diciembre de 2012

## Telephone

Use a [localized format](https://en.wikipedia.org/wiki/National_conventions_for_writing_telephone_numbers) for telephone numbers, this can be a combination of spaces, hyphens, and/or parenthesis. There is no ISO standard, the [ITU E.164](https://en.wikipedia.org/wiki/E.164) recommendation is acceptable.

- `en-PH` +63 (XXX) YYY ZZZZ
- `tr-TR` 0BBB AAA AA AA
- `en-US` NPA-NXX-XXXX

## Currency

Use a localized format for displaying currencies. Position of the currency symbol may differ between locales. Refer to decimal reference above. Negative numbers are also formatted differently between locales.

- `pt-BR` R$ 1.234,56
- `tr-TR` 1,234.56 ₺
- `en-NZ` $ 1,234.56

{% audience "engineer" %}

A simple method of localizing most of the above numbers can be done using the [`Intl` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) found in modern browsers.

```js
const date = new Date(Date.UTC(2012, 11, 21, 4, 0, 0));
const formatted = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}).format(date);
console.log(formatted); // "December 20, 2012" (varies by UTC timezone)
```

This method is especially recommended to provide solutions for displaying currency.

```js
const number = 123456.789;
const formatted = new Intl.NumberFormat('ja-JP', {
  style: 'currency',
  currency: 'JPY'
}).format(number);
console.log(formatted); // "￥123,457"
```

{% endaudience %}