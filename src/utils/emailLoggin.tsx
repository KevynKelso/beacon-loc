import emailjs from '@emailjs/browser'
import Environment from '../environment.config'


let last = +new Date()
let firstEmail = true

export function logError(errorReports: boolean, message: string, additionalInfo?: any) {
  if (!errorReports) {
    console.warn(message, additionalInfo)
    return
  }

  const now = +new Date()
  if (firstEmail || now - last > 60000) { // only send emails every minute
    firstEmail = false
    last = now
    if (Environment().environmentType === "production") {
      emailjs.send(Environment().smtpServiceId, "template_29uvvnd", { "message": message, "additional_info": additionalInfo.toString() }, Environment().smtpUserId).then(() => console.log("sent"))
    }
    return
  }
  console.log("rate limited email sending")
  console.warn(message, additionalInfo)
}
