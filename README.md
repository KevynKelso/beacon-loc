# EM beacon locator

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Getting Started
- clone this repo
- run `chmod 755 script/*`
- run `./script/install-hooks.sh`

## Development Scripts

In the project directory, you can run:

### `npm run start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run test -- --coverage`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## Deployment Environment
Currently this app is deployed on [Heroku](https://heroku.com) using the [create react app buildpack](https://buildpack-registry.s3.amazonaws.com/buildpacks/mars/create-react-app.tgz)

## Security
This app requires websockets to be enabled and may not run on all networks.

## Usage
### Corresponding Android App
This web app is meant to be used with a corresponding Android app. It is available
for download in the public directory, or you can also scan the QR code from the
settings page to download on an Android device.

### Architecture Overview
![alt text](https://github.com/KevynKelso/beacon-loc/blob/main/src/docs/stack.png?raw=true)
