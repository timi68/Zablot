import { MailOptions } from "nodemailer/lib/sendmail-transport";

import Handlebars, { compile } from "handlebars";
import { readFileSync } from "node:fs";
import transporter from "@lib/transporter";
import HttpError from "./httpError";

// let register template footer, we are able to include it in all template footer
const footerTemplate = readFileSync("./templates/footer.hbs", "utf8");

// Register the footer and banner template
Handlebars.registerPartial("footer", footerTemplate);

export enum email {
  REGISTER = "register",
  DELETE = "delete",
  CHANGE = "change",
  VERIFY = "verify",
  SUPPORT = "support",
}

export default async function Emailer(
  email: MailOptions["to"],
  type: email,
  data?: any
) {
  const mailOptions: Partial<MailOptions> = {
    from: "tech@nubisng.com",
    to: email,
  };

  const addHtml = async (template: string) =>
    compile(
      readFileSync("./templates/" + template + ".hbs", { encoding: "utf-8" })
    )(data);

  // switch (type) {
  //   case email.REGISTER:
  //     mailOptions.subject = "Nubis User Registration";
  //     mailOptions.html = await addHtml("greetings");
  //     break;
  //   case email.CHANGE:
  //     mailOptions.subject = "Request For Change Of Password";
  //     mailOptions.html = await addHtml("password-reset");
  //     break;
  //   case email.SUPPORT:
  //     mailOptions.subject = `${data.name} Request for a support`;
  //     mailOptions.html = await addHtml("support");
  //     break;
  //   default:
  //     break;
  // }

  try {
    return await transporter.sendMail(mailOptions);
  } catch (error: any) {
    throw new HttpError("We having issue communicating with the support team");
  }
}
