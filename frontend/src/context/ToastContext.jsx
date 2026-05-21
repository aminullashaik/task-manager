import { createContext, useState, useContext, useCallback } from "react";
import { CheckCircle, AlertCircle, Info } from "lucide-react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case "success": return <CheckCircle size={20} color="var(--success)" />;
      case "error": return <AlertCircle size={20} color="var(--danger)" />;
      default: return <Info size={20} color="var(--accent-color)" />;
    }
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {getIcon(t.type)}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

// Refresh status
