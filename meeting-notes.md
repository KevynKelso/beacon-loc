# Meeting 1/18/2022 w/ Chris Laganga

## Work left TODO on web app
- MqttListener.tsx needs to have the database functionality separated out into
a different file/hook or something

- convert mac address to serial number in popover

- documentation page

## Work left TODO on android app
- unit testing

- CHANGELOG

- break down MainActivity.kt into smaller classes

- add documentation on android app to the docs page of the web app

- come up with logic for efficiently sending MQTT messages instead of every time
the app sees a bluetooth device advertise (don't spam the MQTT if a device
advertizes every few seconds)

- use our AWS EC2 MQTT broker instead of HiveMQ's free broker

## Questions for Chris
- As a more experienced developer, what would you do differently on either app?

- Do you see any immediate problems/bad gut reactions?

- What can I do better to make the code more readable/developer friendly on both
the web app & Android app?

- Do you have any immediate security concerns?

- I'm new to Android development, do you have any advice for writing useful unit
tests for the Android app?

- What are your thoughts on sending SMTP emails to myself when exceptions occur?
Is there a better way to get notified of problems?

## Notes
- queue up sending mqtt messages, send on a background thread
- strings need to be string resouces
- use isEmpty methods
- android activity lifecycle
- There might be a better way to send email
- crashlytics might be a better way than sending email to myself
- setting for crash information instead of alert right away
- definately explain all the details on how to use everything
- note the architecture flaw of
- consider using epoch time instead of 14 digit time
- timezones will be an issue
- REACT\_APP environment variables
- & symbol in the svg file, not sure what's going on with that
