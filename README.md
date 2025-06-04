# Gestor de Contenidos y Carpetas

Una aplicación React para organizar contenido educativo en carpetas usando drag & drop, construida con @dnd-kit y CSS vanilla.

## Características

- 📁 **Gestión de Carpetas**: Crear, renombrar y eliminar carpetas
- 🔄 **Drag & Drop**: Mover contenidos entre carpetas arrastrando y soltando
- 📋 **Tabla Interactiva**: Vista de tabla con capacidades de expansión/contracción
- 🎨 **UI Moderna**: Interfaz limpia y responsive con CSS vanilla
- ⚡ **API Simulada**: Sistema de API mock para desarrollo

## Tecnologías Utilizadas

- **React 19** - Framework principal
- **@dnd-kit** - Sistema de drag & drop
- **Lucide React** - Iconos
- **Vite** - Build tool y servidor de desarrollo

## Estructura del Proyecto

```
src/
├── api/                    # API simulada
│   └── mockApi.js
├── components/            # Componentes React
│   ├── ContentTable.jsx  # Componente principal de tabla
│   ├── FolderRow.jsx     # Fila de carpeta
│   ├── ContentRow.jsx    # Fila de contenido
│   ├── Modal.jsx         # Componente base de modal
│   ├── CreateFolderModal.jsx # Modal crear carpeta
│   ├── RenameFolderModal.jsx # Modal renombrar carpeta
│   ├── DeleteFolderModal.jsx # Modal eliminar carpeta
│   ├── Button.jsx        # Componente de botón reutilizable
│   └── Icons.jsx         # Iconos reutilizables
├── hooks/                 # Hooks personalizados
│   └── useTableData.js   # Hook para manejo de datos
├── styles/                # Estilos SCSS
│   ├── utilities.scss    # Clases utilitarias
│   └── index.scss        # Estilos principales
└── utils/                 # Utilidades
    └── classNames.js
```

## Instalación y Ejecución

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   ```

3. **Build para producción**:
   ```bash
   npm run build
   ```

## Uso de la Aplicación

### Crear Carpetas
- Haz clic en el botón "Nueva carpeta"
- Introduce el nombre de la carpeta
- Presiona "Crear" o Enter para confirmar

### Organizar Contenidos
- Arrastra cualquier contenido hacia una carpeta para moverlo
- Arrastra contenido al área inferior para quitarlo de carpetas
- Los contenidos dentro de carpetas se muestran con indentación

### Gestionar Carpetas
- **Expandir/Contraer**: Clic en la flecha junto al nombre
- **Renombrar**: Clic en el icono de editar
- **Eliminar**: Clic en el icono de basura
  - Opción 1: Eliminar carpeta y contenido
  - Opción 2: Solo eliminar carpeta (mueve contenido a sin asignar)

## Estructura de Datos

### Carpeta (Folder)
```javascript
{
  id: string,           // ID único
  name: string,         // Nombre de la carpeta
  contents: Content[]   // Contenidos dentro de la carpeta
}
```

### Contenido (Content)
```javascript
{
  id: string,           // ID único
  title: string,        // Título del contenido
  type: string,         // Tipo (document, video, map, science)
  availability: string, // Disponibilidad (Docente, Estudiantes)
  owner: string,        // Propietario
  date: string,         // Fecha
  folderId: string|null // ID de carpeta contenedora (null si sin asignar)
}
```

## API Simulada

La aplicación incluye una API simulada que simula operaciones del backend:

- `folderApi.createFolder(name)` - Crear carpeta
- `folderApi.renameFolder(id, newName)` - Renombrar carpeta
- `folderApi.deleteFolder(id, deleteContents)` - Eliminar carpeta
- `contentApi.moveContent(contentId, folderId)` - Mover contenido

Todas las operaciones incluyen un retraso simulado de 500ms.

## Personalización

### Estilos
Los estilos están definidos en `src/index.css` usando CSS vanilla con variables CSS para fácil personalización.

### Tipos de Contenido
Agregar nuevos tipos de contenido en:
1. `src/components/Icons.jsx` - Agregar icono
2. `src/api/mockApi.js` - Agregar datos mock

### Funcionalidades Adicionales
El sistema está diseñado para ser extensible:
- Agregar filtros y búsqueda
- Implementar permisos de usuario
- Añadir más operaciones CRUD
- Integrar con backend real

## Desarrollo

### Estructura de Componentes
- **Presentacionales**: Componentes puros que solo renderizan UI
- **Contenedores**: Componentes que manejan lógica y estado
- **Hooks Personalizados**: Lógica reutilizable encapsulada

### Buenas Prácticas Implementadas
- Componentes funcionales con hooks
- Manejo de estado optimizado con useMemo/useCallback
- PropTypes mediante JSDoc
- Accesibilidad (ARIA labels, keyboard navigation)
- Responsive design

## Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo LICENSE para más detalles.
