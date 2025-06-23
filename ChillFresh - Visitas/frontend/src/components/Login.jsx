import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login as apiLogin } from '../api';
import { useAuth } from '../utils/useAuth';

/**
 * Componente Login - Página de inicio de sesión
 * 
 * Proporciona un formulario para que los usuarios inicien sesión con
 * su ID de usuario y contraseña. Incluye validaciones para ambos campos.
 * 
 * @returns {JSX.Element} Componente de formulario de inicio de sesión
 */
function Login() {  // Estados para los campos del formulario y sus errores
  const [usuarioId, setUsuarioId] = useState('');
  const [password, setPassword] = useState('');
  const [usuarioIdError, setUsuarioIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // Obtener la ruta a la que el usuario intentó acceder antes de ser redirigido al login
  const from = location.state?.from || '/home';

  /**
   * Valida el ID de usuario
   * @param {string} id - ID de usuario a validar
   * @returns {boolean} Resultado de la validación
   */
  const validateUsuarioId = (id) => {
    if (!id) {
      setUsuarioIdError('El ID de usuario es requerido');
      return false;
    }
    setUsuarioIdError('');
    return true;
  };

  /**
   * Valida la contraseña
   * @param {string} password - Contraseña a validar
   * @returns {boolean} Resultado de la validación
   */
  const validatePassword = (password) => {
    if (!password) {
      setPasswordError('La contraseña es requerida');
      return false;
    } else if (password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    setPasswordError('');
    return true;
  };  /**
   * Maneja el envío del formulario
   * @param {Event} e - Evento del formulario
   */  const handleSubmit = async (e) => {
    e.preventDefault();
    const isUsuarioIdValid = validateUsuarioId(usuarioId);
    const isPasswordValid = validatePassword(password);

    if (isUsuarioIdValid && isPasswordValid) {
      setIsLoading(true);
      try {
        // Llamamos a la función de login de la API con el usuario_id
        const response = await apiLogin(usuarioId, password);
        
        if (response.success) {
          // El token ya se guardó en localStorage en la función apiLogin()
          
          // Decodificar el token para obtener datos del usuario
          const user = {
            id: response.user.usuario_id,
            name: response.user.nombreCompleto,
            email: response.user.email || response.user.usuario_id
          };
            // Actualizar el contexto de autenticación
          login(user);
          
          // Redirigir a la página que el usuario intentaba visitar o al home
          navigate(from);
        } else {
          setPasswordError('Credenciales inválidas');
        }
      } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        // Verificamos si es un error de credenciales
        if (error.message === 'Credenciales inválidas') {
          setPasswordError('Usuario o contraseña incorrectos');
        } else {
          setPasswordError('Error al conectar con el servidor. Intente nuevamente.');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-white full-page">
      <div className="w-full max-w-md p-6 sm:p-8 m-4 space-y-6 sm:space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-black">ChillFresh</h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">Ingresa a tu cuenta</p>
        </div>
        
        <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div>            <label htmlFor="usuarioId" className="block text-sm font-medium text-black">
              Correo Electrónico 
            </label>
            <input 
              id="usuarioId"
              name="usuarioId"
              type="text"
              autoComplete="username"
              required
              value={usuarioId}
              onChange={(e) => setUsuarioId(e.target.value)}
              onBlur={() => validateUsuarioId(usuarioId)}
              className={`mt-1 block w-full px-3 py-2 border ${usuarioIdError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-lightgreen focus:border-lightgreen`}
            />
            {usuarioIdError && <p className="mt-1 text-sm text-red-600">{usuarioIdError}</p>}
          </div>
            <div>
            <label htmlFor="password" className="block text-sm font-medium text-black">
              Contraseña
            </label>
            <div className="relative mt-1">
              <input 
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => validatePassword(password)}
                className={`block w-full px-3 py-2 border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-lightgreen focus:border-lightgreen`}
              />
              <button 
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7A9.97 9.97 0 014.02 8.971m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {passwordError && <p className="mt-1 text-sm text-red-600">{passwordError}</p>}
          </div>
            <div className="pt-2">
            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-lightgreen hover:bg-green-500'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lightgreen transition-colors`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
