import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

export default function ConfirmDeleteItem({
  open,
  handleClose,
  action,
}: {
  open: boolean;
  handleClose: () => void;
  action: () => Promise<{ message: string } | undefined>;
}) {
  const handleAction = async () => {
    await action();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>確認</DialogTitle>
      <DialogContent>
        <p>本当に削除しますか？</p>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={handleAction}>
          はい
        </Button>
        <Button variant="outlined" color="error" onClick={handleClose}>
          いいえ
        </Button>
      </DialogActions>
    </Dialog>
  );
}
