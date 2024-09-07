import { Tooltip } from '@mui/material';
import { Modal } from 'antd';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '../Button';

type TDeleteDialog = {
  title: string;
  pending: boolean;
  openStatus: boolean;
  handleCancel: () => void;
  handleDelete: () => void;
};

const DeleteDialog = ({
  title,
  pending,
  openStatus,
  handleCancel,
  handleDelete,
}: TDeleteDialog) => {
  return (
    <Modal
      centered
      open={openStatus}
      // onCancel={handleCancel}
      closeIcon={
        <CloseIcon
          role="button"
          className="scale-110 text-red-600 dark:text-red-700"
          onClick={!pending ? handleCancel : undefined}
        />
      }
      footer={(_) => (
        <div className="flex justify-between gap-32 mt-5">
          {/* Cancel */}

          <Tooltip
            title="Cancel"
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
            <Button isPending={pending} handleClick={handleCancel} title="Cancel" />
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
            <Button
              isPending={pending}
              type="error"
              handleClick={handleDelete}
              title={
                <div className="flex gap-2">
                  <DeleteIcon className="scale-110 text-white pointer-events-none" /> Delete
                </div>
              }
            />
          </Tooltip>
        </div>
      )}
    >
      <div className="flex flex-col justify-center overflow-hidden p-2.5">
        <p className="py-2 px-4 text-center text-xl font-medium text-gray-700 dark:text-neutral-300">
          Are you sure you want to delete {'?'}
        </p>
        <span className="py-4 font-bold text-center text-xl">"{title}"</span>
        <div className="mx-8 py-3 px-6 text-sm text-gray-700 dark:text-neutral-300 bg-red-50 dark:bg-neutral-700 border border-red-300 dark:border-red-600 rounded-md">
          <div className="px-2 flex items-baseline">
            <strong className="font-bold text-red-600 dark:text-white mr-2">Note:</strong>
            <span className="text-sm text-center text-gray-800 dark:text-gray-200">
              This action will permanently delete the item. This cannot be undone.
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteDialog;
