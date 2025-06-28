# Sistema de Bonos Corporativos - Método Americano

## 📋 Descripción

Sistema web desarrollado en React con TypeScript para el cálculo y análisis de bonos corporativos utilizando el método americano. La aplicación permite crear, editar y administrar bonos, calculando automáticamente métricas financieras importantes como la duración, convexidad, TCEA y TREA.

## 🎯 Características Principales

### ✅ Funcionalidades Implementadas

- **Autenticación de Usuario**: Sistema de login con usuarios predefinidos
- **Gestión de Bonos**: Crear, editar, eliminar y listar bonos corporativos
- **Método Americano**: Cálculo de flujo de caja con amortización de capital constante
- **Períodos de Gracia**: Soporte para gracia total y parcial
- **Configuración**: Personalización de moneda, tipo de tasa y capitalización
- **Métricas Financieras**: Cálculo automático de:
  - Duración
  - Duración Modificada
  - Convexidad
  - TCEA (Tasa de Coste Efectivo Anual)
  - TREA (Tasa de Rendimiento Efectivo Anual)
  - Precio máximo del mercado

### 🔧 Tecnologías Utilizadas

- **Frontend**: React 19.1.0 con TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Storage**: LocalStorage para persistencia de datos

## 🚀 Instalación y Ejecución

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd finanzas-bono-americano
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

### Comandos Disponibles

```bash
npm run dev      # Ejecutar en modo desarrollo
npm run build    # Construir para producción
npm run preview  # Previsualizar build de producción
npm run lint     # Verificar código con ESLint
```

## 👥 Usuarios de Prueba

El sistema incluye usuarios predefinidos para testing:

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | admin123 | Administrador |
| usuario | usuario123 | Usuario Demo |

## 📊 Funcionalidades Detalladas

### 1. Dashboard Principal
- Resumen de bonos creados
- Estadísticas por moneda
- Tabla de bonos con acciones rápidas
- Creación de nuevos bonos

### 2. Gestión de Bonos
- **Crear Bono**: Formulario completo con validaciones
- **Editar Bono**: Modificar datos existentes
- **Eliminar Bono**: Confirmación antes de eliminar
- **Ver Resultados**: Cálculos financieros detallados

### 3. Cálculo Financiero (Método Americano)
- **Flujo de Caja**: Generación automática de tabla de pagos
- **Amortización**: Capital constante por período
- **Intereses**: Cálculo sobre saldo pendiente
- **Gracia**: Manejo de períodos de gracia total y parcial

### 4. Métricas Calculadas

#### Duración
```
Duración = Σ(t × PV(CFt)) / Precio del Bono
```

#### Duración Modificada
```
Duración Modificada = Duración / (1 + r/n)
```

#### Convexidad
```
Convexidad = Σ(t × (t+1) × PV(CFt)) / (Precio × (1+r)²)
```

#### TCEA (Tasa de Coste Efectivo Anual)
```
TCEA = (Valor Nominal / Precio de Emisión)^(1/años) - 1
```

#### TREA (Tasa de Rendimiento Efectivo Anual)
```
TREA = TIR calculada mediante Newton-Raphson
```

### 5. Configuración del Sistema
- **Moneda por defecto**: PEN, USD, EUR
- **Tipo de tasa**: Efectiva o Nominal
- **Capitalización**: Para tasas nominales
- **Persistencia**: Configuración guardada en LocalStorage

## 📝 Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── Login.tsx       # Pantalla de login
│   ├── Navbar.tsx      # Navegación principal
│   ├── Dashboard.tsx   # Dashboard principal
│   ├── BondForm.tsx    # Formulario de bonos
│   ├── BondResults.tsx # Resultados financieros
│   ├── BondsList.tsx   # Lista de bonos
│   └── Configuration.tsx # Configuración
├── context/            # Contextos de React
│   └── AppContext.tsx  # Estado global
├── types/              # Definiciones TypeScript
│   └── index.ts        # Tipos principales
├── utils/              # Utilidades
│   └── bondCalculations.ts # Cálculos financieros
├── App.tsx             # Componente principal
├── App.css             # Estilos
└── main.tsx            # Punto de entrada
```

## 🔬 Fórmulas Matemáticas Implementadas

### Método Americano
En el método americano, el capital se amortiza en cuotas constantes:

```
Amortización por período = Valor Nominal / Número de períodos
Interés por período = Saldo pendiente × Tasa de interés
Pago total = Amortización + Interés
```

### Conversión de Tasas
```typescript
// Nominal a Efectiva
TEA = (1 + TNA/n)^n - 1

// Efectiva a Nominal
TNA = n × ((1 + TEA)^(1/n) - 1)
```

### Valor Presente
```typescript
VP = Σ(CFt / (1 + r)^t)
```

## 🎨 Diseño y UX

- **Responsive Design**: Adaptable a móviles y tablets
- **Color Scheme**: Paleta profesional azul/gris
- **Iconografía**: Lucide React para consistencia
- **Navegación**: Intuitiva con breadcrumbs
- **Feedback**: Mensajes de confirmación y error
- **Accesibilidad**: Etiquetas y contrastes apropiados

## 🔒 Seguridad

- **Autenticación**: Login requerido para acceso
- **Validación**: Formularios con validación client-side
- **Sanitización**: Prevención de inyección de código
- **Persistencia**: Datos almacenados localmente (no sensibles)

## 🚧 Posibles Mejoras Futuras

1. **Backend Integration**: API REST para persistencia real
2. **Exportación**: PDF/Excel de resultados
3. **Gráficos**: Visualización de flujos de caja
4. **Comparación**: Comparar múltiples bonos
5. **Alertas**: Notificaciones de vencimientos
6. **Auditoría**: Log de cambios y acciones
7. **Roles**: Sistema de permisos más granular
8. **Métodos Adicionales**: Francés y Alemán

## 📄 Licencia

Este proyecto es desarrollado para fines educativos como trabajo final del curso de Finanzas.

## 👨‍💻 Autor

Desarrollado como proyecto académico para el curso de Finanzas - Método Americano de Bonos Corporativos.

---

**Nota**: Este sistema implementa cálculos financieros complejos. Se recomienda validar los resultados con herramientas financieras profesionales antes de usar en decisiones de inversión reales.
