export const openDialog = (dialogId: string) => {
  const dialog = document.getElementById(dialogId) as HTMLDialogElement;

  if (dialog) {
    dialog.showModal();
  }
};

export const closeDialog = (dialogId: string) => {
  const dialog = document.getElementById(dialogId) as HTMLDialogElement;

  if (dialog) {
    dialog.close();
  }
};
