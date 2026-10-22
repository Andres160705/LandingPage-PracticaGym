import { Component, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-lpagegym',
  imports: [],
  templateUrl: './lpagegym.component.html',
  styleUrl: './lpagegym.component.css',
})
export class LpagegymComponent implements AfterViewInit, OnDestroy {
  menuAbierto = false;

  private revealObserver?: IntersectionObserver;

  private readonly handleScroll = (): void => {
    const header = document.getElementById('siteHeader');
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 24);
    }
  };

  private readonly handleKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this.menuAbierto) {
      this.cerrarMenu();
    }
  };

  private readonly handleResize = (): void => {
    if (window.innerWidth > 960 && this.menuAbierto) {
      this.cerrarMenu();
    }
  };

  ngAfterViewInit(): void {
    this.setupReveal();
    this.handleScroll();

    window.addEventListener('scroll', this.handleScroll, { passive: true });
    window.addEventListener('keydown', this.handleKeydown);
    window.addEventListener('resize', this.handleResize);
  }

  ngOnDestroy(): void {
    this.revealObserver?.disconnect();
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('keydown', this.handleKeydown);
    window.removeEventListener('resize', this.handleResize);
  }

  private setupReveal(): void {
    this.revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            this.revealObserver?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    document
      .querySelectorAll('.reveal, .plate-rack')
      .forEach((el) => el.classList.contains('in') || this.revealObserver?.observe(el));
  }

  bloquearNumeros(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^A-Za-zÁÉÍÓÚÜáéíóúüÑñ' -]/g, '');
  }

  abrirMenuDesplegable(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
  }

  async enviarFormulario(event: Event): Promise<void> {
    event.preventDefault();

    const btnEnviar = document.getElementById('boton-enviar') as HTMLButtonElement | null;
    const mensaje = document.getElementById('mensaje') as HTMLElement | null;
    const formulario = event.target as HTMLFormElement;

    if (!btnEnviar || !mensaje) {
      return;
    }

    const textoOriginal = btnEnviar.textContent?.trim() || 'Reservar sesión gratis';
    btnEnviar.disabled = true;
    btnEnviar.textContent = 'Enviando...';
    mensaje.textContent = '';
    mensaje.className = '';

    try {
      const valor = (selector: string): string =>
        (formulario.querySelector(selector) as HTMLInputElement | null)?.value.trim() ?? '';

      const datos = {
        nombre: valor('#name'),
        apellido: valor('#lastname'),
        edad: valor('#edad'),
        contacto: valor('#contacto'),
        honeypot: valor('.honeypot'),
      };

      const telefono = datos.contacto.replace(/\D/g, '');
      if (!/^\d{10}$/.test(telefono)) {
        mensaje.textContent = 'Ingresa un número de contacto de 10 dígitos.';
        mensaje.className = 'mensaje-warn';
        return;
      }

      const edad = Number(datos.edad);
      if (!datos.edad || edad < 14 || edad > 80) {
        mensaje.textContent = 'La edad debe estar entre 14 y 80 años.';
        mensaje.className = 'mensaje-warn';
        return;
      }

      const respuesta = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...datos, contacto: telefono }),
      });

      const resultado = await respuesta.json();
      if (respuesta.ok) {
        mensaje.textContent = 'Reserva enviada. Te contactamos para confirmar tu sesión.';
        mensaje.className = 'mensaje-exito';
        formulario.reset();
      } else {
        mensaje.textContent = 'No pudimos enviar la reserva. ' + (resultado.error || 'Intenta de nuevo.');
        mensaje.className = 'mensaje-error';
      }
    } catch {
      mensaje.textContent = 'No pudimos conectar. Revisa tu conexión e intenta de nuevo.';
      mensaje.className = 'mensaje-error';
    } finally {
      btnEnviar.disabled = false;
      btnEnviar.textContent = textoOriginal;
    }
  }
}
