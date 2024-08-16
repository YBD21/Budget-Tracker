'use client';

import { useState } from 'react';
import Button from '../Button';
import Add from '@mui/icons-material/Add';
import { Modal, ConfigProvider, theme } from 'antd';
import { useThemeStore } from '@/context/Store';

const AddBudget = () => {
  const { theme: themevalue } = useThemeStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex-row mx-2.5">
      <Button
        handleClick={showModal}
        title={
          <div className="flex justify-between text-base dark:text-white">
            <Add className="mr-2" fontSize="medium" /> Add
          </div>
        }
        type="primary"
      />

      <ConfigProvider
        theme={{
          algorithm: themevalue === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}
      >
        <Modal
          title="Basic Modal"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={(_) => (
            <>
              <Button title={'Custom Button'}></Button>
            </>
          )}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </ConfigProvider>
    </div>
  );
};

export default AddBudget;
