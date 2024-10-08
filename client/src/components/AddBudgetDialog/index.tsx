'use client';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { DatePicker, Modal } from 'antd';
import { useThemeStore } from '@/context/Store';
import CloseIcon from '@mui/icons-material/Close';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StyledDatePickerWrapper from './StyledDatePickerWrapper';
import ErrorMessage from '../ErrorMessage';
import { useUserAction } from '@/hooks/user/useUserAction';
import { showToast } from '../Toast';
import Button from '../Button';
import { RecordT } from '../DataTable/ActionTab';
import { useEffect } from 'react';

type AddBudgetInputs = {
  title: string;
  date: Date;
  type: 'Income' | 'Expense';
  reoccur: 'Once' | 'Monthly' | 'Yearly';
  amount: number;
};

type TAddBudgetDialog = {
  openStatus: boolean;
  closeModal: () => void;
  budgetInfo?: RecordT;
};

const DateFormat = 'YYYY/MM/DD';

const AddBudgetDialog = ({ openStatus, closeModal, budgetInfo }: TAddBudgetDialog) => {
  const { theme: themeValue } = useThemeStore();

  const { addBudgetMutation, editBudgetMutation } = useUserAction();

  const typeOptions = ['Income', 'Expense'];
  const reoccurOptions = ['Once', 'Monthly', 'Yearly'];

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
      .max(999999999)
      .typeError('Amount is required!')
      .positive('Amount must be a positive number')
      .required('Amount is required!'),
  });

  const validationOpt = {
    resolver: yupResolver(formSchema),
  };

  const {
    control,
    setValue,
    register,
    handleSubmit,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm(validationOpt);

  useEffect(() => {
    const currentDate = dayjs(budgetInfo?.date);
    // @ts-expect-error
    setValue('date', currentDate); // Set the date value using setValue
  }, [setValue, budgetInfo]);

  const handleAfterClose = () => {
    reset();
  };

  const handleClearErrors = () => {
    // Clear errors when input value changes
    clearErrors();
  };

  const handleAddSubmit: SubmitHandler<AddBudgetInputs> = async (data) => {
    const budgetData = {
      title: data?.title,
      date: data?.date,
      reoccur: data?.reoccur,
      type: data.type,
      amount: data?.amount,
    };

    try {
      const respond = await addBudgetMutation.mutateAsync(budgetData);

      if (respond === true) {
        showToast({ type: 'success', content: 'Budget added successfully !' });
      }
      closeModal();
    } catch (error: any) {
      showToast({ type: 'error', content: `${error.message} !` });
    }
  };

  const handleEditSubmit: SubmitHandler<AddBudgetInputs> = async (data) => {
    const budgetData = {
      id: budgetInfo?.key,
      title: data?.title,
      date: data?.date,
      reoccur: data?.reoccur,
      type: data.type,
      amount: data?.amount,
    };

    try {
      const respond = await editBudgetMutation.mutateAsync(budgetData);

      if (respond === true) {
        showToast({ type: 'success', content: 'Budget updated successfully !' });
      }
      closeModal();
    } catch (error: any) {
      showToast({ type: 'error', content: `${error.message} !` });
    }
  };

  return (
    <Modal
      centered
      title={
        <p className="text-center text-lg font-bold">{budgetInfo ? 'Edit Item' : 'Add Item'}</p>
      }
      open={openStatus}
      onCancel={closeModal} // Close the modal
      afterClose={handleAfterClose} // Reset data after close
      closeIcon={<CloseIcon className="scale-110 text-red-600 dark:text-red-700" />}
      footer={(_) => (
        <div className="w-1/4 flex justify-center mx-auto mt-10">
          <Button
            handleClick={handleSubmit(budgetInfo ? handleEditSubmit : handleAddSubmit)}
            small
            type="primary"
            title="Submit"
          />
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
              defaultValue={budgetInfo && budgetInfo.title}
              className={`
              ${errors?.title ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-black focus:border-black focus:ring-black dark:border-neutral-400 dark:focus:border-neutral-500 dark:focus:ring-neutral-400'}
              mt-2.5 block w-full rounded-md border-2  px-4 py-1.5  focus:outline-none focus:ring focus:ring-opacity-40 dark:bg-neutral-700`}
            />
            <ErrorMessage errorName={errors?.title} />
          </div>
          {/* Type and Reoccur -- Select Box */}
          <div className="flex flex-row gap-16">
            {/* Type -- Select Box */}
            <div className="w-full py-2">
              <label className="block text-sm font-semibold text-gray-800 dark:text-neutral-300">
                Type
              </label>
              <div className="relative mt-2">
                <select
                  {...register('type')}
                  defaultValue={budgetInfo && budgetInfo.type}
                  className={`${
                    errors?.type
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                      : 'border-black focus:border-black focus:ring-black dark:border-neutral-400 dark:focus:border-neutral-500 dark:focus:ring-neutral-400'
                  }mt-2.5 block w-full rounded-md border-2 px-4 py-1.5 focus:outline-none active:ring-2 focus:ring-opacity-40 dark:bg-neutral-700 appearance-none text-center text-base transition duration-300 ease-in-out bg-white`}
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
              <div className="relative mt-2">
                <select
                  {...register('reoccur')}
                  defaultValue={budgetInfo && budgetInfo.reoccur}
                  className={`${
                    errors?.reoccur
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                      : 'border-black focus:border-black focus:ring-black dark:border-neutral-400 dark:focus:border-neutral-500 dark:focus:ring-neutral-400'
                  }mt-2.5 block w-full rounded-md border-2 px-4 py-1.5 focus:outline-none active:ring-2 focus:ring-opacity-40 dark:bg-neutral-700 appearance-none text-center text-base transition duration-300 ease-in-out bg-white`}
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
          {/* Date and Amount */}
          <div className="flex flex-row gap-16">
            {/* Date -- Calender */}
            <div className="w-full py-2">
              <label className="block text-sm font-semibold text-gray-800 dark:text-neutral-300">
                Date
              </label>

              <div className={`relative mt-2`}>
                <StyledDatePickerWrapper
                  error={errors?.date ? true : false}
                  className={`${themeValue === 'light' ? 'light' : 'dark'}`}
                >
                  <Controller
                    name="date"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <DatePicker format={DateFormat} onChange={onChange} value={value} />
                    )}
                  />
                </StyledDatePickerWrapper>
                <ErrorMessage errorName={errors?.date} />
              </div>
            </div>
            {/* Amount */}
            <div className={`w-full py-2 ${errors?.amount ? '' : 'pb-3'}`}>
              <label className="block text-sm font-semibold text-gray-800 dark:text-neutral-300">
                Amount
              </label>

              <input
                {...register('amount')}
                defaultValue={budgetInfo && budgetInfo.amount}
                type="number"
                autoComplete="off"
                onChange={handleClearErrors}
                // eslint-disable-next-line tailwindcss/migration-from-tailwind-2
                className={`
              ${errors?.amount ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-black focus:border-black focus:ring-black dark:border-neutral-400 dark:focus:border-neutral-500 dark:focus:ring-neutral-300'}
              mt-2.5 block w-full rounded-md border-2  px-4 py-1.5  focus:outline-none  focus:ring-2 focus:ring-opacity-40 dark:bg-neutral-700`}
              />
              <ErrorMessage errorName={errors?.amount} />
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddBudgetDialog;
