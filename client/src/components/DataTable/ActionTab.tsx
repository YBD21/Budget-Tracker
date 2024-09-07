import { useState } from 'react';
import { Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DeleteDialog from '../DeleteDialog';
import { useUserAction } from '@/hooks/user/useUserAction';
import { showToast } from '../Toast';

type RecordT = {
  key: string;
  title: string;
  date: Date;
  type: 'Income' | 'Expense';
  reoccur: 'Once' | 'Monthly' | 'Yearly';
  amount: number;
};

const ActionTab = ({ record }: { record: RecordT }) => {
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  // console.log(record);
  const { deleteBudgetMutation } = useUserAction();

  const showDeleteDialog = () => {
    setIsOpenDeleteDialog(true);
  };

  const handleDeleteAction = () => {
    deleteBudget();
  };

  const handleCancelDeleteAction = () => {
    if (!deleteBudgetMutation.isPending) {
      setIsOpenDeleteDialog(false);
    }
  };

  const deleteBudget = async () => {
    const { key, ...budgetData } = {
      ...record,
      id: record.key,
    };

    try {
      const respond = await deleteBudgetMutation.mutateAsync(budgetData);
      if (respond === true) {
        showToast({ type: 'success', content: 'Budget deleted successfully !' });

        setIsOpenDeleteDialog(false);
      }
    } catch (error: any) {
      showToast({ type: 'error', content: 'Budget deletion failed !' });
      setIsOpenDeleteDialog(false);
    }
  };

  return (
    <div className="w-full flex justify-between gap-4">
      {/* Edit */}
      <Tooltip title="Edit" placement="left">
        <button
          className="py-1.5 px-2.5 bg-black rounded-lg focus:ring-black active:ring-black hover:ring-black dark:bg-neutral-600 dark:focus:ring-neutral-400 dark:active:ring-neutral-400 dark:hover:ring-neutral-400 dark:border dark:border-neutral-400 hover:ring-2 hover:ring-opacity-50  focus:outline-none focus:ring-2  focus:ring-opacity-50 active:ring-4 active:ring-opacity-50"
          onClick={() => console.log(record.key)}
          // onClick={() => handleEdit(entry)}
        >
          <EditIcon className="scale-110 text-white pointer-events-none" />
        </button>
      </Tooltip>
      {/* Delete */}
      <Tooltip
        title="Delete"
        followCursor
        PopperProps={{
          sx: {
            '& .MuiTooltip-tooltip': {
              backgroundColor: '#8B0000',
              color: 'white',
            },
          },
        }}
      >
        <button
          className="py-1.5 px-2.5 bg-red-900 dark:bg-red-800 rounded-lg focus:ring-red-500 active:ring-red-500 hover:ring-red-400 dark:border dark:border-red-800 hover:ring-2 hover:ring-opacity-50  focus:outline-none focus:ring-2  focus:ring-opacity-50 active:ring-4 active:ring-opacity-50"
          onClick={showDeleteDialog}
        >
          <DeleteIcon className="scale-110 text-white pointer-events-none" />
        </button>
      </Tooltip>
      {/* Delete Dialog */}
      <DeleteDialog
        title={record.title}
        pending={deleteBudgetMutation.isPending}
        openStatus={isOpenDeleteDialog}
        handleCancel={handleCancelDeleteAction}
        handleDelete={handleDeleteAction}
      />
      {/* )} */}
    </div>
  );
};

export default ActionTab;
