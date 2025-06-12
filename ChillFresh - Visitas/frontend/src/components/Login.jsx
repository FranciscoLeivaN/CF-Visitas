import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';

/**
 * Componente Login - Página de inicio de sesión
 * 
 * Proporciona un formulario para que los usuarios inicien sesión con
 * correo electrónico y contraseña. Incluye validaciones para ambos campos.
 * 
 * @returns {JSX.Element} Componente de formulario de inicio de sesión
 */
function Login() {
  // Estados para los campos del formulario y sus errores
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  /**
   * Valida el formato del correo electrónico
   * @param {string} email - Correo a validar
   * @returns {boolean} Resultado de la validación
   */
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('El correo es requerido');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Formato de correo inválido');
      return false;
    }
    setEmailError('');
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
  };

  /**
   * Maneja el envío del formulario
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (isEmailValid && isPasswordValid) {
      try {
        // Llamamos a la función de login de la API
        await login(email, password);
        
        // Guardamos datos del usuario en localStorage para simular una sesión
        localStorage.setItem('userEmail', email);
        localStorage.setItem('isLoggedIn', 'true');
        
        // Redirigimos al Home
        navigate('/home');
      } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        // En producción, aquí mostraríamos un mensaje de error al usuario
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
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black">
              Correo Electrónico
            </label>
            <input 
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => validateEmail(email)}
              className={`mt-1 block w-full px-3 py-2 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-lightgreen focus:border-lightgreen`}
            />
            {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-black">
              Contraseña
            </label>
            <input 
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => validatePassword(password)}
              className={`mt-1 block w-full px-3 py-2 border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-lightgreen focus:border-lightgreen`}
            />
            {passwordError && <p className="mt-1 text-sm text-red-600">{passwordError}</p>}
          </div>
          
          <div className="pt-2">
            <button 
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-lightgreen hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lightgreen transition-colors"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
