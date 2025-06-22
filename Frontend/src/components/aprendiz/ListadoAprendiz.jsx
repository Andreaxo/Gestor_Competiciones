import { Table, Input, Button, Space, Popconfirm, Modal, message } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import Highlighter from 'react-highlight-words';
import * as XLSX from 'xlsx'; // Importar SheetJS
import '../../styles/Aprendiz/StyleListadoAprendiz.css';

import { CrearAprendiz } from '../../components/aprendiz/CrearAprendiz';
import { ModificarAprendiz } from '../../components/aprendiz/ModificarAprendiz';
import { VerAprendiz } from '../../components/aprendiz/VerAprendiz';
import { url } from "../../config";

export const ListadoAprendiz = () => {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const [selectedAprendiz, setSelectedAprendiz] = useState(null);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
    const [isModalView, setIsModalView] = useState(false);

    // Función para exportar a Excel
    const exportToExcel = () => {
        try {
            if (!dataSource || dataSource.length === 0) {
                message.warning('No hay datos para exportar');
                return;
            }

            // Preparar los datos para el Excel
            const dataToExport = dataSource.map((aprendiz, index) => ({
                'No.': index + 1,
                'ID': aprendiz.id,
                'Nombre': aprendiz.nombre,
                'Apellido': aprendiz.apellido,
                'Habilidad': aprendiz.habilidad,
                'Programa de Formación': aprendiz.programName,
                'Centro de Formación': aprendiz.centro,
                'Email': aprendiz.email || 'N/A',
                'Teléfono': aprendiz.phone || 'N/A',
                'Documento': aprendiz.document || 'N/A',
                'Área': aprendiz.area || 'N/A'
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
                { wch: 30 }, // Programa de Formación
                { wch: 30 }, // Centro de Formación
                { wch: 25 }, // Email
                { wch: 15 }, // Teléfono
                { wch: 15 }, // Documento
                { wch: 20 }  // Área
            ];
            worksheet['!cols'] = columnWidths;

            // Crear el libro de trabajo
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Aspirantes');

            // Generar el nombre del archivo con fecha
            const currentDate = new Date().toISOString().split('T')[0];
            const fileName = `aspirantes_${currentDate}.xlsx`;

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
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el Aprendiz');
            }

            message.success('Aprendiz eliminado exitosamente');
            fetchAprendiz(); // Recargar la lista
        } catch (error) {
            message.error('Error al eliminar el Aprendiz');
            console.error('Error:', error);
        }
    };

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
            width: '20%',
            ...getColumnSearchProps('nombre'),
            sorter: (a, b) => a.nombre.localeCompare(b.nombre),
        },
        {
            title: 'Apellido',
            dataIndex: 'apellido',
            key: 'apellido',
            width: '20%',
            ...getColumnSearchProps('apellido'),
            sorter: (a, b) => a.apellido.localeCompare(b.apellido),
        },
        {
            title: 'Habilidad',
            dataIndex: 'habilidad',
            key: 'habilidad',
            width: '20%',
            ...getColumnSearchProps('habilidad'),
        },
        {
            title: 'Programa de Formación',
            dataIndex: 'programName',
            key: 'programName',
            width: '20%',
            ...getColumnSearchProps('programName'),
            sorter: (a, b) => a.programName.localeCompare(b.programName),
        },
        {
            title: 'Centro de formación',
            dataIndex: 'centro',
            key: 'centro',
            width: '20%',
            ...getColumnSearchProps('centro'),
        },
        {
            title: 'Acciones',
            key: 'actions',
            width: '20%',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => { setSelectedAprendiz(record); setIsModalOpenEdit(true); }} />
                    <Popconfirm
                        title="¿Eliminar este aspirante?"
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
                            setSelectedAprendiz(record);
                            setIsModalView(true);
                        }}
                    />
                </Space>
            ),
        },
    ];

    const fetchAprendiz = async () => {
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
                throw new Error('Error al cargar aprendices');
            }
            const data = await response.json();
            const mainDataArray = data.body;

            if (Array.isArray(mainDataArray)) {
                // Filtrar por rol Aprendiz/aprendiz
                const aprendices = mainDataArray.filter(usuario =>
                    ['Aprendiz', 'aprendiz'].includes(usuario.rol)
                );

                // Filtrar por competencia seleccionada
                const aprendicesFilteredByCompetition = aprendices.filter(usuario => {
                    // Comparar con la competencia del usuario
                    // Puedes usar competitionName directamente o hacer una comparación más flexible
                    return usuario.strategyCompetition === selectedCompetitionName ||
                           usuario.strategyCompetition?.toLowerCase() === selectedCompetitionName.toLowerCase();
                });

                const aprendizInfo = aprendicesFilteredByCompetition.map(usuario => ({
                    ...usuario,
                    key: usuario.id,
                    nombre: usuario.name,
                    apellido: usuario.lastName,
                    area: usuario.area,
                    habilidad: usuario.competitionName,
                    centro: usuario.formationCenter,
                    programName: usuario.programName
                }));

                setDataSource(aprendizInfo);

                // // Mostrar mensaje informativo sobre el filtro aplicado
                // if (aprendizInfo.length === 0) {
                //     message.info(`No se encontraron aspirantes para la competencia: ${selectedCompetitionName}`);
                // } else {
                //     message.success(`Se encontraron ${aprendizInfo.length} aspirante(s) para la competencia: ${selectedCompetitionName}`);
                // }
            } else {
                console.error('La propiedad body no es un array:', data);
            }
        } catch (error) {
            console.error('Error al cargar aprendices', error);
            message.error('Error al cargar la lista de aprendices');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseCrearAprendiz = (data, hasChanges) => {
        setIsModalOpen(false);
        setSelectedAprendiz(null);
        if (hasChanges) {
            fetchAprendiz();
        }
    };

    const handleCloseVerAprendiz = (data, hasChanges) => {
        setIsModalView(false);
        setSelectedAprendiz(null);
        if (hasChanges) {
            fetchAprendiz();
        }
    };

    const handleCloseModificarAprendiz = (data, hasChanges) => {
        setIsModalOpenEdit(false);
        setSelectedAprendiz(null);
        if (hasChanges) {
            fetchAprendiz();
        }
    };

    // Función para refrescar el listado cuando cambie la competencia seleccionada
    const handleRefreshCompetition = () => {
        fetchAprendiz();
    };

    useEffect(() => {
        fetchAprendiz();

        // Escuchar cambios en localStorage (opcional)
        const handleStorageChange = (e) => {
            if (e.key === 'selectedCompetitionName') {
                fetchAprendiz();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Obtener el nombre de la competencia actual para mostrar en la UI
    const currentCompetition = localStorage.getItem('selectedCompetitionName');

    return (
        <div className="competitors-listing-container">
            <div className="competitors-listing-container-box">
                <div className="action-header-aprendiz">
                    <div className="header-content-aprendiz">
                        <div className="titles-aprendiz">
                            <h1 className="main-title-aprendiz">
                                Aspirantes
                                {/* {currentCompetition && (
                                    <span style={{ 
                                        fontSize: '0.7em', 
                                        color: '#666', 
                                        display: 'block',
                                        fontWeight: 'normal'
                                    }}>
                                        Competencia: {currentCompetition}
                                    </span>
                                )} */}
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="action-buttons-aprendiz">
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

            <Table
                dataSource={dataSource}
                columns={columns}
                loading={loading}
                pagination={{
                    pageSize: 10,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} de ${total} Aspirantes`,
                }}
                scroll={{ x: true }}
                style={{
                    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                    margin: '0',
                    borderRadius: '10px',
                }}
                rowClassName="ant-table-row"
            />

            {isModalOpen && <CrearAprendiz onClose={handleCloseCrearAprendiz} />}

            {isModalOpenEdit && (
                <ModificarAprendiz
                    onClose={handleCloseModificarAprendiz}
                    expertData={selectedAprendiz}
                />
            )}

            {isModalView && (
                <VerAprendiz
                    onClose={handleCloseVerAprendiz}
                    expertData={selectedAprendiz}
                />
            )}
        </div>
    );
};