import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-lpagegym',
  imports: [],
  templateUrl: './lpagegym.component.html',
  styleUrl: './lpagegym.component.css',
})
export class LpagegymComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    this.setupReveal();

    // si Angular re-renderiza el HTML (al editar/guardar), re-aplica el efecto
    const mo = new MutationObserver(() => this.setupReveal());
    mo.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('scroll', () => {
      const header = document.getElementById('siteHeader');
      if (header) {
        header.classList.toggle('scrolled', window.scrollY > 40);
      }
    });
  }

  private setupReveal(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    document
      .querySelectorAll('.reveal, .reveal-stagger, .bar-divider')
      .forEach((el) => el.classList.contains('in') || observer.observe(el));
  }

  bloquearNumeros(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ]/g, '');
  }

  abrirMenuDesplegable(): void {
    const navLinks = document.querySelector('.nav-links') as HTMLElement;
    navLinks.classList.toggle('open');
  }

  async enviarFormulario(event: Event): Promise<void> {
    event.preventDefault();

    const btnEnviar = document.getElementById(
      'boton-enviar',
    ) as HTMLButtonElement;
    const mensaje = document.getElementById('mensaje') as HTMLElement;
    const formulario = event.target as HTMLFormElement;
    btnEnviar.disabled = true;
    btnEnviar.textContent = 'Enviando...';

    try {
      const datos = {
        nombre: (formulario.querySelector('#name') as HTMLInputElement).value,
        apellido: (formulario.querySelector('#lastname') as HTMLInputElement) .value,
        edad: (formulario.querySelector('#edad') as HTMLInputElement).value,
        contacto: (formulario.querySelector('#contacto') as HTMLInputElement) .value,
        honeypot: (formulario.querySelector('.honeypot') as HTMLInputElement)  .value,
      };

      const telefono = datos.contacto.trim();
      if (!/^\d{10}$/.test(telefono)) {
        mensaje.textContent = 'El contacto debe contener solo números y menos de 20 caracteres.';
        mensaje.className = 'mensaje-warn';
        return;
      }

      const edad = Number(datos.edad); // convierte el texto a número real
      if (!datos.edad.trim() || edad < 14 || edad > 80) {
        mensaje.textContent = 'La edad debe estar entre 14 y 80 años.';
        mensaje.className = 'mensaje-warn';
        return;
      }

      const respuesta = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
      });

      const resultado = await respuesta.json();
      if (respuesta.ok) {
        mensaje.textContent = '¡Reserva enviada!. Ya comienzas el Cambio.';
        mensaje.className = 'mensaje-exito';

        formulario.reset();
      } else {
        mensaje.textContent =
          'Error: ' + (resultado.error || 'intenta de nuevo');
        mensaje.className = 'mensaje-error';
      }
    } catch {
      mensaje.textContent = 'No se pudo conectar. Intenta de nuevo.';
      mensaje.className = 'mensaje-error';
    } finally {
      btnEnviar.disabled = false;
      btnEnviar.textContent = 'Reserva tu Sesión Gratis →';
    }
  }
}
