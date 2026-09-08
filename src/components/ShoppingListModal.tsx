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
      <div className="w-full max-w-md bg-surface-container border border-surface-container-high rounded-2xl p-5 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-fixed text-[24px]">shopping_cart</span>
            <div>
              <h3 className="text-[17px] font-bold text-on-surface leading-tight">Lista de Compras Semanal</h3>
              <p className="text-[11px] text-secondary">Calculada para 7 dias • Tabela TACO/IBGE</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-secondary hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Categories and checklist */}
        <div className="flex flex-col gap-4">
          {shoppingList.map((category) => (
            <div key={category.category} className="flex flex-col gap-2">
              <h4 className="text-[12px] font-bold uppercase tracking-wider text-primary-fixed bg-surface-container-low px-2.5 py-1 rounded-md">
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
                        isChecked ? 'bg-surface-container-low/60 text-outline line-through' : 'hover:bg-surface-container-high/50 text-on-surface'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center transition-colors shrink-0 ${
                          isChecked ? 'bg-primary-fixed text-on-primary-fixed' : 'border border-outline-variant bg-transparent'
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
        <div className="flex items-center gap-2 pt-2 border-t border-surface-container-high">
          <button
            onClick={handleCopyList}
            className="flex-1 h-11 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-semibold text-[13px] flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">{copied ? 'check' : 'content_copy'}</span>
            <span>{copied ? 'Copiado para o WhatsApp!' : 'Copiar Lista'}</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-full bg-primary-fixed text-on-primary-fixed font-bold text-[13px] hover:bg-primary-fixed-dim transition-colors"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
};
