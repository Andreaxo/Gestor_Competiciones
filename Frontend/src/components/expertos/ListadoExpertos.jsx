import { Table, Input, Button, Space, Popconfirm, Modal, message } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import Highlighter from 'react-highlight-words';
import * as XLSX from 'xlsx'; // Importar SheetJS
import '../../styles/Expertos/StyleListadoExperto.css';

import { CrearExperto } from '../../components/expertos/CrearExperto';
import { ModificarExperto } from '../../components/expertos/ModificarExperto';
import { VerExperto } from '../../components/expertos/VerExperto';
import React from "react";
import { url } from "../../config";

export const ListadoExpertos = () => {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [selectedCompetition, setSelectedCompetition] = useState('');

    const [selectedExpert, setSelectedExpert] = useState(null);

    // Modales
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
    const [isModalView, setIsModalView] = useState(false);

    // Obtener la competencia seleccionada del localStorage
    useEffect(() => {
        const competitionName = localStorage.getItem('selectedCompetitionName');
        if (competitionName) {
            setSelectedCompetition(competitionName);
        } else {
            message.warning('No se ha seleccionado ninguna competencia');
        }
    }, []);

    // Función para exportar a Excel
    const exportToExcel = () => {
        try {
            if (!dataSource || dataSource.length === 0) {
                message.warning('No hay datos para exportar');
                return;
            }

            // Preparar los datos para el Excel
            const dataToExport = dataSource.map((experto, index) => ({
                'No.': index + 1,
                'ID': experto.id,
                'Nombre': experto.nombre,
                'Apellido': experto.apellido,
                'Área': experto.area,
                'Habilidad': experto.habilidad,
                'Centro de Formación': experto.centro,
                'Email': experto.email || 'N/A',
                'Teléfono': experto.phone || 'N/A',
                'Tipo de Documento': experto.documentType || 'N/A',
                'Número de Documento': experto.documentNumber || 'N/A',
                'Fecha de Nacimiento': experto.birthdate ? new Date(experto.birthdate).toLocaleDateString() : 'N/A',
                'Vinculación SENA': experto.senaVinculation || 'N/A',
                'Permisos': experto.permissions || 'N/A',
                'Programa de Formación': experto.programName || 'N/A',
                'Tipo de Sangre': experto.bloodType || 'N/A',
                'Preferencias Dietéticas': experto.dietPreferences || 'N/A'
            }));

            // Crear la hoja de trabajo
            const worksheet = XLSX.utils.json_to_sheet(dataToExport);

            // Configurar el ancho de las columnas
            const columnWidths = [
                { wch: 5 },  // No.
                { wch: 8 },  // ID
                { wch: 20 }, // Nombre
                { wch: 20 }, // Apellido
                { wch: 15 }, // Área
                { wch: 25 }, // Habilidad
                { wch: 30 }, // Centro de Formación
                { wch: 25 }, // Email
                { wch: 15 }, // Teléfono
                { wch: 15 }, // Tipo de Documento
                { wch: 20 }, // Número de Documento
                { wch: 18 }, // Fecha de Nacimiento
                { wch: 20 }, // Vinculación SENA
                { wch: 15 }, // Permisos
                { wch: 30 }, // Programa de Formación
                { wch: 15 }, // Tipo de Sangre
                { wch: 25 }  // Preferencias Dietéticas
            ];
            worksheet['!cols'] = columnWidths;

            // Crear el libro de trabajo
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Expertos');

            // Generar el nombre del archivo con fecha y competencia
            const currentDate = new Date().toISOString().split('T')[0];
            const fileName = `aspirantes_${selectedCompetition.replace(/\s+/g, '_')}_${currentDate}.xlsx`;

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
            await axios.delete(`${url}/api/clientes/${id}`);
            message.success('Usuario eliminado exitosamente');
            fetchExpertos(); // Recargar la lista
        } catch (error) {
            message.error('Error al eliminar el usuario');
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
            title: 'Área',
            dataIndex: 'area',
            key: 'area',
            width: '10%',
            ...getColumnSearchProps('area'),
            sorter: (a, b) => a.area.localeCompare(b.area),
        },
        {
            title: 'Habilidad',
            dataIndex: 'habilidad',
            key: 'habilidad',
            width: '20%',
            ...getColumnSearchProps('habilidad'),
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
                    <Button icon={<EditOutlined />} onClick={() => { setSelectedExpert(record); setIsModalOpenEdit(true); }} />
                    <Popconfirm
                        title="¿Eliminar este usuario?"
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
                            setSelectedExpert(record);
                            setIsModalView(true);
                        }}
                    />
                </Space>
            ),
        },
    ];

    const fetchExpertos = async () => {
        try {
            setLoading(true);
            
            // Verificar que tengamos una competencia seleccionada
            const competitionName = localStorage.getItem('selectedCompetitionName');
            if (!competitionName) {
                message.error('No se ha seleccionado ninguna competencia');
                setLoading(false);
                return;
            }

            const response = await axios.get(`${url}/api/clientes`);


            // The first array in body contains the main data
            const mainDataArray = response.data.body;

        if (Array.isArray(mainDataArray)) {
            // Filtrar usuarios que tengan rol "experto" Y la competencia seleccionada
            const usuariosFiltrados = mainDataArray.filter((usuario) => {
   
                // Verificar que sea experto Y que tenga la competencia seleccionada
                const tieneCompetencia = (
                    usuario.strategyCompetition?.toLowerCase() === competitionName?.toLowerCase()
                );
                const tieneRol = (
                    usuario.rol?.toLowerCase() === 'experto' || 
                    usuario.role?.toLowerCase() === 'experto'
                );
                
                return tieneRol && tieneCompetencia;
            });


                const expertoInfo = usuariosFiltrados.map((usuario) => ({
                    ...usuario,
                    key: usuario.id, // Use id as key
                    nombre: usuario.name,
                    apellido: usuario.lastName,
                    area: usuario.area,
                    habilidad: usuario.competitionName,
                    centro: usuario.formationCenter
                }));
                
                setDataSource(expertoInfo);

                // if (expertoInfo.length === 0) {
                //     message.info(`No se encontraron aspirantes para la competencia: ${competitionName}`);
                // }
            } else {
                console.error('No se encontró un array válido:', response.data);
                message.error('Error al cargar los datos de usuarios');
            }
        } catch (error) {
            console.error('Error al cargar usuarios', error);
            message.error('No se pudieron cargar los usuarios');
        } finally {
            setLoading(false);
        }
    };

    // Corregimos los manejadores para cerrar los modales correctamente
    const handleCloseCrearExperto = (data, hasChanges) => {
        setIsModalOpen(false);
        if (hasChanges) {
            fetchExpertos();
        }
    };

    const handleCloseVerExperto = (data, hasChanges) => {
        setIsModalView(false);
        setSelectedExpert(null);
        if (hasChanges) {
            fetchExpertos();
        }
    };

    const handleCloseModificarExperto = (data, hasChanges) => {
        setIsModalOpenEdit(false); // Corregido - estaba cerrando el modal de vista en lugar del de edición
        setSelectedExpert(null);
        if (hasChanges) {
            fetchExpertos();
        }
    };

    useEffect(() => {
        if (selectedCompetition) {
            fetchExpertos();
        }
    }, [selectedCompetition]);

    return (
        <div className="listado-expertos-container">
            <div className="header-actions" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
            }}>
                <div className="titulo_expertos">
                    <h2>Expertos </h2>
                </div>

                <div className="action-buttons-expertos" style={{ display: 'flex', gap: '10px' }}>
                    <Button 
                        className="crearExperto"
                        type="primary" 
                        icon={<DownloadOutlined />}
                        onClick={exportToExcel}
                        disabled={dataSource.length === 0}
                    >
                        Exportar a Excel
                    </Button>
                    <Button
                        className="crearExperto"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Crear Experto
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
                        `${range[0]}-${range[1]} de ${total} aspirantes`,
                }}
                scroll={{ x: true }}
                style={{
                    boxShadow: 'rgba(48, 48, 170, 0.2) 0px 7px 29px 0px',
                    margin: '0',
                    borderRadius: '10px',
                }}
                rowClassName="ant-table-row"
            />

            {isModalOpen && <CrearExperto onClose={handleCloseCrearExperto} selectedCompetition={selectedCompetition} />}

            {isModalOpenEdit && (
                <ModificarExperto
                    onClose={handleCloseModificarExperto}
                    expertData={selectedExpert}
                />
            )}

            {isModalView && (
                <VerExperto
                    onClose={handleCloseVerExperto}
                    expertData={selectedExpert}
                />
            )}
        </div>
    );
};