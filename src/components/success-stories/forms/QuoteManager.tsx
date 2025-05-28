
import { FC, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Quote {
  id: string;
  quote: string;
  author: string;
  title: string;
}

interface QuoteManagerProps {
  quotes: Quote[];
  onAddQuote: (quote: Omit<Quote, 'id'>) => void;
  onRemoveQuote: (id: string) => void;
}

const QuoteManager: FC<QuoteManagerProps> = ({
  quotes,
  onAddQuote,
  onRemoveQuote,
}) => {
  const [newQuote, setNewQuote] = useState({ quote: '', author: '', title: '' });

  const handleAddQuote = () => {
    if (newQuote.quote && newQuote.author && newQuote.title) {
      onAddQuote(newQuote);
      setNewQuote({ quote: '', author: '', title: '' });
    }
  };

  return (
    <div>
      <Label className="text-right">Quotes</Label>
      <div className="col-span-3">
        {quotes.map((quote) => (
          <div key={quote.id} className="flex items-center justify-between mb-2">
            <div>
              <p className="font-semibold">{quote.quote}</p>
              <p className="text-sm">- {quote.author}, {quote.title}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onRemoveQuote(quote.id)}>
              Remove
            </Button>
          </div>
        ))}
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Quote"
            value={newQuote.quote}
            onChange={(e) => setNewQuote({ ...newQuote, quote: e.target.value })}
          />
          <Input
            type="text"
            placeholder="Author"
            value={newQuote.author}
            onChange={(e) => setNewQuote({ ...newQuote, author: e.target.value })}
          />
          <Input
            type="text"
            placeholder="Author Title"
            value={newQuote.title}
            onChange={(e) => setNewQuote({ ...newQuote, title: e.target.value })}
          />
          <Button size="sm" onClick={handleAddQuote}>
            Add Quote
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuoteManager;
