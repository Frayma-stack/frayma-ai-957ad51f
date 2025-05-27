
import { FC } from 'react';

const AuthHeader: FC = () => {
  return (
    <div className="text-center mb-8">
      <img 
        src="/lovable-uploads/c03df3aa-a5a4-4db8-8a06-910f2452d629.png" 
        alt="Frayma AI Logo" 
        className="h-12 w-12 mx-auto mb-4" 
      />
      <h1 className="text-2xl font-sora font-bold text-brand-primary">Welcome to Frayma AI</h1>
      <p className="text-gray-600 text-sm opacity-70 mt-2">Frame your thoughts into sharp POVs. Auto-craft resonant GTM assets with narratives that win you buyers.</p>
    </div>
  );
};

export default AuthHeader;
