import { Table, Input, Button, Space, Popconfirm, message } from "antd";
import { SearchOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import { FaPerson, FaTrophy } from "react-icons/fa6";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import Highlighter from 'react-highlight-words';
import * as XLSX from 'xlsx'; // Importar SheetJS
import '../../styles/Inscritos/StyleListadoInscritos.css';
import { url } from "../../config";

export const ListadoInscritos = ({ onComponentChange }) => {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [selectedCompetition, setSelectedCompetition] = useState('');

    const searchInput = useRef(null);

    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [apiResponse, setApiResponse] = useState(null);

    // Función para obtener la competición seleccionada del localStorage
    const getSelectedCompetition = () => {
        const competitionName = localStorage.getItem('selectedCompetitionName');
        return competitionName || '';
    };

    // Función para exportar a Excel
    const exportToExcel = () => {
        try {
            if (!dataSource || dataSource.length === 0) {
                message.warning('No hay datos para exportar');
                return;
            }

            // Preparar los datos para el Excel
            const dataToExport = dataSource.map((inscrito, index) => ({
                'No.': index + 1,
                'ID': inscrito.id,
                'Nombre': inscrito.name,
                'Apellido': inscrito.lastname,
                'Habilidad': inscrito.competitionName,
                'Centro de Formación': inscrito.formationCenter,
                'Email': inscrito.email || 'N/A',
                'Teléfono': inscrito.phone || 'N/A',
                'Tipo de Documento': inscrito.documentType || 'N/A',
                'Número de Documento': inscrito.documentNumber || 'N/A',
                'Fecha de Nacimiento': inscrito.birthdate ? new Date(inscrito.birthdate).toLocaleDateString() : 'N/A',
                'Programa de Formación': inscrito.programName || 'N/A',
                'Tipo de Sangre': inscrito.bloodType || 'N/A',
                'Preferencias Dietéticas': inscrito.dietPreferences || 'N/A',
                'Estado de Contratación': inscrito.hiringStatus || 'N/A',
                'Modalidad Etapa Productiva': inscrito.productiveStageModality || 'N/A',
                'Nombre de la Empresa': inscrito.companyName || 'N/A',
                'NIT': inscrito.nit || 'N/A',
                'Jefe Inmediato': inscrito.immediateBossName || 'N/A',
                'Email del Jefe': inscrito.bossEmail || 'N/A',
                'Teléfono del Jefe': inscrito.bossPhone || 'N/A',
                'Competición': inscrito.strategyCompetition || 'N/A'
            }));

            // Crear la hoja de trabajo
            const worksheet = XLSX.utils.json_to_sheet(dataToExport);

            // Configurar el ancho de las columnas
            const columnWidths = [
                { wch: 5 },  // No.
                { wch: 8 },  // ID
                { wch: 20 }, // Nombre
                { wch: 20 }, // Apellido
                { wch: 25 }, // Habilidad
                { wch: 30 }, // Centro de Formación
                { wch: 25 }, // Email
                { wch: 15 }, // Teléfono
                { wch: 15 }, // Tipo de Documento
                { wch: 20 }, // Número de Documento
                { wch: 18 }, // Fecha de Nacimiento
                { wch: 30 }, // Programa de Formación
                { wch: 15 }, // Tipo de Sangre
                { wch: 25 }, // Preferencias Dietéticas
                { wch: 20 }, // Estado de Contratación
                { wch: 25 }, // Modalidad Etapa Productiva
                { wch: 25 }, // Nombre de la Empresa
                { wch: 15 }, // NIT
                { wch: 25 }, // Jefe Inmediato
                { wch: 25 }, // Email del Jefe
                { wch: 18 }, // Teléfono del Jefe
                { wch: 20 }  // Competición
            ];
            worksheet['!cols'] = columnWidths;

            // Crear el libro de trabajo
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Inscritos');

            // Generar el nombre del archivo con fecha y competición
            const currentDate = new Date().toISOString().split('T')[0];
            const competitionSafe = selectedCompetition.replace(/[^a-zA-Z0-9]/g, '_');
            const fileName = `inscritos_${competitionSafe}_${currentDate}.xlsx`;

            // Descargar el archivo
            XLSX.writeFile(workbook, fileName);

            message.success('Excel exportado exitosamente');
        } catch (error) {
            console.error('Error al exportar a Excel:', error);
            message.error('Error al generar el archivo Excel');
        }
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Buscar ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button type="primary" onClick={() => handleSearch(selectedKeys, confirm, dataIndex)} icon={<SearchOutlined />}>
                        Buscar
                    </Button>
                    <Button onClick={() => clearFilters && handleReset(clearFilters)}>Resetear</Button>
                    <Button type="link" onClick={close}>Cerrar</Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
        onFilter: (value, record) => record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
        render: (text) => searchedColumn === dataIndex ? (
            <Highlighter highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }} searchWords={[searchText]} textToHighlight={text ? text.toString() : ''} />
        ) : text,
    });

    // Función para enviar correo al eliminar inscrito
    const sendDeleteEmail = async (inscrito) => {
        try {
            const emailData = {
                email: inscrito.email,
                name: `${inscrito.name} ${inscrito.lastname}`,
                competicion: inscrito.competitionName || "Competición SENA"
            };

            const response = await axios.post(`${url}/api/email/delete`, emailData);
            
            if (response.status === 200 || response.status === 201) {
                message.success('Correo de eliminación enviado exitosamente');
            } else {
                throw new Error('Error al enviar el correo de eliminación');
            }
            
            return true;
        } catch (error) {
            console.error('Error al enviar correo de eliminación:', error);
            message.warning('No se pudo enviar el correo de notificación de eliminación');
            return false;
        }
    };

    const handleDelete = async (id) => {
        try {
            // Luego procedemos con la eliminación
            await axios.delete(`${url}/api/formulario/${id}`);
            fetchInscritos();
        } catch (error) {
            message.error('Error al eliminar el inscrito');
        }
    };

    const handleDeleteWithEmail = async (id) => {
        try {
            // Primero obtenemos los datos del inscrito antes de eliminarlo
            const inscritoToDelete = dataSource.find(item => item.id === id);
            if (inscritoToDelete) {
                // Enviamos el correo de eliminación
                await sendDeleteEmail(inscritoToDelete);
            }
            
            // Luego procedemos con la eliminación
            await axios.delete(`${url}/api/formulario/${id}`);
            message.success('Inscrito eliminado exitosamente');
            fetchInscritos();
        } catch (error) {
            message.error('Error al eliminar el inscrito');
        }
    };

