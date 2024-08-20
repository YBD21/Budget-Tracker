'use client';

import { useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '../Button';
import Add from '@mui/icons-material/Add';
import { Modal, ConfigProvider, theme, Select } from 'antd';
import { useThemeStore } from '@/context/Store';
import CloseIcon from '@mui/icons-material/Close';
import { useForm } from 'react-hook-form';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type Inputs = {
  title: string;
  date: Date; // numbers
  type: 'Income' | 'Expense';
  reoccur: 'Once' | 'Monthly' | 'Yearly';
  amount: number;
};

const AddBudget = () => {
  const { theme: themevalue } = useThemeStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const typeOptions = ['Income', 'Expense'];
  const reoccurOptions = ['Once', 'Monthly', 'Yearly'];

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const formSchema = Yup.object({
    date: Yup.date().required('Date is required!'),
    title: Yup.string().max(40, 'Title must be max 40 characters').required('Title is required!'),
    type: Yup.mixed<'Income' | 'Expense'>()
      .oneOf(['Income', 'Expense'], 'Type must be either Income or Expense')
      .required('Type is required!'),
    reoccur: Yup.mixed<'Once' | 'Monthly' | 'Yearly'>()
      .oneOf(['Once', 'Monthly', 'Yearly'], 'Reoccur must be Once, Monthly, or Yearly')
      .required('Reoccur is required!'),
    amount: Yup.number()
      .positive('Amount must be a positive number')
      .required('Amount is required!'),
  });

  const validationOpt = {
    resolver: yupResolver(formSchema),
  };

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm(validationOpt);

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
          title={<p className="text-center text-lg font-bold">Add Item</p>}
          open={isModalOpen}
          closeIcon={
            <CloseIcon className="scale-110 text-red-600 dark:text-red-700 pointer-events-none" />
          }
          onCancel={handleCancel} // works on close button
          footer={(_) => (
            <div className="w-1/4 flex justify-center mx-auto mt-10">
              <Button small type="primary" title="Submit"></Button>
            </div>
          )}
        >
          <div className="flex flex-col justify-center overflow-hidden">
            <form className="mt-3 px-2">
              {/* Title */}
              <div className={`${errors?.title ? 'pb-2' : 'pb-3'}`}>
                <label className="block text-sm font-semibold text-gray-800 dark:text-neutral-300">
                  Title
                </label>
                <input
                  {...register('title')}
                  type="text"
                  autoComplete="off"
                  // onChange={handleClearErrors}
                  // eslint-disable-next-line tailwindcss/migration-from-tailwind-2
                  className={`
              ${errors?.title ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-black focus:border-black focus:ring-black dark:border-neutral-400 dark:focus:border-neutral-500 dark:focus:ring-neutral-400'}
              mt-2.5 block w-full rounded-md border-2  px-4 py-1.5  focus:outline-none focus:ring focus:ring-opacity-40 dark:bg-neutral-700`}
                />
                {/* <ErrorMessage errorName={errors?.title} /> */}
              </div>
              <div className="flex flex-row gap-16">
                {/* Type -- Select Box */}
                <div className="w-full py-2">
                  <label className="block text-sm font-semibold text-gray-800 dark:text-neutral-300">
                    Type
                  </label>
                  {/* Error Message Type
                  {errors?.type && (
                    <span className="text-red-600 text-xs mt-1 block">{errors.type.message}</span>
                  )} */}
                  <div className="relative mt-2">
                    <select
                      {...register('type')}
                      className={`${
                        errors?.type
                          ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                          : 'border-black focus:border-black focus:ring-black dark:border-neutral-400 dark:focus:border-neutral-500 dark:focus:ring-neutral-400'
                      }mt-2.5 block w-full rounded-md border-2 px-4 py-2 focus:outline-none active:ring-2 focus:ring-opacity-40 dark:bg-neutral-700 appearance-none text-center text-base transition duration-300 ease-in-out bg-white`}
                    >
                      {typeOptions.map((element, index) => (
                        <option key={index} value={element}>
                          {element}
                        </option>
                      ))}
                    </select>
                    <ExpandMoreIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer pointer-events-none text-black dark:text-neutral-300 sm:scale-125 transition duration-300 ease-in-out" />
                  </div>
                </div>
                {/* Reoccur -- Select Box */}
                <div className="w-full py-2">
                  <label className="block text-sm font-semibold text-gray-800 dark:text-neutral-300">
                    Reoccur
                  </label>
                  {/* Error Message Type
                  {errors?.type && (
                    <span className="text-red-600 text-xs mt-1 block">{errors.type.message}</span>
                  )} */}
                  <div className="relative mt-2">
                    <select
                      {...register('reoccur')}
                      className={`${
                        errors?.reoccur
                          ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                          : 'border-black focus:border-black focus:ring-black dark:border-neutral-400 dark:focus:border-neutral-500 dark:focus:ring-neutral-400'
                      }mt-2.5 block w-full rounded-md border-2 px-4 py-2 focus:outline-none active:ring-2 focus:ring-opacity-40 dark:bg-neutral-700 appearance-none text-center text-base transition duration-300 ease-in-out bg-white`}
                    >
                      {reoccurOptions.map((element, index) => (
                        <option key={index} value={element}>
                          {element}
                        </option>
                      ))}
                    </select>
                    <ExpandMoreIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer pointer-events-none text-black dark:text-neutral-300 sm:scale-125 transition duration-300 ease-in-out" />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </Modal>
      </ConfigProvider>
    </div>
  );
};

export default AddBudget;
