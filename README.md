# PWA-SPA

Este proyecto es el proyecto final de la asignatura *Tecnologies i Eines pel Desenvolupament Web* (*Tecnologías y Herramientas para el Desarrollo Web*) del máster en Aplicaciones Multimedia que estoy cursando en la UOC. Tuvimos que hacer una **PWA (Progressive Web Application)**, es decir una aplicación web de navegador (web app) que utiliza las últimas tecnologías disponibles en los navegadores para ofrecer una experiencia en móviles lo más parecida a la de una aplicación nativa. Para ello y seguiendo la tendencia del **responsive web design**, tuvimos que maquetar una página que se adapta de manera correcta a dispositivos diversos (ordinadores de escritorio, tabletas y smartphones). 

Hay un formulario de inicio de sesión. No es funcional, solo comprueba si el usuario ha introducido todos los datos. 

Contiene dos **formularios de búsqueda**: 
  - de vuelos: no hace una búsqueda real, sino comprueba si el usuario ha introducido todos los datos requeridos
  - de hoteles: 
    - hace una búsqueda real (la ciudad siempre será Barcelona, aunque el usuario introduzca otra ciudad) de hoteles en Barcelona mediante una **API** que tuvimos que conectar con el proyecto
    - verifica si las fechas introducidas son correctas

La búsqueda de hoteles da un listado de 25 hoteles (los 25 hoteles más populares según los criterios de búsqueda). Cada resultado es clicable y abre una página con detalles del hotel:
  - Título y dirección
  - Estrellas
  - Opiniones y rating
  - Fotos del hotel y las instalaciones / habitaciones
  - Detalles del hotel y las instalaciones

Además, la aplicación programada es una **SPA (single page app)** que elaboré mediante **jQuery** y **JS**.


