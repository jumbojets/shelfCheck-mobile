# shelfCheck mobile

### Install

You will need to install npm and node.js on the machine. The latest versions would be preferable. Additionall install the expo client by running

`npm install expo-cli --global`

### Dependencies

All dependenices are from expo. Install with this command

`yarn add expo`

### Run

Type in the command below to run project. Can run in browser, simulator or in expo app through the website that pops up.

`yarn start`

### Build

Run this command to build an iOS ipa. You will have to enter in proper account details.

`expo build:ios`

Run this command to build an Android APK or App Bundle

`expo build:android`

### Notes

To run or build this project you will need a file called keys.config.js in /src that exports an object with a shelfcheck key.
