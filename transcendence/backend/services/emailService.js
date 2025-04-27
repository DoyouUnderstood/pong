import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const temp2FACodes = new Map();

export async function sendEmail(destinataire, code)
{

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_ADRESS,
            pass: process.env.EMAIL_PASSWORD,
        },
    });


    const mailOptions = {
        from: process.env.EMAIL_ADRESS,
        to: destinataire,
        subject: code,
        text: 'Cet email est envoye depuis node.js avec nodemailer, pour le 2fa du pong!'
    };

    console.log("email de l'envoyeur, email du destinataire", process.env.EMAIL_ADRESS, destinataire);
    transporter.sendMail(mailOptions, function(error, info) {
        if (error)
            console.log("erreur lors de l'envoi.", error);
        else
            console.log("l'envoi c'est bien passer.", info);
    })
}

export function generateCode()
{
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return code;
}

export async function saveCode(user, code)
{
    temp2FACodes.set(user.id, { code, expireAt: Date.now() + 5 * 60 * 1000 });
}

export async function verifyCode(userId, code) {
    const entry = temp2FACodes.get(userId);
    if (!entry) 
        throw new Error("Pas de code généré pour cet utilisateur.");
    if (entry.expireAt < Date.now()) 
        throw new Error("Code expiré.");
    if (entry.code !== code) 
        throw new Error("Code incorrect.");

    temp2FACodes.delete(userId);
}

