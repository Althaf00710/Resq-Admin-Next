'use client';

import React, { useMemo, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import AddButton from '@/components/ui/button/AddButton';
import GooLoader from '@/components/ui/Loader';
import FirstAidCard from '@/components-page/firstaids/FirstAidCard';
import FirstAidDetailForm from '@/components-page/firstaids/FirstAidModal';
import { X, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { GET_ALL_FIRST_AID_DETAILS } from '@/graphql/queries/firstAidDetailQueries';
import { CreateFirstAidDetailVars, UpdateFirstAidDetailVars } from '@/graphql/types/firstAidDetail';
import { CREATE_FIRST_AID_DETAIL, UPDATE_FIRST_AID_DETAIL, DELETE_FIRST_AID_DETAIL } from '@/graphql/mutations/firstAidDetailMutations';
import { FirstAidDetail } from '@/graphql/types/firstAidDetail';

const BASE_URL = (process.env.NEXT_PUBLIC_SERVER_URL || '').replace(/\/+$/, '');
const resolveImageUrl = (url?: string) => {
  if (!url) return '';
  if (/^(?:https?:)?\/\//i.test(url) || url.startsWith('data:')) return url;
  if (!BASE_URL) return url;
  return url.startsWith('/') ? `${BASE_URL}${url}` : `${BASE_URL}/${url}`;
};

function GroupStackCard({
  items,
  onOpen,
}: {
  items: FirstAidDetail[];
  onOpen: () => void;
}) {
  const top = items[0];
  const previews = items.slice(0, 3);

  return (
    <button
      onClick={onOpen}
      className="relative w-full text-left"
      aria-label={`Open ${top.emergencySubCategory?.name || ''} steps`}
    >
      <div className="pointer-events-none">
        {previews.map((d, i) => {
          if (i === previews.length - 1) return null;
          const depth = previews.length - i - 1;
          const translate = depth * 10;
          const rotate = depth * -2;
          return (
            <div
              key={`back-${d.id}`}
              className="absolute inset-0 rounded-2xl border border-gray-200 bg-white shadow-md"
              style={{
                transform: `translate(${translate}px, ${translate}px) rotate(${rotate}deg)`,
                zIndex: i,
                overflow: 'hidden',
              }}
            >
              <div className="relative w-full pt-[56%] bg-gray-100">
                <img
                  src={resolveImageUrl(d.imageUrl)}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-90"
                  loading="lazy"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative" style={{ zIndex: previews.length }}>
        <FirstAidCard detail={top} />
      </div>

      {items.length > 1 && (
        <span className="absolute -bottom-2 left-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-700 shadow">
          {items.length} steps
        </span>
      )}
    </button>
  );
}

function FirstAidGalleryModal({
  open,
  onClose,
  items,
  onAdd,
  onEdit,
  onDelete,
}: {
  open: boolean;
  onClose: () => void;
  items: FirstAidDetail[];
  onAdd?: (nextDisplayOrder: number) => void; // ⬅️ next order callback
  onEdit?: (d: FirstAidDetail) => void;
  onDelete?: (d: FirstAidDetail) => void;
}) {
  if (!open) return null;

  const nextDisplayOrder =
    items.length > 0 ? Math.max(...items.map((i) => i.displayOrder)) + 1 : 1;

  const title = items[0]?.emergencySubCategory?.name || 'First Aid';

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/60">
      <div className="relative mx-auto w-full max-w-6xl grow overflow-y-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="rounded-2xl bg-white p-4 shadow-xl dark:bg-neutral-900"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {title}
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({items.length} steps)
              </span>
            </div>
            <button
              onClick={onClose}
              className="rounded-full bg-gray-100 p-2 text-gray-700 shadow hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-200"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 xxl:grid-cols-5">
            {items.map((it) => (
              <motion.div
                key={it.id}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <FirstAidCard
                  detail={it}
                  variant="grid"
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </motion.div>
            ))}

            {/* dashed add card */}
            <button
              onClick={() => onAdd?.(nextDisplayOrder)} // ⬅️ pass next order
              className="group flex w-full flex-col rounded-2xl border-2 border-dashed border-gray-300 bg-white p-4 text-left shadow-sm transition hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <div className="relative w-full rounded-xl bg-gray-50 pt-[56%]">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <Plus className="h-8 w-8 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">
                    Add next step
                  </span>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600">
                Click to add a new instruction
              </div>
            </button>
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
}

export default function FirstAidsPage() {
  const { data, loading, error, refetch } = useQuery(GET_ALL_FIRST_AID_DETAILS);
  const [createDetail] = useMutation(CREATE_FIRST_AID_DETAIL);
  const [updateDetail] = useMutation(UPDATE_FIRST_AID_DETAIL);
  const [deleteDetail] = useMutation(DELETE_FIRST_AID_DETAIL);

  const details: FirstAidDetail[] = data?.firstAidDetails || [];

  const groups = useMemo(() => {
    const map = new Map<string, { name: string; items: FirstAidDetail[] }>();
    details.forEach((d) => {
      const key = String(d.emergencySubCategoryId);
      const name = d.emergencySubCategory?.name || '';
      if (!map.has(key)) map.set(key, { name, items: [] });
      map.get(key)!.items.push(d);
    });
    const arr = Array.from(map, ([id, g]) => ({
      id,
      name: g.name,
      items: g.items.sort((a, b) => a.displayOrder - b.displayOrder),
    }));
    return arr;
  }, [details]);

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryItems, setGalleryItems] = useState<FirstAidDetail[]>([]);
  const [modalCategoryId, setModalCategoryId] = useState<string | undefined>();
  const [pendingDisplayOrder, setPendingDisplayOrder] = useState<number | undefined>(undefined);

  const openGallery = (items: FirstAidDetail[], categoryId?: string) => {
    setGalleryItems(items);
    setModalCategoryId(categoryId);
    setGalleryOpen(true);
  };

  const [isFormOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<FirstAidDetail | null>(null);
  const [activeCategoryForCreate, setActiveCategoryForCreate] = useState<string | undefined>();

  // accept optional nextDisplayOrder (from modal dashed card)
  const handleAdd = (categoryId?: string, nextDisplayOrder?: number) => {
    setEditing(null);
    setActiveCategoryForCreate(categoryId);
    setPendingDisplayOrder(nextDisplayOrder);
    setFormOpen(true);
  };

  const handleEditClick = (d: FirstAidDetail) => {
    setEditing(d);
    setActiveCategoryForCreate(String(d.emergencySubCategoryId));
    setFormOpen(true);
    setGalleryOpen(false);
  };

  const handleDeleteClick = async (d: FirstAidDetail) => {
    try {
      await deleteDetail({ variables: { id: parseInt(d.id, 10) } });
      await refetch();
    } catch (err) {
      console.error('Failed to delete first-aid step:', err);
    }
  };

  const handleFormSubmit = async (
    payload: CreateFirstAidDetailVars | UpdateFirstAidDetailVars
  ) => {
    try {
      if ('id' in payload) {
        await updateDetail({
          variables: {
            id: parseInt(payload.id as unknown as string, 10),
            firstAidDetail: payload.firstAidDetail,      // ⬅️ updated var name
            image: payload.image ?? null,
          },
        });
      } else {
        await createDetail({
          variables: {
            firstAidDetail: payload.firstAidDetail,      // ⬅️ include displayOrder, etc.
            image: payload.image ?? null,
          },
        });
      }
      await refetch();
      setFormOpen(false);
      setEditing(null);
      setPendingDisplayOrder(undefined);
    } catch (err) {
      console.error('Failed to submit form:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative mb-4 flex h-12 w-full items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-700">First Aids</h1>
        <div className="ml-auto flex w-32 justify-end">
          <AddButton onClick={() => handleAdd()} />
        </div>
      </div>

      {loading && <GooLoader />}
      {error && <p className="text-red-500">Error fetching first aid details.</p>}

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 xxl:grid-cols-5">
        {groups.map((g) => (
          <div key={g.id} className="relative">
            <div className="mb-2 text-sm font-medium text-gray-600">{g.name}</div>
            {g.items.length > 1 ? (
              <GroupStackCard items={g.items} onOpen={() => openGallery(g.items, g.id)} />
            ) : (
              <button className="w-full text-left" onClick={() => openGallery(g.items, g.id)}>
                <FirstAidCard detail={g.items[0]} />
              </button>
            )}

            <div className="mt-2 text-right">
              <button
                onClick={() =>
                  // (optional) also compute next order for group "Add step" on page
                  handleAdd(
                    g.id,
                    (g.items.length ? g.items[g.items.length - 1].displayOrder : 0) + 1
                  )
                }
                className="rounded-full border border-gray-300 px-3 py-1 text-xs hover:bg-gray-100"
              >
                Add step
              </button>
            </div>
          </div>
        ))}
      </div>

      <FirstAidGalleryModal
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        items={galleryItems}
        onAdd={(next) => handleAdd(modalCategoryId, next)} // ⬅️ pass nextDisplayOrder from modal
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      <FirstAidDetailForm
        isOpen={isFormOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editing || undefined}
        emergencySubCategoryId={activeCategoryForCreate}
        defaultDisplayOrder={pendingDisplayOrder} // ⬅️ form will include this on create
      />
    </div>
  );
}
