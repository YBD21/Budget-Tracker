'use client';

import { useState } from 'react';
import Button from '../Button';
import Add from '@mui/icons-material/Add';
import { Modal, ConfigProvider, theme } from 'antd';
import { useThemeStore } from '@/context/Store';
import CloseIcon from '@mui/icons-material/Close';

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
          centered
          title="Basic Modal"
          open={isModalOpen}
          closeIcon={
            <CloseIcon className="scale-110 text-red-600 dark:text-red-700 pointer-events-none" />
          }
          onCancel={handleCancel} // works on close button
          footer={(_) => (
            <>
              <Button type="primary" title={'Custom Button'}></Button>
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
