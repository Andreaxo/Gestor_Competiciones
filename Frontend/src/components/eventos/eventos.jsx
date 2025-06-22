import React, { useState, useEffect, useRef } from 'react';
import { Modal, List, Empty, Dropdown, message, Badge, Calendar, Divider } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import '../../styles/Eventos/StyleEvento.css';
import { CrearEvento } from './crearEvento';
import { ModificarEvento } from './ModificarEvento';
import dayjs from 'dayjs';
import { url } from '../../config';

export const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [isModalView, setIsModalView] = useState(false);
  const [isEventosDiaModalVisible, setIsEventosDiaModalVisible] = useState(false);
  const [isModificarEventoVisible, setIsModificarEventoVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvento, setSelectedEvento] = useState(null);
  const [disableSelect, setDisableSelect] = useState(false);

  const containerRef = useRef(null);

  const fetchEventos = async () => {
    try {
      const response = await fetch(`${url}/api/eventos`);
      if (!response.ok) throw new Error('Error al obtener los eventos');
      const data = await response.json();
      const eventosData = data.body[0] || [];
      setEventos(eventosData);
    } catch (error) {
      console.error('Error fetching eventos:', error);
      setEventos([]);
    }
  };

  useEffect(() => {
    fetchEventos();
    const handleGlobalClick = (e) => {
      const isSelectorClick = e.target.closest('.ant-picker-calendar-header-view');
      if (isSelectorClick) {
        setDisableSelect(true);
        setTimeout(() => {
          setDisableSelect(false);
        }, 300);
      }
    };
    document.addEventListener('click', handleGlobalClick, true);
    return () => {
      document.removeEventListener('click', handleGlobalClick, true);
    };
  }, []);

  const getListData = (value) => {
    if (!value || !value.format) return [];
    const formattedDate = value.format('YYYY-MM-DD');
    if (!eventos || !Array.isArray(eventos)) return [];
    return eventos
      .filter(evento => {
        if (!evento.dateEvent) return false;
        const eventoDate = dayjs(evento.dateEvent).format('YYYY-MM-DD');
        return eventoDate === formattedDate;
      })
      .sort((a, b) => dayjs(a.timeEvent).unix() - dayjs(b.timeEvent).unix()) // Ordenar por hora
      .map(evento => ({
        ...evento,
        type: 'success',
        content: evento.nameEvent,
        description: evento.descriptionEvent
      }));
  };

  const handleCloseCrearEvento = (data, hasChanges) => {
    setIsModalView(false);
    if (hasChanges) fetchEventos();
  };

  const handleCloseModificarEvento = (data, hasChanges) => {
    setIsModificarEventoVisible(false);
    setSelectedEvento(null);
    if (hasChanges) fetchEventos();
  };

  const handleDateSelect = (value) => {
    if (value && !disableSelect) {
      setSelectedDate(value);
      setIsEventosDiaModalVisible(true);
    }
  };

  const cellRender = (current, info) => {
    if (info.type === 'date') {
      const listData = getListData(current);
      return (
        <ul className="events">
          {listData.map((item, index) => (
            <li key={index} title={item.description}>
              <Badge status="success" text={item.content} />
            </li>
          ))}
        </ul>
      );
    }
    return info.originNode;
  };

  const handleEliminarEvento = async (evento) => {
    try {
      await fetch(`${url}/api/eventos/${evento.id}`, {
        method: 'DELETE'
      });
      message.success('Evento eliminado exitosamente');
      fetchEventos();
      setIsEventosDiaModalVisible(false);
    } catch (error) {
      console.error('Error al eliminar:', error);
      message.error('No se pudo eliminar el evento');
    }
  };


  return (
    <div className="eventos_container" ref={containerRef}>
      <div className="title-container-evento">
        <h1 className='title_event'>Eventos</h1>
        <button className='btn-crear-evento' onClick={() => setIsModalView(true)}>
          Crear evento
        </button>
        {isModalView && (
          <CrearEvento onClose={handleCloseCrearEvento} />
        )}
      </div>

      <Calendar
        cellRender={cellRender}
        className='calendar_container'
        onSelect={handleDateSelect}
      />

      {/* Modal de eventos del día */}
      <Modal
        title={`Eventos para el ${selectedDate ? dayjs(selectedDate).format('DD/MM/YYYY') : ''}`}
        open={isEventosDiaModalVisible}
        onCancel={() => setIsEventosDiaModalVisible(false)}
        footer={null}
        width={400}
        style={{ zIndex: 1000 }}
      >
        {selectedDate && getListData(selectedDate).length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={getListData(selectedDate)}
            renderItem={(evento) => (
              <List.Item
                actions={[
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: 'edit',
                          label: 'Modificar',
                          onClick: () => {
                            setSelectedEvento(evento);
                            setIsModificarEventoVisible(true);
                            setIsEventosDiaModalVisible(false);
                          }
                        },
                        {
                          key: 'delete',
                          label: 'Eliminar',
                          onClick: () => handleEliminarEvento(evento)
                        }
                      ]
                    }}
                    trigger={['click']}
                  >
                    <MoreOutlined />
                  </Dropdown>
                ]}
              >
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '80px', fontWeight: 'bold' }}>
                      {dayjs(`2025-01-01T${evento.timeEvent}:00`).isValid()
                        ? dayjs(`2025-01-01T${evento.timeEvent}:00`).format('h:mm A')
                        : 'Fecha inválida'}
                    </div>

                    <Divider type="vertical" style={{ height: '100%' }} />
                    <div style={{ marginLeft: '12px', flex: 1 }}>
                      <div style={{ fontWeight: 500 }}>{evento.nameEvent}</div>
                      <div style={{ color: '#888' }}>{evento.descriptionEvent}</div>
                    </div>
                  </div>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <Empty
            description="No hay eventos programados para este día"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Modal>

      {/* Modal para modificar evento */}
      <ModificarEvento
        visible={isModificarEventoVisible}
        evento={selectedEvento}
        onClose={handleCloseModificarEvento}
        style={{ zIndex: 1000 }}
      />
    </div>
  );
};
