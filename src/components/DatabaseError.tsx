import { AlertCircle, RefreshCw } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";

interface DatabaseErrorProps {
  message?: string;
  onRetry?: () => void;
}

const DatabaseError = ({ message, onRetry }: DatabaseErrorProps) => {
  const { language } = useLanguage();
  const isAr = language === "ar";

  const isTimeoutError = message?.includes("timeout") || message?.includes("timed out");

  const defaultMessage = isAr
    ? "لا يمكن الاتصال بقاعدة البيانات حالياً. يرجى المحاولة مرة أخرى لاحقاً."
    : "Unable to connect to the database at the moment. Please try again later.";

  const troubleshootingSteps = isAr
    ? [
        "1. تحقق من اتصال الإنترنت لديك",
        "2. تأكد من أن مشروع Supabase نشط (غير متوقف)",
        "3. تحقق من ملف .env وتأكد من صحة VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY",
        "4. أعد تشغيل الخادم بعد تعديل ملف .env",
      ]
    : [
        "1. Check your internet connection",
        "2. Ensure your Supabase project is active (not paused)",
        "3. Verify your .env file has correct VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY",
        "4. Restart the server after modifying .env file",
      ];

  return (
    <div className="min-h-[400px] flex items-center justify-center px-4">
      <div className="bg-card border border-destructive/50 rounded-2xl p-8 max-w-lg w-full text-center">
        <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">
          {isAr ? "خطأ في الاتصال" : "Connection Error"}
        </h2>
        <p className="text-muted-foreground mb-6">
          {message || defaultMessage}
        </p>

        {isTimeoutError && (
          <div className="mt-6 text-left bg-muted/50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-3 text-sm">
              {isAr ? "خطوات استكشاف الأخطاء:" : "Troubleshooting Steps:"}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {troubleshootingSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-foreground">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            {isAr ? "إعادة المحاولة" : "Retry"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default DatabaseError;



