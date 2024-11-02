# AccessibilityBar - JavaScript

![home-1](https://github.com/user-attachments/assets/11b03eb5-4548-42f6-889d-0c57187cd13e)

## Tecnologías

- HTML
- CSS
- JavaScript
- Vite

## Acerca del proyecto

- Este componente de barra de accesibilidad ha sido diseñado inicialmente para integrarse en los portales web de los municipios de Colombia alojados en SharePoint. Sin embargo, la versión mejorada permite su implementación en cualquier sitio web, potenciando así la accesibilidad y la inclusión digital. Entre sus funcionalidades destacan:

  - **Narrador**: Utiliza la API `SpeechSynthesisUtterance` para leer en voz alta el contenido o texto alternativo al pasar el mouse sobre textos, inputs, labels, imágenes y más, facilitando la navegación a usuarios con discapacidad visual.

  - **Ajuste de tamaño de texto**: Permite a los usuarios aumentar o disminuir el tamaño del texto en el sitio web, adaptándose a sus necesidades visuales.

  - **Modificación del espaciado de texto**: Ofrece la posibilidad de ajustar el espaciado entre letras (letter spacing) para una lectura más cómoda.

  - **Aplicación de filtros**: Incluye opciones para activar filtros como escala de grises o alto contraste, mejorando la visibilidad del contenido.

  - **Fuente para disléxicos**: Implementa una tipografía especial diseñada para facilitar la lectura a personas con dislexia.

  - **Cursor ampliado**: Aumenta el tamaño del cursor, mejorando su visibilidad y uso.

  - **Resaltado de enlaces**: Resalta los enlaces para que sean más fáciles de identificar y navegar.

Este componente ha sido desarrollado con un diseño atractivo y fácil de usar, garantizando una experiencia de usuario mejorada en el sitio web. Al integrar esta barra de accesibilidad, se contribuye a crear un entorno digital más inclusivo para todos los usuarios.

## Cómo utilizarlo

### 1. Clona el repositorio

Primero, clona o descarga el repositorio en tu máquina local:

```bash
$ git clone https://github.com/LuisC73/AccessibilityBar-JS.git
```

### 2. Instala las dependencias

Navega al directorio del proyecto y ejecuta el siguiente comando para instalar todas las dependencias necesarias:

```bash
npm install
```

### 3. Genera la build

Para preparar el componente para su uso, genera la build ejecutando:

```bash
npm run build
```

### 4. Copia los assets a tu proyecto

Copia los archivos generados y cualquier otro asset necesario a tu proyecto.

### 5. Agrega el contenedor en tu HTML

Crea un contenedor en tu archivo HTML donde se renderizará la barra de accesibilidad:

```html
<div id="accessibility-bar"></div>
```

### 6. Importa y configura el componente

Importa el componente en tu archivo JavaScript y configúralo según tus necesidades:

```js
// Importar el componente de la barra de accesibilidad
import { createAccessibilityBar } from 'path/accessibility-bar.js';

// Obtener el contenedor donde se mostrará la barra
const container = document.getElementById('accessibility-bar');

// Configuración del componente
const config = {
  language: 'es', // Cambia el idioma según sea necesario,

  // Opciones de personalización de la barra de accesibilidad.
  // Esta propiedad es opcional. Si no se proporciona, se usarán las opciones predeterminadas.
  options: [
    {
      id: 'narrator',
      label: 'Narrador',
      icon: 'narrator-play'
    },
    ...
  ],
};

// Crear la barra de accesibilidad
createAccessibilityBar(container, config);
```

## Configuración del Componente

El objeto config permite personalizar varios aspectos del componente:

  - `language`: Define el idioma de la barra (por ejemplo, `'es'` para español, `'en'` para inglés).

  - `options`: Es un arreglo que contiene objetos, cada uno representando una opción de accesibilidad que se puede habilitar en la barra. Esta propiedad es opcional, lo que significa que si no se especifica, se utilizarán las opciones predeterminadas definidas en el componente.

Cada objeto dentro de options tiene tres propiedades:

- `id`: Un identificador único para la opción, utilizado para referencia interna.

- `label`: El texto que se mostrará en la interfaz para describir la opción al usuario.

- `icon`: El nombre del icono que se usará para representar visualmente la opción.

## Opciones Predeterminadas

Si no se proporciona una lista personalizada de options, el componente utilizará una serie de opciones predeterminadas que incluyen funciones esenciales de accesibilidad como aumentar y disminuir el tamaño del texto, activar el alto contraste y más. Estas opciones están diseñadas para cubrir las necesidades de la mayoría de los usuarios, proporcionando una mejor experiencia de navegación para personas con diferentes tipos de discapacidades.

Puedes personalizar el arreglo options según lo que mejor se adapte a tu audiencia y las características específicas que desees ofrecer en tu aplicación.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas mejorar este componente, por favor abre un issue o un pull request en el repositorio.

## Licencia

Este proyecto está bajo la Licencia MIT. [Ver el archivo LICENSE](./LICENSE) para más detalles.

## Autor

- Luis Miguel Castro Curequia
