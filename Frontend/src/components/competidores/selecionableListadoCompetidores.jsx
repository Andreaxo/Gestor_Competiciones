import { Table, Input, Button, Space, Popconfirm, message } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import Highlighter from 'react-highlight-words';
import '../../styles/Competidores/StyleListadoCompetidor.css';

import { CrearAprendiz } from '../aprendiz/CrearAprendiz';
import { VerCompetidor } from '../competidores/VerCompetidor';
import { ModificarCompetidor } from "./ModificarCompetidor";
import { url } from "../../config";

export const SeleccionableListadoCompetidor = ({onClose}) => {
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
    fetchCompetidor();
  } catch (error) {
    message.error(error.message || 'Error al eliminar el Aprendiz');
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

    const response = await fetch(`${url}/api/clientes`);
    if (!response.ok) {
      if (response.status === 401) {
        message.error('Error de autenticación. Por favor, inicie sesión nuevamente.');
      } else {
        message.error('Error al cargar la lista de aprendices');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const mainDataArray = data.body;

    if (Array.isArray(mainDataArray)) {
      // Filtrar solo los usuarios con rol de Competidor
      const competidores = mainDataArray.filter(usuario => 
        ['Competidor', 'competidor'].includes(usuario.rol)
      );

      const competidoresInfo = competidores.map(usuario => ({
        ...usuario,
        key: usuario.id,
        nombre: usuario.name,
        apellido: usuario.lastName,
        habilidad: usuario.competitionName,
        centro: usuario.formationCenter
      }));

      setDataSource(competidoresInfo);
    } else {
      console.error('La propiedad body no es un array:', data);
    }

  } catch (error) {
    console.error('Error detallado:', error);
    if (!error.message.includes('401')) {
      message.error('Error al cargar la lista de aprendices');
    }
  } finally {
    setLoading(false);
  }
};


    useEffect(() => {
        fetchCompetidor();
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

    return (
        <>
        <div className="competitors-listing-container">
            <div className="action-header">
                
                <h2 className="main-title">Todos los competidores</h2>
                <h3 className="subtitle-text">Escoge una habilidad</h3>
                <a href="" onClick={onClose}>Volver atras</a>
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