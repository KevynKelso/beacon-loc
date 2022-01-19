# EM beacon locator
This project is designed to show some capabilities of location tracking using
simple bluetooth beacons. It is meant to be a starting point for future developers
to reference when building their own bluetooth beacon locator apps.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Getting Started (local development)
- clone this repo
- run `chmod 755 script/*`
- run `./script/install-hooks.sh`
- contact me about getting the `.env` file. Kevyn.Kelso@emmicro-us.com

## Development Scripts

In the project directory, you can run:

### `npm run start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### `npm run test -- --coverage`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## Documentation
Visit [www.embeacons.com/docs](www.embeacons.com/docs) to view more detailed documentation
of how both the web app and Android app work for your own development purposes.

## Security
This app requires websockets to be enabled and may not run on all networks.

## Usage

### Public Web Page
Visit [www.embeacons.com](www.embeacons.com) to view map functionality, then
click on the settings button, then click `show qr code`. Scan the QR code with
an Android device to download the app, once downloaded, click setup (in the
Android app), scroll to the bottom where it says 'bridge name' and enter your name.
Then click the save button which will take you back to the main screen. From there,
click `Start scan`. After a few moments, you should see your name show up on table
on the map.

### Corresponding Android App
This web app is meant to be used with a corresponding Android app. It is available
for download in the public directory, or you can also scan the QR code from the
settings page to download on an Android device.

### Architecture Overview
![alt text](https://github.com/KevynKelso/beacon-loc/blob/main/src/docs/stack.png?raw=true)
