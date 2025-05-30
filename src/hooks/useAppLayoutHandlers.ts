
import { AppLayoutProps } from '@/components/layout/AppLayout';

interface UseAppLayoutHandlersProps {
  onAssetTypeChange: AppLayoutProps['onAssetTypeChange'];
  onClientSelected: AppLayoutProps['onClientSelected'];
  onIdeasBankSelected: AppLayoutProps['onIdeasBankSelected'];
}

export const useAppLayoutHandlers = ({
  onAssetTypeChange,
  onClientSelected,
  onIdeasBankSelected,
}: UseAppLayoutHandlersProps) => {
  // Handler for asset type changes - this should trigger view changes
  const handleAssetTypeChange = (type: string) => {
    console.log('🏗️ AppLayout: Asset type changed:', type);
    onAssetTypeChange(type);
  };

  // Handler for viewing client assets
  const handleViewClientAssets = (clientId: string, assetType: string) => {
    console.log('🏗️ AppLayout: View client assets:', { clientId, assetType });
    onAssetTypeChange(assetType);
    onClientSelected(clientId);
  };

  // Handler for navigating to ideas bank from home
  const handleNavigateToIdeasBank = () => {
    console.log('🏗️ AppLayout: Navigate to ideas bank');
    onIdeasBankSelected();
  };

  return {
    handleAssetTypeChange,
    handleViewClientAssets,
    handleNavigateToIdeasBank,
  };
};
