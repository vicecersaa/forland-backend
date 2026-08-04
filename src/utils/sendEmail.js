import { Resend } from "resend";


const sendEmail = async ({
    to,
    subject,
    html
}) => {


    const resend = new Resend(
        process.env.RESEND_API_KEY
    );


    if (!process.env.RESEND_API_KEY) {

        throw new Error(
            "RESEND_API_KEY is missing"
        );

    }


    const result = await resend.emails.send({
    from: process.env.MAIL_FROM,
    to,
    subject,
    html
});

console.log(result);


};


export default sendEmail;