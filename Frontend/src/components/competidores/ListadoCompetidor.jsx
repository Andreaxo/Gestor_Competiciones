import { Table, Input, Button, Space, Popconfirm, message } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import { useEffect, useState, useRef } from "react";
import Highlighter from 'react-highlight-words';
import * as XLSX from 'xlsx'; // Importar SheetJS
import '../../styles/Competidores/StyleListadoCompetidor.css';

import { CrearAprendiz } from '../aprendiz/CrearAprendiz';
import { VerCompetidor } from '../competidores/VerCompetidor';
import { ModificarCompetidor } from "./ModificarCompetidor";
import { url } from "../../config";

export const ListadoCompetidor = () => {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const [refreshTrigger, setRefreshTrigger] = useState(0); 
    const [selectedAprendiz, setSelectedAprendiz] = useState(null);

    // Estado para controlar la visualización de los componentes
    const [showCrearAprendiz, setShowCrearAprendiz] = useState(false);
    const [showModificarCompetidor, setShowModificarCompetidor] = useState(false);
    const [showVerCompetidor, setShowVerCompetidor] = useState(false);

    const [selectedCompetitor, setSelectedCompetitor] = useState(null);
    const competidorSectionRef = useRef(null);

    // Función para exportar a Excel
    const exportToExcel = () => {
        try {
            if (!dataSource || dataSource.length === 0) {
                message.warning('No hay datos para exportar');
                return;
            }

            // Preparar los datos para el Excel
            const dataToExport = dataSource.map((competidor, index) => ({
                'No.': index + 1,
                'ID': competidor.id,
                'Nombre': competidor.nombre,
                'Apellido': competidor.apellido,
                'Habilidad': competidor.habilidad,
                'Centro de Formación': competidor.centro,
                'Email': competidor.email || 'N/A',
                'Teléfono': competidor.phone || 'N/A',
                'Documento': competidor.document || 'N/A',
                'Rol': competidor.rol || 'Competidor'
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
                { wch: 15 }, // Documento
                { wch: 12 }  // Rol
            ];
            worksheet['!cols'] = columnWidths;

            // Crear el libro de trabajo
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Competidores');

            // Generar el nombre del archivo con fecha
            const currentDate = new Date().toISOString().split('T')[0];
            const fileName = `competidores_${currentDate}.xlsx`;

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

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${url}/api/clientes/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al eliminar el Competidor');
            }

            message.success('Competidor eliminado exitosamente');
            fetchCompetidor();
        } catch (error) {
            console.error('Error al eliminar:', error);
            message.error(error.message || 'Error al eliminar el Competidor');
        }
    };

    const columns = [
        { title: 'Habilidad', dataIndex: 'habilidad', key: 'habilidad', ...getColumnSearchProps('habilidad') },
        { title: 'Nombre', dataIndex: 'nombre', key: 'nombre', sorter: (a, b) => a.nombre.localeCompare(b.nombre), ...getColumnSearchProps('nombre') },
        { title: 'Apellido', dataIndex: 'apellido', key: 'apellido', sorter: (a, b) => a.apellido.localeCompare(b.apellido), ...getColumnSearchProps('apellido') },
        { title: 'Centro de formación', dataIndex: 'centro', key: 'centro', ...getColumnSearchProps('centro') },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button 
                        icon={<EditOutlined />} 
                        onClick={() => { 
                            setSelectedCompetitor(record); 
                            setShowModificarCompetidor(true); 
                        }} 
                    />
                    <Popconfirm
                        title="¿Eliminar este competidor?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Sí"
                        cancelText="No"
                        okButtonProps={{
                            style: {
                                backgroundColor: 'green',
                                borderColor: 'green',
                                color: 'white'
                            }
                        }}
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                    <Button 
                        icon={<EyeOutlined />} 
                        onClick={() => { 
                            setSelectedCompetitor(record); 
                            setShowVerCompetidor(true); 
                        }} 
                    />
                </Space>
            ),
        },
    ];

    const fetchCompetidor = async () => {
        try {
            setLoading(true);
            
            // Obtener la competencia seleccionada del localStorage
            const selectedCompetitionName = localStorage.getItem('selectedCompetitionName');
            
            if (!selectedCompetitionName) {
                message.warning('No hay una competencia seleccionada');
                setDataSource([]);
                return;
            }

            const response = await fetch(`${url}/api/clientes`);

            if (!response.ok) {
                if (response.status === 401) {
                    message.error('Error de autenticación. Por favor, inicie sesión nuevamente.');
                    return;
                }
                throw new Error('Error al obtener los datos de clientes');
            }

            const responseData = await response.json();
            const mainDataArray = responseData.body;

            if (Array.isArray(mainDataArray)) {
                // Filtrar por rol Competidor/competidor
                const competidores = mainDataArray.filter(usuario =>
                    ['Competidor', 'competidor'].includes(usuario.rol)
                );

                // Filtrar por competencia seleccionada
                const competidoresFilteredByCompetition = competidores.filter(usuario => {
                    return usuario.strategyCompetition === selectedCompetitionName ||
                           usuario.strategyCompetition?.toLowerCase() === selectedCompetitionName.toLowerCase();
                });

                const competidoresInfo = competidoresFilteredByCompetition.map(usuario => ({
                    ...usuario,
                    key: usuario.id,
                    nombre: usuario.name,
                    apellido: usuario.lastName,
                    habilidad: usuario.competitionName,
                    centro: usuario.formationCenter
                }));

                setDataSource(competidoresInfo);
            } else {
                console.error('La propiedad body no es un array:', responseData);
            }

        } catch (error) {
            console.error('Error detallado:', error);
            message.error(error.message || 'Error al cargar la lista de competidores');
        } finally {
            setLoading(false);
        }
    };

    // Función para refrescar el listado cuando cambie la competencia seleccionada
    const handleRefreshCompetition = () => {
        fetchCompetidor();
    };

    useEffect(() => {
        fetchCompetidor();

        // Escuchar cambios en localStorage (opcional)
        const handleStorageChange = (e) => {
            if (e.key === 'selectedCompetitionName') {
                fetchCompetidor();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [refreshTrigger]);

    // Función para manejar el cierre de los componentes
    const handleComponentClose = (updatedData, changed) => {
        // Cerrar todos los componentes
        setShowCrearAprendiz(false);
        setShowModificarCompetidor(false);
        setShowVerCompetidor(false);
        
        // Si hubo cambios, actualizar la lista
        if (changed) {
            setRefreshTrigger(prev => prev + 1);
        }
    };

    // Obtener el nombre de la competencia actual para mostrar en la UI
    const currentCompetition = localStorage.getItem('selectedCompetitionName');

    return (
        <>
            <div className="competitors-listing-container">
                <div className="action-header">
                    <div className="header-content">
                        <div className="titles">
                            <h2 className="main-title">Todos los competidores</h2>
                            <h3 className="subtitle-text">Escoge una habilidad</h3>
                        </div>
                        <div className="action-buttons">
                            <Button
                                onClick={handleRefreshCompetition}
                                style={{ marginRight: '10px', marginBottom: '10px' }}
                                icon={<SearchOutlined />}
                            >
                                Actualizar
                            </Button>
                            <Button 
                                type="primary" 
                                icon={<DownloadOutlined />}
                                onClick={exportToExcel}
                                style={{
                            backgroundColor: '#52c41a',
                            borderColor: '#52c41a'
                                }}
                            >
                                Exportar a Excel
                            </Button>
                        </div>
                    </div>
                </div>
                
                <Table 
                    dataSource={dataSource} 
                    columns={columns} 
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showTotal: (total, range) => 
                            `${range[0]}-${range[1]} de ${total} competidores`,
                    }}
                    scroll={{ x: true }}
                    style={{ 
                        boxShadow: 'rgba(48, 48, 170, 0.2) 0px 7px 29px 0px',
                        margin: '0',
                        borderRadius: '10px',
                    }}
                    rowClassName="ant-table-row"
                />
                
                {/* Renderizado condicional de componentes */}
                {showCrearAprendiz && (
                    <div ref={competidorSectionRef}>
                        <CrearAprendiz onClose={handleComponentClose} />
                    </div>
                )}
                
                {showModificarCompetidor && selectedCompetitor && (
                    <div ref={competidorSectionRef}>
                        <ModificarCompetidor 
                            onClose={handleComponentClose} 
                            expertData={selectedCompetitor} 
                        />
                    </div>
                )}
                
                {showVerCompetidor && selectedCompetitor && (
                    <div ref={competidorSectionRef}>
                        <VerCompetidor 
                            onClose={handleComponentClose} 
                            expertData={selectedCompetitor} 
                        />
                    </div>
                )}
            </div>
        </>
    );
};