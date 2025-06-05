const labelStyle = "text-sm text-start font-medium text-gray-700";
const inputStyle = "input input-bordered w-full";

export default function DialogCreateShortenerLink() {
  function handleCloseDialog() {
    const dialog = document.getElementById(
      "my_modal_4"
    ) as HTMLDialogElement | null;
    if (dialog) dialog.close();
  }
  return (
    <dialog id="my_modal_4" className="modal">
      <div className="modal-box">
        <h2 className="text-2xl font-semibold text-gray-900 mb-1">
          Criar link encurtado
        </h2>
        <p className="text-sm text-gray-600">
          Preencha os campos abaixo para gerar uma URL personalizada.
        </p>
        <form className="mt-6 space-y-5">
          <div className="flex flex-col gap-1">
            <label htmlFor="url" className={labelStyle}>
              URL
            </label>
            <input
              id="url"
              type="text"
              className={inputStyle}
              placeholder="https://..."
            />
          </div>

          <div>
            <div className="flex flex-col gap-1 mb-3">
              <label htmlFor="label" className={labelStyle}>
                Label
              </label>
              <input
                id="label"
                type="text"
                className={inputStyle}
                placeholder="Nome curto ou descrição"
              />
            </div>
            <div className="w-full flex flex-col items-start">
              <label
                htmlFor="randow-label"
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  id="randow-label"
                  type="checkbox"
                  defaultChecked
                  className="checkbox checkbox-secondary checkbox-sm"
                />
                <span className="text-sm font-medium text-gray-700">
                  Gerar label aleatória
                </span>
              </label>
            </div>
          </div>
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              className="btn btn-outline h-10 text-gray-700 hover:bg-error hover:text-white sm:flex-1"
              onClick={handleCloseDialog}
            >
              Fechar
            </button>
            <button type="submit" className="btn h-10 btn-success sm:flex-1">
              Enviar
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