// Función para enviar correo al competidor
const sendCompetitorEmail = async (inscrito) => {
    try {
        
        // Aseguramos que el nombre está en el formato correcto
        const nombreCompleto = `${inscrito.name} ${inscrito.lastname}`.trim();
        
        const emailData = {
            email: inscrito.email,
            name: nombreCompleto,
            competicion: inscrito.strategyCompetition || "Competición SENA"
        };
        
        
        const response = await fetch(`${url}/api/email/competitor`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(emailData)
        });
        
        // Obtener la respuesta completa para debugging
        const responseData = await response.text();
        
        if (response.ok) {
            message.success('Correo enviado exitosamente al competidor');
            return true;
        } else {
            const errorMsg = `Error al enviar el correo: ${response.status} - ${responseData}`;
            console.error(errorMsg);
            throw new Error(errorMsg);
        }
    } catch (error) {
        console.error('Error al enviar correo:', error);
        message.warning('No se pudo enviar el correo de notificación al competidor');
        return false;
    }
};

// Función para enviar correo al aspirante
const sendAspirantEmail = async (inscrito) => {
    try {
        
        // Aseguramos que el nombre está en el formato correcto
        const nombreCompleto = `${inscrito.name} ${inscrito.lastname}`.trim();
        
        const emailData = {
            email: inscrito.email,
            name: nombreCompleto,
            // Es importante notar que esta ruta espera 'rol'
            // según el backend, aunque no es claro si esto es correcto
            rol: "aspirante"
        };
        
        
        const response = await fetch(`${url}/api/email/aspirant`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(emailData)
        });
        
        // Obtener la respuesta completa para debugging
        const responseData = await response.text();
        
        if (response.ok) {
            message.success('Correo enviado exitosamente al aspirante');
            return true;
        } else {
            const errorMsg = `Error al enviar el correo: ${response.status} - ${responseData}`;
            console.error(errorMsg);
            throw new Error(errorMsg);
        }
    } catch (error) {
        console.error('Error al enviar correo al aspirante:', error);
        message.warning('No se pudo enviar el correo de notificación al aspirante');
        return false;
    }
};

    // Función para enviar datos a la API de clientes y cambiar componente
    const handleSendToClientesAndSwitchComponent = async (inscrito, rol) => {
        try {
            setLoading(true);

            const clienteData = {
                id: 0,
                password: "contraseña123",
                name: inscrito.name || "",
                lastName: inscrito.lastname || "",
                documentType: inscrito.documentType || "CC",
                documentNumber: inscrito.documentNumber || "",
                documentDateOfissue: inscrito.documentDateOfissue || "05/05/2024",
                email: inscrito.email || "",
                birthdate: inscrito.birthdate || "2024-02-11",
                phone: inscrito.phone || "",
                area: inscrito.competitionName || "",
                rol: rol,
                senaVinculation: rol === "competidor" ? "Competidor" : "Aprendiz",
                permissions: rol === "competidor" ? "Competidor" : "Aprendiz",
                programName: inscrito.programName || "Análisis y desarrollo de software",
                indexCourse: inscrito.indexCourse || 0,
                formationCenter: inscrito.formationCenter || "",
                bloodType: inscrito.bloodType || "A+",
                dietPreferences: inscrito.dietPreferences || "",
                hiringStatus: inscrito.hiringStatus || "",
                productiveStageModality: inscrito.productiveStageModality || "",
                companyName: inscrito.companyName || "",
                nit: inscrito.nit || 0,
                immediateBossName: inscrito.immediateBossName || "",
                bossEmail: inscrito.bossEmail || "",
                bossPhone: inscrito.bossPhone || 0,
                competitionName: inscrito.competitionName || "",
                strategyCompetition: inscrito.strategyCompetition || ""
            };

            const response = await fetch(`${url}/api/clientes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(clienteData)
            });

            const data = await response.json();
            setApiResponse(data);

            if (response.ok) {
                message.success(`Inscrito enviado exitosamente como ${rol}`);
                
                // Enviar el correo según el rol
                if (clienteData.senaVinculation === "Competidor") {
                    await sendCompetitorEmail(inscrito);
                } else if (clienteData.senaVinculation === "Aprendiz") {
                    await sendAspirantEmail(inscrito);
                }

                // Eliminar el inscrito una vez enviado
                await handleDelete(inscrito.id);

                if (onComponentChange) {
                    onComponentChange(rol, inscrito.id);
                }
            } else {
                throw new Error(`Error del servidor: ${response.status} - ${data?.message || 'Error desconocido'}`);
            }

        } catch (error) {
            let errorMessage = `Error al enviar el inscrito como ${rol}`;
            if (error.response) {
                errorMessage += `: ${error.response.status} - ${error.response.data?.message || 'Error del servidor'}`;
                setApiResponse(error.response.data);
            } else if (error.message) {
                errorMessage += `: ${error.message}`;
            }
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { title: 'Habilidad', dataIndex: 'competitionName', key: 'competitionName', ...getColumnSearchProps('competitionName') },
        { title: 'Nombre', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name), ...getColumnSearchProps('name') },
        { title: 'Apellido', dataIndex: 'lastname', key: 'lastname', sorter: (a, b) => a.lastname.localeCompare(b.lastname), ...getColumnSearchProps('lastname') },
        { title: 'Centro de formación', dataIndex: 'formationCenter', key: 'formationCenter', ...getColumnSearchProps('formationCenter') },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        variant="outlined"
                        color="green"
                        icon={<FaTrophy />}
                        onClick={() => handleSendToClientesAndSwitchComponent(record, "competidor")}
                        title="Enviar como competidor"
                    />
                    <Button
                        variant="outlined"
                        color="gold"
                        icon={<FaPerson />}
                        onClick={() => handleSendToClientesAndSwitchComponent(record, "aprendiz")}
                        title="Enviar como aprendiz"
                    />
                    <Popconfirm
                        title="¿Eliminar este inscrito?"
                        onConfirm={() => handleDeleteWithEmail(record.id)}
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const fetchInscritos = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${url}/api/formulario`);
            
            // Obtener la competición seleccionada
            const competitionFromStorage = getSelectedCompetition();
            setSelectedCompetition(competitionFromStorage);
            
            
            // Verificar si la respuesta tiene una estructura diferente
            const mainDataArray = response.data.body || response.data;
            
            if (Array.isArray(mainDataArray)) {
                
                // FILTRAR SOLO LOS INSCRITOS (rol === "inscritos")
                let inscritosData = mainDataArray.filter(item => 
                    item.rol === "inscritos" || 
                    item.rol === "inscrito" || 
                    (item.rol && item.rol.toLowerCase() === "inscritos") ||
                    (item.rol && item.rol.toLowerCase() === "inscrito")
                );
                
                
                // FILTRAR POR COMPETICIÓN SELECCIONADA
                if (competitionFromStorage) {
                    inscritosData = inscritosData.filter(inscrito => {
                        const competitionMatch = inscrito.strategyCompetition === competitionFromStorage;
                        return competitionMatch;
                    });
                } else {
                    console.warn("No hay competición seleccionada en localStorage");
                    message.warning("No se ha seleccionado ninguna competición");
                }
                
                const inscritosInfo = inscritosData.map(inscrito => ({
                    ...inscrito,
                    key: inscrito.id,
                    competitionName: inscrito.competitionName,
                    lastname: inscrito.lastName,
                }));
                
                setDataSource(inscritosInfo);
                
                // Mostrar mensaje informativo sobre el filtrado
                
                if (inscritosData.length === 0 && competitionFromStorage) {
                    message.info(`No se encontraron inscritos para la competición "${competitionFromStorage}"`);
                }
            } else {
                console.error('Los datos no son un array:', response.data);
                message.error('Formato de datos incorrecto. Consulta la consola para más detalles.');
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                message.error('Error de autenticación. Por favor, inicie sesión nuevamente.');
            } else {
                message.error('Error al cargar la lista de inscritos');
            }
            console.error('Error detallado:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInscritos();
    }, [refreshTrigger]);

    // Escuchar cambios en localStorage
    useEffect(() => {
        const handleStorageChange = () => {
            const newCompetition = getSelectedCompetition();
            if (newCompetition !== selectedCompetition) {
                fetchInscritos();
            }
        };

        // Escuchar eventos de storage para cambios en otras pestañas
        window.addEventListener('storage', handleStorageChange);
        
        // Limpiar el event listener al desmontar el componente
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [selectedCompetition]);

    return (
        <>
        <div className="competitors-listing-container">
            <div className="action-header">
                <div className="header-content-inscritos">
                    <div className="titles-inscritos">
                        <h2 className="main-title">
                             Todos los inscritos
                        </h2>
                        <h3 className="subtitle_text">
                            Listado de inscritos <FaPerson className="icon-title"/>
                        </h3>
                    </div>
                    
                </div>

                <div className="action-buttons-inscritos">
                        <Button 
                            type="primary" 
                            icon={<DownloadOutlined />}
                            onClick={exportToExcel}
                            disabled={dataSource.length === 0}
                            style={{
                                backgroundColor: '#52c41a',
                                borderColor: '#52c41a'
                            }}
                        >
                            Exportar a Excel
                        </Button>
                    </div>
            </div>
            
            <Table 
                dataSource={dataSource} 
                columns={columns} 
                loading={loading}
                pagination={{
                    pageSize: 10,
                    showTotal: (total, range) => 
                        `${range[0]}-${range[1]} de ${total} inscritos`,
                }}
                scroll={{ x: true }}
                style={{ 
                    boxShadow: 'rgba(48, 48, 170, 0.2) 0px 7px 29px 0px',
                    margin: '0',
                    borderRadius: '10px',
                }}
                rowClassName="ant-table-row"
                locale={{
                    emptyText: selectedCompetition 
                        ? `No hay inscritos para la competición "${selectedCompetition}"` 
                        : 'No hay competición seleccionada'
                }}
            />
        </div>
        </>
    );
};