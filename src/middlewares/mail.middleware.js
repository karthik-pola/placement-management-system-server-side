import nodemailer from 'nodemailer';
import Mailgen from "mailgen";
import { asyncHandler } from '../utils/asyncHandler.js';

// export const generateMail = async (Email , Name, Intro, Message, Outro) => {
//     let config = {
//         service: 'gmail',
//         auth: {
//             user: 'placement4645@gmail.com',
//             pass: 'oawywnmrvnbwmyvl',
//         }
//     }

//     const transporter = nodemailer.createTransport(config);

//     let MailGenerator = new Mailgen({
//         theme: "default",
//         product: {
//             name: "Campus Connect",
//             link: "https://mailgen.js/"
//         }
//     })

//     // Split the message by commas and join with newline characters
//     const formattedMessage = Message.split(',').join('\n');

//     let response = {
//         body: {
//             name: Name,
//             intro: Intro,
//             action: {
//                 instructions: formattedMessage,
//                 button: {
//                     color: '#22BC66',
//                     text: 'Register for the new drive',
//                     link: 'https://your-website.com/register'
//                 }
//             },
//             outro: Outro
//         }
//     }

//     let mail = MailGenerator.generate(response);

//     let message = {
//         from: 'placement2024@gmail.com',
//         to: Email,
//         subject: "New Drive Notification",
//         html: mail
//     }

//     transporter.sendMail(message)
//         .then(() => {
//             return console.log("Mail sent successfully")
//         })
//         .catch(err => {
//             console.log(err);
//         })
// }




async function generateMail(email, name, subject, Message, outro) {
    // Split the message by commas and join with newline characters
    const formattedMessage = Message.split(',').join('\n');

    let config = {
        service: 'gmail',
        auth: {
            user: 'placement4645@gmail.com',
            pass: 'oawywnmrvnbwmyvl',
        }
    }

    const transporter = nodemailer.createTransport(config);

    let MailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Campus Connect",
            link: "https://mailgen.js/"
        }
    })

    let response = {
        body: {
            name: name,
            intro: "Hello!",
            action: {
                instructions: Message,
                button: {
                    color: '#22BC66',
                    text: 'Register for the new drive',
                    link: 'https://your-website.com/register'
                }
            },
            outro: outro
        }
    }

    let mail = MailGenerator.generate(response);

    let message = {
        from: 'placement2024@gmail.com',
        to: email,
        subject: subject,
        html: mail
    }

    try {
        await transporter.sendMail(message);
        console.log(`Mail sent successfully to ${email}`);
    } catch (error) {
        console.error(`Error sending mail to ${email}: ${error}`);
    }
}


export {generateMail}


// import nodemailer from 'nodemailer';
// import Mailgen from "mailgen";
// import { asyncHandler } from '../utils/asyncHandler.js';




// export const generateMail = asyncHandler( async (Name, Intro, Message, Outro) => {
//     let config = {
//         service: 'gmail',
//         auth: {
//             user: 'placement4645@gmail.com',
//             pass: 'oawywnmrvnbwmyvl',
//         }
//     }

//     const transporter = nodemailer.createTransport(config);

//     let MailGenerator = new Mailgen({
//         theme: "default",
//         product: {
//             name: "Campus Connect",
//             link: "https://mailgen.js/"
//         }
//     })

//     let response = {
//         body: {
//             name: Name,
//             intro: Intro,
//             action: {
//                 instructions: Message,
//                 button: {
//                     color: '#22BC66',
//                     text: 'Register for the new drive',
//                     link: 'https://your-website.com/register'
//                 }
//             },
//             outro: Outro
//         }
//     }

//     let mail = MailGenerator.generate(response);

//     let message = {
//         from: 'placement2024@gmail.com',
//         to: "karthikpola07@gmail.com",
//         subject: "New Drive Notification",
//         html: mail
//     }

//     transporter.sendMail(message)
//         .then(() => {
//             return console.log("Mail sent successfully")
//         })
//         .catch(err => {
//             console.log(err);
//         })
// })


