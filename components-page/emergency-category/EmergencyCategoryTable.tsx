'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

import AddButton from '@/components/ui/button/AddButton';
import EditButton from '@/components/ui/button/EditButton';
import DeleteButton from '@/components/ui/button/DeleteButton';

import { EmergencyCategory } from '@/graphql/types/emergencyCategory';
import { EmergencySubCategory } from '@/graphql/types/emergencySubCategory';

interface EmergencyCategoryTableProps {
  categories: EmergencyCategory[];
  subcategories: Record<string, EmergencySubCategory[]>;
  setSubcategories: React.Dispatch<
    React.SetStateAction<Record<string, EmergencySubCategory[]>>
  >;
  onExpand: (categoryId: string) => Promise<EmergencySubCategory[]>;
  onEdit: (category: EmergencyCategory) => void;
  onDelete: (id: string) => void;
  onAddSubcategory: (categoryId: string) => void;
  onEditSubcategory: (subcategory: EmergencySubCategory) => void;
  onDeleteSubcategory: (subcategory: EmergencySubCategory) => void;
}

export default function EmergencyCategoryTable({
  categories,
  subcategories,
  setSubcategories,
  onExpand,
  onEdit,
  onDelete,
  onAddSubcategory,
  onEditSubcategory,
  onDeleteSubcategory,
}: EmergencyCategoryTableProps) {
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);

  const toggleExpand = async (categoryId: string) => {
    if (expandedCategoryId === categoryId) {
      setExpandedCategoryId(null);
      return;
    }
    if (!subcategories[categoryId]) {
      const list = await onExpand(categoryId);
      setSubcategories(prev => ({ ...prev, [categoryId]: list }));
    }
    setExpandedCategoryId(categoryId);
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-300 text-left text-gray-800">
          <tr>
            <th className="px-4 py-3 font-semibold">Icon</th>
            <th className="px-4 py-3 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold">Description</th>
            <th className="px-4 py-3 font-semibold text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-gray-100 text-sm">
          {categories.map(cat => (
            <React.Fragment key={cat.id}>
              <tr className="bg-gray-50 hover:bg-gray-100">
                <td className="px-4 py-2">
                  <Icon icon={cat.icon} className="w-6 h-6" />
                </td>
                <td className="px-4 py-2 text-gray-900 font-medium">{cat.name}</td>
                <td className="px-4 py-2 text-gray-700">{cat.description}</td>
                <td className="px-4 py-2 text-right flex justify-end gap-2">
                  <button
                    onClick={() => toggleExpand(cat.id)}
                    className={clsx('transition-transform duration-200 cursor-pointer px-2 bg-blue-800 hover:bg-blue-900 text-white rounded-full', {
                      'rotate-180': expandedCategoryId === cat.id,
                    })}
                    title='Toggle Subcategories'
                  >
                    <ChevronDown size={20} />
                  </button>
                  <EditButton onClick={() => onEdit(cat)} />
                  <DeleteButton onClick={() => onDelete(cat.id)} />
                </td>
              </tr>

              <AnimatePresence initial={false}>
                {expandedCategoryId === cat.id && (
                  <motion.tr
                    key="subcat-row"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-gray-200 overflow-hidden"
                  >
                    <td colSpan={4} className="p-0">
                      <div className="px-4 py-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AddButton onClick={() => onAddSubcategory(cat.id)} label='' />
                          <span className="text-sm text-gray-700 font-semibold">
                            Manage Subcategories ({subcategories[cat.id]?.length || 0})
                          </span>
                        </div>

                        {subcategories[cat.id]?.length ? (
                          <ul className="space-y-2">
                            {subcategories[cat.id].map(sub => (
                              <li key={sub.id} className="flex items-start gap-3">
                                <div className="border-l-3 border-blue-600 pl-3 flex-1 hover:border-blue-800 transition rounded-md">
                                  <div className="font-medium text-gray-700">{sub.name}</div>
                                  <div className="text-sm text-gray-600">{sub.description}</div>
                                  <div className="flex gap-2 mt-1">
                                    <EditButton onClick={() => onEditSubcategory(sub)} label='' />
                                    <DeleteButton onClick={() => onDeleteSubcategory(sub)} label='' />
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="italic text-gray-500">No subcategories found.</div>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
