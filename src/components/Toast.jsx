function Toast({ toast }) {
  if (!toast.show) return null;

  return (
    <div className={`toast-message toast-${toast.type}`}>
      {toast.message}
    </div>
  );
}

export default Toast;
