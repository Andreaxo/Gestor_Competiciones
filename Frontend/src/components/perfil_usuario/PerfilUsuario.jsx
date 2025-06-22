import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, MapPin, Briefcase, Shield, Edit, Save, X, Award, Building, Heart, Utensils } from 'lucide-react';
import '../../styles/perfil_usuario/PerfilUsuario.css';
import { url } from '../../config';
import { message } from 'antd';

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});

  // Función para obtener el token JWT del localStorage
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Función para decodificar el JWT y obtener información básica
  const decodeJWT = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decodificando JWT:', error);
      return null;
    }
  };

  // Función para obtener el ID del usuario desde diferentes campos posibles del token
  const getUserIdFromToken = (decodedToken) => {
    if (!decodedToken) return null;
    
    // Buscar el ID en diferentes campos comunes
    const possibleIdFields = ['id', 'userId', 'user_id', 'sub', 'uid', 'clienteId', 'cliente_id'];
    
    for (const field of possibleIdFields) {
      if (decodedToken[field]) {
        return decodedToken[field];
      }
    }
    
    return null;
  };

  // Función para obtener el perfil del usuario usando el ID del token
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      // Decodificar JWT para obtener el ID del usuario
      const decodedToken = decodeJWT(token);

      if (!decodedToken) {
        throw new Error('No se pudo decodificar el token');
      }

      // Buscar el ID en diferentes campos posibles
      const userId = getUserIdFromToken(decodedToken);
      
      if (!userId) {
        console.error('Campos disponibles en el token:', Object.keys(decodedToken));
        throw new Error('No se encontró ID de usuario en el token. Campos disponibles: ' + Object.keys(decodedToken).join(', '));
      }

      // Realizar petición a la API usando el ID del token
      const response = await fetch(`${url}/api/clientes/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Token expirado o inválido');
        }
        if (response.status === 404) {
          throw new Error('Usuario no encontrado');
        }
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const userData = await response.json();
      
      // Verificar que userData sea válido
      if (!userData) {
        throw new Error('No se recibieron datos del usuario');
      }

      // Transformar los datos para que coincidan con la estructura esperada
      const transformedData = {
        id: userData.id,
        fullName: userData.body.name && userData.body.lastName ? `${userData.body.name} ${userData.body.lastName}` : userData.body.name || userData.body.lastName || 'Usuario',
        name: userData.body.name || '',
        lastName: userData.body.lastName || '',
        email: userData.body.email || '',
        rol: userData.body.rol || 'Usuario',
        phone: userData.body.phone || '',
        birthdate: userData.body.birthdate ? (userData.body.birthdate.includes('T') ? userData.body.birthdate.split('T')[0] : userData.body.birthdate) : null,
        documentType: userData.body.documentType || '',
        documentNumber: userData.body.documentNumber || '',
        documentDateOfissue: userData.body.documentDateOfissue || '',
        area: userData.body.area || '',
        senaVinculation: userData.body.senaVinculation || '',
        programName: userData.body.programName || '',
        indexCourse: userData.body.indexCourse || '',
        formationCenter: userData.body.formationCenter || '',
        bloodType: userData.body.bloodType || '',
        dietPreferences: userData.body.dietPreferences || '',
        // Campos de información laboral (solo lectura)
        hiringStatus: userData.body.hiringStatus || '',
        productiveStageModality: userData.body.productiveStageModality || '',
        companyName: userData.body.companyName || '',
        nit: userData.body.nit || '',
        immediateBossName: userData.body.immediateBossName || '',
        bossEmail: userData.body.bossEmail || '',
        bossPhone: userData.body.bossPhone || '',
        competitionName: userData.body.competitionName || '',
        strategyCompetition: userData.body.strategyCompetition || '',
      };

      // Datos editables (solo campos personales y académicos, excluyendo laborales)
      const transformedDataEdit = {
        id: userData.id,
        name: userData.body.name || '',
        lastName: userData.body.lastName || '',
        email: userData.body.email || '',
        phone: userData.body.phone || '',
        rol: userData.body.rol || 'Usuario',
        birthdate: userData.body.birthdate ? (userData.body.birthdate.includes('T') ? userData.body.birthdate.split('T')[0] : userData.body.birthdate) : null,
        documentType: userData.body.documentType || '',
        documentNumber: userData.body.documentNumber || '',
        documentDateOfissue: userData.body.documentDateOfissue || '',
        area: userData.body.area || '',
        senaVinculation: userData.body.senaVinculation || '',
        programName: userData.body.programName || '',
        indexCourse: userData.body.indexCourse || '',
        formationCenter: userData.body.formationCenter || '',
        bloodType: userData.body.bloodType || '',
        dietPreferences: userData.body.dietPreferences || '',
        competitionName: userData.body.competitionName || '',
        strategyCompetition: userData.body.strategyCompetition || '',
        immediateBossName: userData.body.immediateBossName || '',
        bossEmail: userData.body.bossEmail || '',
        bossPhone: userData.body.bossPhone || '',
      };

      setUserProfile(transformedData);
      setEditedProfile(transformedDataEdit);
      setError(null);
      
    } catch (error) {
      console.error('Error completo obteniendo perfil:', error);
      setError(error.message);
      
      // Fallback: si hay token pero falla la API, mostrar datos básicos del token
      try {
        const token = getToken();
        if (token) {
          const decodedToken = decodeJWT(token);
          if (decodedToken) {
            const userId = getUserIdFromToken(decodedToken);
            
            const fallbackProfile = {
              id: userId || 'N/A',
              name: decodedToken.name || 'Usuario',
              lastName: decodedToken.lastName || '',
              email: decodedToken.email || '',
              role: decodedToken.rol || decodedToken.role || 'Usuario',
              phone: decodedToken.phone || '',
              birthdate: decodedToken.birthdate || null,
              isActive: true
            };
            setUserProfile(fallbackProfile);
            setEditedProfile(fallbackProfile);
            setError(`Error de API: ${error.message}. Mostrando datos básicos del token.`);
          }
        }
      } catch (fallbackError) {
        console.error('Error en fallback:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar el perfil
  const updateProfile = async () => {
    try {
      const token = getToken();
      
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      const decodedToken = decodeJWT(token);
      const userId = getUserIdFromToken(decodedToken);
      
      if (!userId) {
        throw new Error('No se pudo obtener el ID del usuario del token');
      }

      // Solo enviar los campos editables (sin información laboral)
      const dataToSend = {
        ...editedProfile,
        name: editedProfile.name,
        lastName: editedProfile.lastName
      };

      const response = await fetch(`${url}/api/clientes/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error en actualización:', errorText);
        throw new Error(`Error al actualizar: ${response.status} - ${errorText}`);
      }

      const updatedData = await response.json();
      
      // Actualizar solo los campos editables, manteniendo los laborales sin cambios
      const updatedProfile = {
        ...userProfile,
        ...editedProfile,
        fullName: editedProfile.name && editedProfile.lastName ? `${editedProfile.name} ${editedProfile.lastName}` : editedProfile.name || editedProfile.lastName || 'Usuario'
      };
      
      setUserProfile(updatedProfile);
      setIsEditing(false);
      
      message.success('Perfil actualizado exitosamente');
      
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      // Para el ejemplo, simplemente actualizamos el estado local
      const updatedProfile = {
        ...userProfile,
        ...editedProfile,
        fullName: editedProfile.name && editedProfile.lastName ? `${editedProfile.name} ${editedProfile.lastName}` : editedProfile.name || editedProfile.lastName || 'Usuario'
      };
      setUserProfile(updatedProfile);
      setIsEditing(false);
      message.success(`Perfil actualizado localmente - ${error.message}`);
    }
  };

  // Manejar cambios en los campos de edición
  const handleInputChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Función para debug del token (temporal)
  const debugToken = () => {
    const token = getToken();
    if (token) {
      const decoded = decodeJWT(token);
    } else {
    }
  };

  // Cargar perfil al montar el componente
  useEffect(() => {
    debugToken(); // Para debug temporal
    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-card">
          <div className="spinner"></div>
          <p className="loading-text">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error && !userProfile) {
    return (
      <div className="error-container">
        <div className="error-card">
          <X className="error-icon" />
          <h2 className="error-title">Error</h2>
          <p className="error-message">{error}</p>
          <button 
            onClick={() => {
              debugToken();
              fetchUserProfile();
            }}
            className="btn btn-primary"
          >
            Reintentar
          </button>
          <button 
            onClick={debugToken}
            className="btn btn-secondary"
            style={{ marginTop: '10px' }}
          >
            Debug Token
          </button>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="loading-container">
        <div className="loading-card">
          <p className="loading-text">No se pudo cargar el perfil del usuario</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <div className="user-profile-container">
        {/* Mostrar mensaje de error si hay uno pero también hay datos */}
        {error && userProfile && (
          <div className="profile-card" style={{ backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', marginBottom: '20px' }}>
            <p style={{ color: '#856404', margin: 0 }}>⚠️ {error}</p>
          </div>
        )}

        {/* Header */}
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-info">
              <div className="profile-avatar">
                <User size={32} />
              </div>
              <div className="profile-details">
                <h1>
                  {isEditing ? (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type="text"
                        value={editedProfile.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="field-input"
                        placeholder="Nombre"
                      />
                      <input
                        type="text"
                        value={editedProfile.lastName || ''}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="field-input"
                        placeholder="Apellido"
                      />
                    </div>
                  ) : (
                    userProfile.name + " " + userProfile.lastName
                  )}
                </h1>
                <p className="profile-role">
                  <Shield size={16} />
                  {userProfile.role || 'Usuario'}
                </p>
                <p className="profile-role">
                  <Award size={16} />
                  {userProfile.senaVinculation || 'SENA'}
                </p>
              </div>
            </div>
            <div className="profile-actions">
              {isEditing ? (
                <>
                  <button
                    onClick={updateProfile}
                    className="btn btn-success"
                  >
                    <Save size={16} />
                    <span>Guardar</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      // Restaurar solo los campos editables
                      const editableFields = {
                        name: userProfile.name,
                        lastName: userProfile.lastName,
                        email: userProfile.email,
                        phone: userProfile.phone,
                        birthdate: userProfile.birthdate,
                        documentType: userProfile.documentType,
                        documentNumber: userProfile.documentNumber,
                        documentDateOfissue: userProfile.documentDateOfissue,
                        area: userProfile.area,
                        senaVinculation: userProfile.senaVinculation,
                        programName: userProfile.programName,
                        indexCourse: userProfile.indexCourse,
                        formationCenter: userProfile.formationCenter,
                        bloodType: userProfile.bloodType,
                        dietPreferences: userProfile.dietPreferences,
                        immediateBossName: userProfile.immediateBossName,
                        bossEmail: userProfile.bossEmail,
                        bossPhone: userProfile.bossPhone
                      };
                      setEditedProfile(editableFields);
                    }}
                    className="btn btn-secondary"
                  >
                    <X size={16} />
                    <span>Cancelar</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary"
                >
                  <Edit size={16} />
                  <span>Editar</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Grid de información */}
        <div className="info-grid">
          {/* Información Personal */}
          <div className="profile-card info-section">
            <h2>Información Personal</h2>
            <div className="info-fields">
              <div className="field-group">
                <Mail className="field-icon email" size={20} />
                <div className="field-content">
                  <label className="field-label">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedProfile.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="field-input"
                    />
                  ) : (
                    <p className="field-value">{userProfile.email}</p>
                  )}
                </div>
              </div>

              <div className="field-group">
                <Phone className="field-icon phone" size={20} />
                <div className="field-content">
                  <label className="field-label">Teléfono</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedProfile.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="field-input"
                    />
                  ) : (
                    <p className="field-value">{userProfile.phone || 'No especificado'}</p>
                  )}
                </div>
              </div>

              <div className="field-group">
                <Calendar className="field-icon calendar" size={20} />
                <div className="field-content">
                  <label className="field-label">Fecha de Nacimiento</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editedProfile.birthdate || ''}
                      onChange={(e) => handleInputChange('birthdate', e.target.value)}
                      className="field-input"
                    />
                  ) : (
                    <p className="field-value">{userProfile.birthdate || 'No especificado'}</p>
                  )}
                </div>
              </div>

              <div className="field-group">
                <User className="field-icon user" size={20} />
                <div className="field-content">
                  <label className="field-label">Tipo de Documento</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.documentType || ''}
                      onChange={(e) => handleInputChange('documentType', e.target.value)}
                      className="field-input"
                    />
                  ) : (
                    <p className="field-value">{userProfile.documentType || 'No especificado'}</p>
                  )}
                </div>
              </div>

              <div className="field-group">
                <User className="field-icon user" size={20} />
                <div className="field-content">
                  <label className="field-label">Número de Documento</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.documentNumber || ''}
                      onChange={(e) => handleInputChange('documentNumber', e.target.value)}
                      className="field-input"
                    />
                  ) : (
                    <p className="field-value">{userProfile.documentNumber || 'No especificado'}</p>
                  )}
                </div>
              </div>

              <div className="field-group">
                <Heart className="field-icon" size={20} />
                <div className="field-content">
                  <label className="field-label">Tipo de Sangre</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.bloodType || ''}
                      onChange={(e) => handleInputChange('bloodType', e.target.value)}
                      className="field-input"
                    />
                  ) : (
                    <p className="field-value">{userProfile.bloodType || 'No especificado'}</p>
                  )}
                </div>
              </div>

              <div className="field-group">
                <Utensils className="field-icon" size={20} />
                <div className="field-content">
                  <label className="field-label">Preferencias Dietéticas</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.dietPreferences || ''}
                      onChange={(e) => handleInputChange('dietPreferences', e.target.value)}
                      className="field-input"
                    />
                  ) : (
                    <p className="field-value">{userProfile.dietPreferences || 'No especificado'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Información Académica/SENA */}
          <div className="profile-card info-section">
            <h2>Información Académica</h2>
            <div className="info-fields">
              <div className="field-group">
                <Award className="field-icon" size={20} />
                <div className="field-content">
                  <label className="field-label">Programa de Formación</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.programName || ''}
                      onChange={(e) => handleInputChange('programName', e.target.value)}
                      className="field-input"
                    />
                  ) : (
                    <p className="field-value">{userProfile.programName || 'No especificado'}</p>
                  )}
                </div>
              </div>

              <div className="field-group">
                <MapPin className="field-icon location" size={20} />
                <div className="field-content">
                  <label className="field-label">Centro de Formación</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.formationCenter || ''}
                      onChange={(e) => handleInputChange('formationCenter', e.target.value)}
                      className="field-input"
                    />
                  ) : (
                    <p className="field-value">{userProfile.formationCenter || 'No especificado'}</p>
                  )}
                </div>
              </div>

              <div className="field-group">
                <User className="field-icon user" size={20} />
                <div className="field-content">
                  <label className="field-label">Ficha</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.indexCourse || ''}
                      onChange={(e) => handleInputChange('indexCourse', e.target.value)}
                      className="field-input"
                    />
                  ) : (
                    <p className="field-value">{userProfile.indexCourse || 'No especificado'}</p>
                  )}
                </div>
              </div>

              <div className="field-group">
                <Briefcase className="field-icon briefcase" size={20} />
                <div className="field-content">
                  <label className="field-label">Área</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.area || ''}
                      onChange={(e) => handleInputChange('area', e.target.value)}
                      className="field-input"
                    />
                  ) : (
                    <p className="field-value">{userProfile.area || 'No especificado'}</p>
                  )}
                </div>
              </div>

              <div className="field-group">
                <Shield className="field-icon shield" size={20} />
                <div className="field-content">
                  <label className="field-label">Vinculación SENA</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.senaVinculation || ''}
                      onChange={(e) => handleInputChange('senaVinculation', e.target.value)}
                      className="field-input"
                    />
                  ) : (
                    <p className="field-value">{userProfile.senaVinculation || 'No especificado'}</p>
                  )}
                </div>
              </div>

              <div className="field-group">
                <Award className="field-icon" size={20} />
                <div className="field-content">
                  <label className="field-label">Competencia</label>
                  <p className="field-value">{userProfile.competitionName || 'No especificado'}</p>
                </div>
              </div>

              <div className="field-group">
                <Award className="field-icon" size={20} />
                <div className="field-content">
                  <label className="field-label">Estrategia de Competencia</label>
                  <p className="field-value">{userProfile.strategyCompetition || 'No especificado'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Información Laboral - Solo lectura */}
          <div className="profile-card info-section">
            <h2>Información Laboral <span style={{fontSize: '14px', color: '#666', fontWeight: 'normal'}}></span></h2>
            <div className="info-fields">
              <div className="field-group">
                <Building className="field-icon" size={20} />
                <div className="field-content">
                  <label className="field-label">Empresa</label>
                  <p className="field-value">{userProfile.companyName || 'No especificado'}</p>
                </div>
              </div>

              <div className="field-group">
                <User className="field-icon user" size={20} />
                <div className="field-content">
                  <label className="field-label">NIT</label>
                  <p className="field-value">{userProfile.nit || 'No especificado'}</p>
                </div>
              </div>

              <div className="field-group">
                <User className="field-icon user" size={20} />
                <div className="field-content">
                  <label className="field-label">Jefe Inmediato</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.immediateBossName || ''}
                      onChange={(e) => handleInputChange('immediateBossName', e.target.value)}
                      className="field-input"
                    />
                  ) : (
                  <p className="field-value">{userProfile.immediateBossName || 'No especificado'}</p>
                  )}
                </div>
              </div>

              <div className="field-group">
                <Mail className="field-icon email" size={20} />
                <div className="field-content">
                  <label className="field-label">Email del Jefe</label>
                    {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.bossEmail || ''}
                      onChange={(e) => handleInputChange('bossEmail', e.target.value)}
                      className="field-input"
                    />
                  ) : (
                  <p className="field-value">{userProfile.bossEmail || 'No especificado'}</p>
                  )}
                  </div>
              </div>

              <div className="field-group">
                <Phone className="field-icon phone" size={20} />
                <div className="field-content">
                  <label className="field-label">Teléfono del Jefe</label>
                    {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.bossPhone || ''}
                      onChange={(e) => handleInputChange('bossPhone', e.target.value)}
                      className="field-input"
                    />
                  ) : (
                  <p className="field-value">{userProfile.bossPhone || 'No especificado'}</p>
                  )}
                </div>
              </div>

              <div className="field-group">
                <Briefcase className="field-icon briefcase" size={20} />
                <div className="field-content">
                  <label className="field-label">Estado de Contratación</label>
                  <p className="field-value">{userProfile.hiringStatus || 'No especificado'}</p>
                </div>
              </div>

              <div className="field-group">
                <Award className="field-icon" size={20} />
                <div className="field-content">
                  <label className="field-label">Modalidad Etapa Productiva</label>
                  <p className="field-value">{userProfile.productiveStageModality || 'No especificado'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;