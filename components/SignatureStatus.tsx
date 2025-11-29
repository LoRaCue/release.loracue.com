import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SignatureStatusProps {
    verified: boolean | null;
    className?: string;
}

export function SignatureStatus({ verified, className }: SignatureStatusProps) {
    if (verified === null) {
        return (
            <div className={cn("flex items-center gap-1 text-yellow-600", className)}>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Verifying...</span>
            </div>
        );
    }

    if (verified) {
        return (
            <div className={cn("flex items-center gap-1 text-green-600", className)}>
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Verified</span>
            </div>
        );
    }

    return (
        <div className={cn("flex items-center gap-1 text-red-600", className)}>
            <XCircle className="w-4 h-4" />
            <span className="text-sm">Invalid Signature</span>
        </div>
    );
}
