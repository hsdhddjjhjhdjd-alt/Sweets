import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#FDFCF7] text-stone-900" dir="rtl">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-stone-200 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold font-display text-stone-900">
              حدث تنبيه غير متوقع أثناء معالجة الطلب
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              تم حفظ بياناتك وأصنافك في المتجر. يمكنك إعادة تحميل الصفحة للمتابعة دون فقدان أي بيانات.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full py-3 bg-[#8B1528] hover:bg-[#700C1C] text-white text-sm font-semibold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة تحميل المتجر والمتابعة</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
