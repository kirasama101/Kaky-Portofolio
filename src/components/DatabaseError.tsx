import { AlertCircle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface DatabaseErrorProps {
  message?: string;
}

const DatabaseError = ({ message }: DatabaseErrorProps) => {
  const { language } = useLanguage();
  const isAr = language === "ar";

  const defaultMessage = isAr
    ? "لا يمكن الاتصال بقاعدة البيانات حالياً. يرجى المحاولة مرة أخرى لاحقاً."
    : "Unable to connect to the database at the moment. Please try again later.";

  return (
    <div className="min-h-[400px] flex items-center justify-center px-4">
      <div className="bg-card border border-destructive/50 rounded-2xl p-8 max-w-md w-full text-center">
        <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">
          {isAr ? "خطأ في الاتصال" : "Connection Error"}
        </h2>
        <p className="text-muted-foreground">
          {message || defaultMessage}
        </p>
      </div>
    </div>
  );
};

export default DatabaseError;

