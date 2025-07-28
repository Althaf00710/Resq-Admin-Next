'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

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
    <div className="overflow-x-auto rounded-xl">
      <table className="min-w-full bg-white border border-gray-200 shadow-sm">
        <thead className="bg-gray-300 text-sm font-semibold text-gray-600">
          <tr>
            <th className="px-4 py-2">Icon</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-gray-100 text-sm">
          {categories.map(cat => (
            <React.Fragment key={cat.id}>
              <tr className="hover:bg-gray-200">
                <td className="px-4 py-2">
                  <Icon icon={cat.icon} className="w-6 h-6" />
                </td>
                <td className="px-4 py-2">{cat.name}</td>
                <td className="px-4 py-2">{cat.description}</td>
                <td className="px-4 py-2 text-right flex justify-end gap-2">
                  <button
                    onClick={() => toggleExpand(cat.id)}
                    className={clsx('transition-transform duration-200', {
                      'rotate-180': expandedCategoryId === cat.id,
                    })}
                  >
                    <ChevronDown size={20} />
                  </button>
                  <EditButton onClick={() => onEdit(cat)} />
                  <DeleteButton onClick={() => onDelete(cat.id)} />
                </td>
              </tr>

              {expandedCategoryId === cat.id && (
                <tr className="bg-gray-50">
                  <td colSpan={4} className="px-4 py-4">
                    <div className="pl-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AddButton onClick={() => onAddSubcategory(cat.id)} />
                        <span className="text-sm text-gray-500">Manage Subcategories</span>
                      </div>

                      {subcategories[cat.id]?.length ? (
                        <ul className="space-y-2">
                          {subcategories[cat.id].map(sub => (
                            <li key={sub.id} className="flex items-start gap-3">
                              <div className="border-l-4 border-blue-400 pl-3 flex-1">
                                <div className="font-medium text-gray-700">{sub.name}</div>
                                <div className="text-sm text-gray-500">{sub.description}</div>
                                <div className="flex gap-2 mt-1">
                                  <EditButton onClick={() => onEditSubcategory(sub)} />
                                  <DeleteButton onClick={() => onDeleteSubcategory(sub)} />
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
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
