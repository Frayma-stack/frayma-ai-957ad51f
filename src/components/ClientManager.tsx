
import { FC, useState } from 'react';
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Account, ProductContext } from '@/types/storytelling';
import { useToast } from "@/hooks/use-toast";
import EnhancedAccountDialog from './EnhancedAccountDialog';
import ClientManagerHeader from './client-manager/ClientManagerHeader';
import ClientFilterButtons from './client-manager/ClientFilterButtons';
import ClientGrid from './client-manager/ClientGrid';

interface AccountManagerProps {
  accounts: Account[];
  selectedAccountId: string | null;
  onAccountAdded: (account: Account, productContext?: ProductContext) => void;
  onAccountUpdated: (account: Account, productContext?: ProductContext) => void;
  onAccountDeleted: (accountId: string) => void;
  onAccountSelected: (accountId: string | null) => void;
  onViewAccountAssets: (accountId: string, assetType: string) => void;
  onProductContextAdded?: (productContext: ProductContext) => void;
}

const AccountManager: FC<AccountManagerProps> = ({
  accounts,
  selectedAccountId,
  onAccountAdded,
  onAccountUpdated,
  onAccountDeleted,
  onAccountSelected,
  onViewAccountAssets,
  onProductContextAdded
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  
  const { toast } = useToast();

  const handleOpenDialog = (account?: Account) => {
    if (account) {
      setEditingAccount(account);
    } else {
      setEditingAccount(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingAccount(null);
    setIsDialogOpen(false);
  };

  const handleAccountCreated = (account: Account, productContext?: ProductContext) => {
    console.log('AccountManager: handleAccountCreated called', { account, productContext });
    
    if (editingAccount) {
      // For updates, call the enhanced update handler that handles both account and product context
      onAccountUpdated(account, productContext);
    } else {
      // For new accounts, call the enhanced add handler
      onAccountAdded(account, productContext);
    }
    
    // Don't handle product context separately here since it's now handled by the enhanced handlers
    handleCloseDialog();
  };

  const handleDelete = (accountId: string) => {
    if (confirm('Are you sure you want to delete this account? This will NOT delete associated assets.')) {
      onAccountDeleted(accountId);
      // If the deleted account was selected, reset to null or default
      if (selectedAccountId === accountId) {
        onAccountSelected(null);
      }
      toast({
        title: "Success",
        description: "Account deleted successfully"
      });
    }
  };

  const handleSelectAccount = (accountId: string | null) => {
    onAccountSelected(accountId);
    toast({
      description: accountId 
        ? `Now viewing assets for ${accounts.find(c => c.id === accountId)?.name}` 
        : "Now viewing all assets"
    });
  };

  const handleViewAccountAssets = (accountId: string, assetType: string) => {
    onViewAccountAssets(accountId, assetType);
  };

  return (
    <div className="space-y-4">
      <Card className="bg-white shadow-md">
        <ClientManagerHeader onAddClient={() => handleOpenDialog()} />
        <CardContent>
          <ClientFilterButtons
            clients={accounts}
            selectedClientId={selectedAccountId}
            onClientSelected={handleSelectAccount}
          />

          <ClientGrid
            clients={accounts}
            selectedClientId={selectedAccountId}
            onEdit={handleOpenDialog}
            onDelete={handleDelete}
            onSelect={handleSelectAccount}
            onViewClientAssets={handleViewAccountAssets}
            onAddClient={() => handleOpenDialog()}
          />
        </CardContent>
      </Card>

      <EnhancedAccountDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onClientCreated={handleAccountCreated}
        editingClient={editingAccount}
      />
    </div>
  );
};

export default AccountManager;
