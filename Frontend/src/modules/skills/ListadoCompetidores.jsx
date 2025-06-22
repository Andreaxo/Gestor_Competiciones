import { Table, Input, Button, Space, Popconfirm, message } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import Highlighter from 'react-highlight-words';
import '../../styles/Competidores/StyleListadoCompetidor.css';
import { url } from "../../config";


export const ListadoCompetidoresSkills = ({ onClose }) => {
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




    const handleAsign = async ( idCompetidor) => {

        const pos = localStorage.getItem("position");
        const skillId = localStorage.getItem("selectedSkillId");

if(pos ==1){

        try {
          await axios.patch(`${url}/skills/patch1/${skillId}`, { idCompetidor });
          message.success('Primer competidor asignado correctamente');
          window.location.reload();

          fetchCompetidor(); // Función para refrescar los datos, si es necesario
        } catch (error) {
          message.error('Error al asignar el competidor');
        }

    }


else{
    try {
        await axios.patch(`${url}/skills/patch2/${skillId}`, { idCompetidor });
        message.success('Segundo competidor asignado correctamente');
        fetchCompetidor(); // Función para refrescar los datos, si es necesario
      window.location.reload();
    } catch (error) {
        message.error('Error al asignar el competidor');
      }

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
                   
                    <Popconfirm 
                        title="¿Desea asignar el competidor a esta habilidad?" 
                        onConfirm={() => handleAsign(record.id)}
                    >
                        <Button icon={<EditOutlined />} />
                    </Popconfirm>
                    
                </Space>
            ),
        },
    ];


    const fetchCompetidor = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${url}/api/clientes`);
            const mainDataArray = response.data.body;
            
            if (Array.isArray(mainDataArray)) {
                // Filtrar solo los usuarios con rol de Aprendiz
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
                console.error('La propiedad body no es un array:', response.data);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                message.error('Error de autenticación. Por favor, inicie sesión nuevamente.');
            } else {
                message.error('Error al cargar la lista de aprendices');
            }
            console.error('Error detallado:', error);
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

        <a href="" onClick={onClose}>Volver atras</a>

        <div className="competitors-listing-container">
            
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