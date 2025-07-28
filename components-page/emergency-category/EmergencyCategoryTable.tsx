'use client';

import React, { useState } from 'react';
import { EmergencyCategory } from '@/graphql/types/emergencyCategory';
import { EmergencySubCategory } from '@/graphql/types/emergencySubCategory';
import { ChevronDown } from 'lucide-react';
import AddButton from '@/components/ui/button/AddButton';
import { Icon } from '@iconify/react'
import EditButton from '@/components/ui/button/EditButton';
import DeleteButton from '@/components/ui/button/DeleteButton';
import clsx from 'clsx';

interface EmergencyCategoryTableProps {
  categories: EmergencyCategory[];
  onExpand: (categoryId: string) => Promise<EmergencySubCategory[]>;
  onEdit: (category: EmergencyCategory) => void;
  onDelete: (id: string) => void;
  onAddSubcategory: (categoryId: string) => void;
  onEditSubcategory: (subcategory: EmergencySubCategory) => void;
  onDeleteSubcategory: (id: string) => void;
  subcategories: Record<string, EmergencySubCategory[]>;
  setSubcategories: React.Dispatch<React.SetStateAction<Record<string, EmergencySubCategory[]>>>;
}


export default function EmergencyCategoryTable({
  categories,
  onExpand,
  onEdit,
  onDelete,
  onAddSubcategory,
  onEditSubcategory,
  onDeleteSubcategory,
  subcategories,
  setSubcategories,
}: EmergencyCategoryTableProps) {
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);

  const handleToggleExpand = async (categoryId: string) => {
    if (expandedCategoryId === categoryId) {
      setExpandedCategoryId(null);
      return;
    }

    if (!subcategories[categoryId]) {
      const subs = await onExpand(categoryId);
      setSubcategories(prev => ({ ...prev, [String(categoryId)]: subs }));
    }

    setExpandedCategoryId(categoryId);
  };

  return (
    <div className="overflow-x-auto rounded-xl">
      <table className="min-w-full bg-white border border-gray-200 shadow-sm">
        <thead className="bg-gray-300 text-left text-sm font-semibold text-gray-600">
          <tr>
            <th className="px-4 py-2">Icon</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200 bg-gray-100'>
          {categories.map((category) => (
            <React.Fragment key={category.id}>
              <tr className="border-t border-gray-100 text-sm hover:bg-gray-200">
                <td className="px-4 py-2"><Icon icon={category.icon} className="w-8 h-8" /></td>
                <td className="px-4 py-2">{category.name}</td>
                <td className="px-4 py-2">{category.description}</td>
                <td className="px-4 py-2 text-right flex justify-end gap-2">
                  <button
                    onClick={() => handleToggleExpand(category.id)}
                    className={clsx("transition-transform duration-200", {
                      'rotate-180': expandedCategoryId === category.id
                    })}
                  >
                    <ChevronDown size={25} />
                  </button>
                  <EditButton onClick={() => onEdit(category)} />
                  <DeleteButton onClick={() => onDelete(category.id)} />
                </td>
              </tr>

              {expandedCategoryId === category.id && (
                <tr className="bg-gray-50 transition-all duration-300">
                  <td colSpan={4} className="px-4 py-4">
                    <div className="pl-4">
                      {/* Add Button and Heading on same line */}
                      <div className="flex items-center gap-1 mb-3">
                        <AddButton onClick={() => onAddSubcategory(category.id)} label='' />
                        <h3 className='text-sm text-gray-500 font-medium ml-2'>Manage Subcategories</h3>
                      </div>

                      {subcategories[String(category.id)]?.length > 0 ? (
                        <ul className="space-y-2">
                          {subcategories[String(category.id)].map((sub) => (
                            <li key={sub.id} className="flex items-start gap-3">
                              <div className="border-l-4 border-blue-400 pl-3 w-full hover:border-blue-600 transition">
                                <div className="font-medium text-gray-700">{sub.name}</div>
                                <div className="text-sm text-gray-500 mb-1">{sub.description}</div>
                                <div className="flex gap-2">
                                  <EditButton onClick={() => onEditSubcategory(sub)} label='' />
                                  <DeleteButton onClick={() => onDeleteSubcategory(sub.id)} label='' />
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-gray-500 text-sm italic">No subcategories found.</div>
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
