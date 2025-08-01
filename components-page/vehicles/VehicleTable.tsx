'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@apollo/client';

import DeleteButton from '@/components/ui/button/DeleteButton';
import EditButton   from '@/components/ui/button/EditButton';
import LocationButton from '@/components/ui/button/LocationButton';
import HeaderSelect, { HeaderOption } from '@/components/ui/select/HeaderSelect';

import { GET_RESCUE_VEHICLE_CATEGORIES } from '@/graphql/queries/rescueVehicleCategoryQueries';
import { RescueVehicleCategory }        from '@/graphql/types/rescueVehicleCategory';
import { Vehicle }                      from '@/graphql/types/rescueVehicle';
import { VehicleLocationRow }           from './VehicleLocationRow';

interface Props {
  vehicles: Vehicle[];
  statusFilter: string;
  onStatusFilterChange: (v: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (v: string) => void;
  onEdit: (vehicleId: string) => void;
}

const statusOptions: HeaderOption[] = [
  { value: '',        label: 'All',        colorClass: 'bg-gray-400'  },
  { value: 'Active',     label: 'Active',     colorClass: 'bg-green-500' },
  { value: 'Inactive',   label: 'Inactive',   colorClass: 'bg-red-500'   },
  { value: 'On Service', label: 'On Service', colorClass: 'bg-yellow-500' },
];

export const VehicleTable: React.FC<Props> = ({
  vehicles,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  onEdit,
}) => {
  // fetch categories
  const { data: catData } = useQuery<{
    rescueVehicleCategories: RescueVehicleCategory[];
  }>(GET_RESCUE_VEHICLE_CATEGORIES);

  // build category dropdown
  const categoryOptions: HeaderOption[] = useMemo(() => {
    const cats = catData?.rescueVehicleCategories ?? [];
    return [
      { value: '', label: 'All', colorClass: 'bg-gray-400' },
      ...cats.map(c => ({
        value: c.id,
        label: c.name,
        colorClass: 'bg-blue-300',
      })),
    ];
  }, [catData]);

  const [ expandedId, setExpandedId ] = useState<string|null>(null);

  const statusStyles: Record<Vehicle['status'], string> = {
    Active:       'text-green-700 bg-green-100',
    Inactive:     'text-red-700 bg-red-100',
    'On Service': 'text-yellow-700 bg-yellow-100',
  };

  const toggleLocation = (id: string) =>
    setExpandedId(prev => prev === id ? null : id);

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-300 text-gray-800">
          <tr>
            <th className="px-4 py-3 font-semibold">Code</th>
            <th className="px-4 py-3 font-semibold">Plate Number</th>
            <th className="px-4 py-3">
              <HeaderSelect
                options={categoryOptions}
                selectedValue={categoryFilter}
                onChange={onCategoryFilterChange}
                buttonLabel="Category"
              />
            </th>
            <th className="px-4 py-3 text-center">
              <HeaderSelect
                options={statusOptions}
                selectedValue={statusFilter}
                onChange={onStatusFilterChange}
                buttonLabel="Status"
              />
            </th>
            <th className="px-4 py-3 text-center font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {vehicles.map(v => (
            <React.Fragment key={v.id}>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2 font-medium uppercase">{v.code}</td>
                <td className="px-4 py-2 uppercase">{v.plateNumber}</td>
                <td className="px-4 py-2">{v.rescueVehicleCategory.name}</td>
                <td className="px-4 py-2 text-center">
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full font-semibold ${
                      statusStyles[v.status]
                    }`}
                  >
                    {v.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-right space-x-2">
                  <LocationButton onClick={() => toggleLocation(v.id)} label="View" />
                  <EditButton     onClick={() => onEdit(v.id)} />
                  <DeleteButton   onClick={() => onEdit(v.id)} /> 
                </td>
              </tr>
              <AnimatePresence>
                {expandedId === v.id && (
                  <motion.tr
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit   ={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td colSpan={5} className="p-0 bg-gray-50">
                      <VehicleLocationRow vehicleId={v.id} />
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
};
