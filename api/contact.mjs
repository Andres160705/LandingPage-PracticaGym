import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) { //Es la respuesta que se construye
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { nombre, apellido, edad } = req.body; //await req.json(); manda los datos del formulario en JSON al navegador

  if (!nombre || !apellido || !edad) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  const { error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: ['andreshurdato16@gmail.com'],
    subject: 'Nueva reserva de entreno',
    html: `<p>Nombre: ${nombre} ${apellido}</p><p>Edad: ${edad}</p>`
  });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({ ok: true }); // Responde que todo esta bien
}