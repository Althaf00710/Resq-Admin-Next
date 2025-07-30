'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import client from '@/lib/apolloClient';

import DebouncedSearchBar from '@/components/ui/search/DebouncedSearchBar';
import AddButton from '@/components/ui/button/AddButton';
import EmergencyCategoryTable from '@/components-page/emergency-category/EmergencyCategoryTable';
import EmergencyCategoryForm from '@/components-page/emergency-category/EmergencyCategoryForm';
import EmergencySubCategoryForm from '@/components-page/emergency-category/subcategory/EmergencySubCategoryForm';

import { GET_ALL_EMERGENCY_CATEGORIES } from '@/graphql/queries/emergencyCategoryQueries';
import { GET_SUBCATEGORIES_BY_CATEGORY } from '@/graphql/queries/emergencySubCategoryQueries';
import {
  CREATE_EMERGENCY_CATEGORY,
  UPDATE_EMERGENCY_CATEGORY,
  DELETE_EMERGENCY_CATEGORY,
} from '@/graphql/mutations/emergencyCategoryMutations';
import {
  CREATE_EMERGENCY_SUBCATEGORY,
  UPDATE_EMERGENCY_SUBCATEGORY,
  DELETE_EMERGENCY_SUBCATEGORY,
} from '@/graphql/mutations/emergencySubCategoryMutations';

import {
  EmergencyCategory,
  CreateEmergencyCategoryVars,
  UpdateEmergencyCategoryVars,
} from '@/graphql/types/emergencyCategory';
import {
  EmergencySubCategory,
  CreateEmergencySubCategoryVars,
  UpdateEmergencySubCategoryVars,
} from '@/graphql/types/emergencySubCategory';

export default function EmergencyCategoriesPage() {
  // — Category list and search state
  const { data, refetch } = useQuery(GET_ALL_EMERGENCY_CATEGORIES);
  const categories: EmergencyCategory[] = data?.emergencyCategories || [];
  const [searchTerm, setSearchTerm] = useState<string>('');
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // — Subcategory cache (keyed by categoryId)
  const [subcategories, setSubcategories] = useState<Record<string, EmergencySubCategory[]>>({});

  // — Category form state
  const [isCategoryFormOpen, setCategoryFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<EmergencyCategory | null>(null);

  // — Subcategory form state
  const [isSubFormOpen, setSubFormOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [editingSubCategory, setEditingSubCategory] = useState<EmergencySubCategory | null>(null);

  // — Category mutations
  const [createCategory] = useMutation(CREATE_EMERGENCY_CATEGORY);
  const [updateCategory] = useMutation(UPDATE_EMERGENCY_CATEGORY);
  const [deleteCategory] = useMutation(DELETE_EMERGENCY_CATEGORY);

  // — Subcategory mutations
  const [createSubCategory] = useMutation(CREATE_EMERGENCY_SUBCATEGORY);
  const [updateSubCategory] = useMutation(UPDATE_EMERGENCY_SUBCATEGORY);
  const [deleteSubCategory] = useMutation(DELETE_EMERGENCY_SUBCATEGORY);

  // — Fetch subcategories for a given category and update local state
  const fetchAndCacheSubcategories = async (categoryId: number) => {
    const { data } = await client.query({
      query: GET_SUBCATEGORIES_BY_CATEGORY,
      variables: { categoryId },
      fetchPolicy: 'network-only',
    });
    const list: EmergencySubCategory[] = data?.subCategoriesByCategoryId || [];
    setSubcategories(prev => ({ ...prev, [String(categoryId)]: list }));
    return list;
  };

  // — Category CRUD handlers
  const openNewCategoryForm = () => {
    setEditingCategory(null);
    setCategoryFormOpen(true);
  };
  const handleCategoryEdit = (cat: EmergencyCategory) => {
    setEditingCategory(cat);
    setCategoryFormOpen(true);
  };
  const handleCategoryDelete = async (id: string) => {
    await deleteCategory({ variables: { id: parseInt(id, 10) } });
    await refetch();
  };
  const handleCategorySubmit = async (
    vars: CreateEmergencyCategoryVars | UpdateEmergencyCategoryVars
  ) => {
    if ('id' in vars) {
      await updateCategory({
        variables: { id: parseInt(vars.id, 10), input: vars.input },
      });
    } else {
      await createCategory({ variables: vars });
    }
    await refetch();
    setCategoryFormOpen(false);
  };

  // — Subcategory CRUD handlers
  const openNewSubForm = (categoryId: string) => {
    const cid = parseInt(categoryId, 10);
    setSelectedCategoryId(cid);
    setEditingSubCategory(null);
    setSubFormOpen(true);
  };
  const handleSubcategoryEdit = (sub: EmergencySubCategory) => {
    setSelectedCategoryId(sub.emergencyCategoryId);
    setEditingSubCategory(sub);
    setSubFormOpen(true);
  };
  const handleSubcategoryDelete = async (sub: EmergencySubCategory) => {
    await deleteSubCategory({ variables: { id: parseInt(sub.id, 10) } });
    if (sub.emergencyCategoryId != null) {
      await fetchAndCacheSubcategories(sub.emergencyCategoryId);
    }
  };
  const handleSubFormSubmit = async (
    vars: CreateEmergencySubCategoryVars | UpdateEmergencySubCategoryVars
  ) => {
    if ('id' in vars) {
      await updateSubCategory({
        variables: {
          id: parseInt(vars.id, 10),
          input: vars.input,
          image: null,
        },
      });
    } else {
      await createSubCategory({ variables: { input: vars.input, image: null } });
    }
    if (selectedCategoryId != null) {
      await fetchAndCacheSubcategories(selectedCategoryId);
    }
    setSubFormOpen(false);
    setEditingSubCategory(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 items-center">
        <h1 className="text-xl font-semibold">Emergency Categories</h1>
        <div className="justify-self-center w-full max-w-md">
          <DebouncedSearchBar
            onSearch={setSearchTerm}
            placeholder="Search categories..."
          />
        </div>
        <div className="justify-self-end">
          <AddButton onClick={openNewCategoryForm} />
        </div>
      </div>

      <EmergencyCategoryTable
        categories={filteredCategories}
        subcategories={subcategories}
        setSubcategories={setSubcategories}
        onExpand={cid => fetchAndCacheSubcategories(parseInt(cid, 10))}
        onEdit={handleCategoryEdit}
        onDelete={handleCategoryDelete}
        onAddSubcategory={openNewSubForm}
        onEditSubcategory={handleSubcategoryEdit}
        onDeleteSubcategory={handleSubcategoryDelete}
      />

      {/* Category Modal */}
      <EmergencyCategoryForm
        isOpen={isCategoryFormOpen}
        onClose={() => setCategoryFormOpen(false)}
        onSubmit={handleCategorySubmit}
        initialData={editingCategory || undefined}
      />

      {/* Subcategory Modal */}
      <EmergencySubCategoryForm
        isOpen={isSubFormOpen}
        onClose={() => {
          setSubFormOpen(false);
          setEditingSubCategory(null);
        }}
        onSubmit={handleSubFormSubmit}
        initialData={editingSubCategory || undefined}
        emergencyCategoryId={String(selectedCategoryId ?? '')}
      />
    </div>
  );
}
