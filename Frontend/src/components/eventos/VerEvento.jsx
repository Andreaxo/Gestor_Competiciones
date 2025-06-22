import React from 'react';
import { Modal, List, Empty, Divider } from 'antd';
import dayjs from 'dayjs';

export const VerEvento = ({ visible, onClose, selectedDate, eventos }) => {
  // Filtrar eventos para la fecha seleccionada
  const eventosFecha = eventos.filter(evento =>
    dayjs(evento.dateEvent).format('YYYY-MM-DD') ===
    dayjs(selectedDate).format('YYYY-MM-DD')
  );

  return (
    <Modal
      title={`Eventos para el ${dayjs(selectedDate).format('DD/MM/YYtY')}`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={400}
    >
      {eventosFecha.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={eventosFecha}
          renderItem={(evento) => (
            <List.Item>
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '60px', fontWeight: 'bold' }}>
                    {dayjs(evento.timeEvent).format('HH:mm')}
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
          description="No hay  programados para este día"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          
        />
        
      )}
    </Modal>
  );
};
