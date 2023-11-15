import 'dotenv/config';
import nodemailer from 'nodemailer';
import { _dirname } from '../path.js';

let transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com', // host para gmail;
	port: 465, // puerto gmail
	secure: true,
	auth: {
		user: 'castalepra6@gmail.com',
		pass: process.env.PASSWORD_EMAIL,
		authMethod: 'LOGIN',
	},
});

const sendEmail = async (req, res) => {
	const resultado = await transporter.sendMail({
		from: 'TESTING castalepra6@gmail.com',
		to: 'castalepra6@gmail.com',
		subject: 'Mail de prueba',
		html: `
      <div>
        <h1>Testing</h1>
      </div>
    `,
		attachments: [
			{
				filename: 'jack.jpg',
				path: _dirname + '/images/jack.jpg',
				cid: 'jack.jpg',
			},
		],
	});
	res.send({ message: `Mail enviado`, response: resultado });
};

const mailingController = { sendEmail };

export default mailingController;