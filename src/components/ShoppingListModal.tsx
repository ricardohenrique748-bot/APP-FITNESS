import React, { useState } from 'react';
import { ShoppingListCategory } from '../types';

interface ShoppingListModalProps {
  isOpen: boolean;
  shoppingList: ShoppingListCategory[];
  onClose: () => void;
}

export const ShoppingListModal: React.FC<ShoppingListModalProps> = ({ isOpen, shoppingList, onClose }) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const toggleItem = (itemKey: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemKey]: !prev[itemKey]
    }));
  };

  const handleCopyList = () => {
    const text = shoppingList.map(
      (cat) =>
        `*${cat.category}*\n` +
        cat.items
          .map((item) => {
            const isDone = checkedItems[`${cat.category}-${item}`];
            return `${isDone ? '✅' : '▫️'} ${item}`;
          })
          .join('\n')
    ).join('\n\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#1e2024] border border-[#282a2e] rounded-2xl p-5 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#282a2e] pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c5f400] text-[24px]">shopping_cart</span>
            <div>
              <h3 className="text-[17px] font-bold text-white leading-tight">Lista de Compras Semanal</h3>
              <p className="text-[11px] text-[#c2c6d2]">Calculada para 7 dias • Tabela TACO/IBGE</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#282a2e] flex items-center justify-center text-[#c2c6d2] hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Categories and checklist */}
        <div className="flex flex-col gap-4">
          {shoppingList.map((category) => (
            <div key={category.category} className="flex flex-col gap-2">
              <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#c5f400] bg-[#1a1c20] px-2.5 py-1 rounded-md">
                {category.category}
              </h4>
              <div className="flex flex-col gap-1.5 pl-1">
                {category.items.map((item) => {
                  const key = `${category.category}-${item}`;
                  const isChecked = !!checkedItems[key];
                  return (
                    <button
                      key={key}
                      onClick={() => toggleItem(key)}
                      className={`flex items-center gap-2.5 p-2 rounded-lg text-left transition-colors ${
                        isChecked ? 'bg-[#1a1c20]/60 text-[#8e9379] line-through' : 'hover:bg-[#282a2e]/50 text-[#e2e2e8]'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center transition-colors shrink-0 ${
                          isChecked ? 'bg-[#c5f400] text-[#161e00]' : 'border border-[#444933] bg-transparent'
                        }`}
                      >
                        {isChecked && <span className="material-symbols-outlined text-[14px] font-bold">check</span>}
                      </div>
                      <span className="text-[13px]">{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#282a2e]">
          <button
            onClick={handleCopyList}
            className="flex-1 h-11 rounded-full bg-[#282a2e] hover:bg-[#333539] text-white font-semibold text-[13px] flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">{copied ? 'check' : 'content_copy'}</span>
            <span>{copied ? 'Copiado para o WhatsApp!' : 'Copiar Lista'}</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-full bg-[#c5f400] text-[#161e00] font-bold text-[13px] hover:bg-[#acd600] transition-colors"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
};
