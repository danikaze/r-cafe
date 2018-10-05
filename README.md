# Яakuten Cafeteria Menu extension

Easily display what's in the Cafeteria of the Яakuten Crimson House without *JavaScript errors* ;)

## How to install it in Chrome

Get the extension in the [Chrome Store](http://bit.ly/&#114;akuten-cafeteria-menu)

## Change log

###
- Fixed a bug where the congestion for the 22F was shown when opening the popup
  for the first time (even if the active floor is the 9F)

### 0.7.6
- Fixed RAP link when not logged in to open in a new window (and its CSS style)

### 0.7.5
- Added RAP link when not logged in
- CSS fix in Windows

### 0.7.4
- Display prices again on paid dishes

### 0.7.3
- Fix the display of ingredients of each dish
- Improved error message

### 0.7.2
- Fix title version

### 0.7.1
- Display an error message if the data can't be retrieved
- Fix duplicated dishes coming from the server
- Handle _halal_ menu properly
- Dish photo is clickable now (it opens the original image in a new tab)

### 0.7.0
- Read the menu information from RAP instead of the API
- Fixed the top bar to accomodate more cafeterias (_Rise Building 13F_, _Osaka Branch_)
- Extension title and installed version are shown now in the top bar

### 0.6.1
- Remove github link

### 0.6.0
- Floors are ordered now (in case API info is messed up)
- Dishes can be sorted by their properties (booth type, kcal, carbs, fat, protein, sodium, likes)
  - Click on the sorting type name to sort by the next type
  - Shift + Click on the sorting type name to sort by the previous type
  - Click on the arrow to change the sorting direction (asc/desc)
- Cafeteria congestion data is shown even if the user is not logged in RAT (in selected hours)
- Congestion icon CSS is fixed

### 0.5.0
- Display more information for each dish:
  - _Umai_ count (number of likes)
  - Nutritional information
  - Included ingredients

### 0.4.0
- New UI in the header icons/buttons
- Don't display duplicated elements coming from the API

### 0.3.0
- Added cafeteria congestion data support (only displayed from 11:00-14:00 and 19:00-21:00)
- Added new icons

### 0.2.0
- Show night menu by default if it's between 14:00 and 0:00

### 0.1.2
- Added github link ;)

### 0.1.1
- Added extension icons

### 0.1.0
- First release
