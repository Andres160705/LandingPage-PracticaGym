import { Component, AfterViewInit } from '@angular/core';


@Component({
  selector: 'app-lpagegym',
  imports: [],
  templateUrl: './lpagegym.component.html',
  styleUrl: './lpagegym.component.css'
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
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal, .reveal-stagger, .bar-divider')
      .forEach((el) => el.classList.contains('in') || observer.observe(el));
  }

  bloquearNumeros(event: Event): void {

    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ]/g, '');

  }

  async enviarFormulario(event: Event): Promise<void> {
    event.preventDefault();

    const btnEnviar = document.getElementById('boton-enviar') as HTMLButtonElement;
    const mensaje = document.getElementById('mensaje') as HTMLElement;
    const formulario = event.target as HTMLFormElement;
    btnEnviar.disabled = true;
    btnEnviar.textContent = 'Enviando...';

    try {
      const datos = {
        nombre: (formulario.querySelector('#name') as HTMLInputElement).value,
        apellido: (formulario.querySelector('#lastname') as HTMLInputElement).value,
        edad: (formulario.querySelector('#edad') as HTMLInputElement).value
      };

      const respuesta = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      });

      const resultado = await respuesta.json();
      if (respuesta.ok) {
        mensaje.textContent = '¡Reserva enviada! Revisa tu correo.';
        mensaje.className = 'mensaje-exito';

        formulario.reset();
      } else {
        mensaje.textContent = 'Error: ' + (resultado.error || 'intenta de nuevo');
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
