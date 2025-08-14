"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";

import AddButton from "@/components/ui/button/AddButton";
import SearchBar from "@/components/ui/search/SearchBar";
import VehicleForm from "@/components-page/vehicles/VehicleForm";
import { VehicleTable } from "@/components-page/vehicles/VehicleTable";

import { GET_RESCUE_VEHICLES } from "@/graphql/queries/rescueVehicleQueries";
import {
  CREATE_RESCUE_VEHICLE,
  UPDATE_RESCUE_VEHICLE,
  DELETE_RESCUE_VEHICLE
} from "@/graphql/mutations/rescueVehicleMutations";
import { ON_VEHICLE_STATUS_CHANGED } from "@/graphql/subscriptions/rescueVehicleSubscriptions";
import {
  Vehicle,
  CreateRescueVehicleVars,
  UpdateRescueVehicleVars,
} from "@/graphql/types/rescueVehicle";

export default function VehiclesPage() {
  const pageSize = 10;

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "Active" | "Inactive" | "On Service" | ""
  >("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [cursors, setCursors] = useState<string[]>([""]);
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const where = useMemo(() => {
    const w: any = {};
    if (searchTerm) w.plateNumber = { contains: searchTerm };
    if (statusFilter) w.status = { eq: statusFilter };
    if (categoryFilter)
      w.rescueVehicleCategoryId = { eq: parseInt(categoryFilter, 10) };
    return Object.keys(w).length ? w : null;
  }, [searchTerm, statusFilter, categoryFilter]);

  const { data, loading, error, refetch } = useQuery(GET_RESCUE_VEHICLES, {
    variables: { first: pageSize, after: null, where },
    notifyOnNetworkStatusChange: true,
  });

  useSubscription(ON_VEHICLE_STATUS_CHANGED, {
    onSubscriptionData: ({ client, subscriptionData }) => {
      const updated: {
        id: string;
        status: string;
      } = subscriptionData.data?.onVehicleStatusChanged;
      if (!updated) return;

      client.cache.modify({
        id: client.cache.identify({ __typename: 'RescueVehicle', id: updated.id }),
        fields: {
          status() {
            return updated.status;
          },
        },
      });
    },
  });

  const [createVehicle] = useMutation<
    { createRescueVehicle: { rescueVehicle: Vehicle } },
    CreateRescueVehicleVars
  >(CREATE_RESCUE_VEHICLE);

  const [updateVehicle] = useMutation<
    { updateRescueVehicle: { rescueVehicle: Vehicle } },
    UpdateRescueVehicleVars
  >(UPDATE_RESCUE_VEHICLE);

  const [deleteVehicle] = useMutation<
    { deleteRescueVehicle: { success: boolean; message: string } },
    { id: number }
  >(DELETE_RESCUE_VEHICLE);

  const handleDelete = async (id: string) => {
    const resp = await deleteVehicle({ variables: { id: parseInt(id, 10) } });
    if (!resp.data?.deleteRescueVehicle.success) {
      console.error(resp.data?.deleteRescueVehicle.message);
    }
    await refetch();
  };

  useEffect(() => {
    if (!data) return;
    const end = data.rescueVehicles.pageInfo.endCursor;
    setCursors((prev) => {
      const next = [...prev];
      next[page] = end;
      return next;
    });
  }, [data, page]);

  useEffect(() => {
    const after = page > 1 ? cursors[page - 1] : null;
    refetch({ first: pageSize, after, where });
  }, [page, cursors, where, refetch]);

  const vehicles: Vehicle[] = useMemo(
    () => data?.rescueVehicles.edges.map((e) => e.node) ?? [],
    [data]
  );

  const totalCount = data?.rescueVehicles.totalCount ?? 0;
  const pageCount = Math.ceil(totalCount / pageSize);

  if (loading && !data) return <p>Loading…</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  const openNew = () => {
    setEditingVehicle(null);
    setFormOpen(true);
  };
  const openEdit = (id: string) => {
    const v = vehicles.find((v) => v.id === id);
    if (v) {
      setEditingVehicle(v);
      setFormOpen(true);
    }
  };
  const handleFormSubmit = async (
    vars: CreateRescueVehicleVars | UpdateRescueVehicleVars
  ) => {
    if ("id" in vars) {
      const updateVars: UpdateRescueVehicleVars = {
        id: parseInt(vars.id, 10),
        input: vars.input
      }
      await updateVehicle({ variables: updateVars });
    } else {
      await createVehicle({ variables: vars as CreateRescueVehicleVars });
    }
    await refetch();
    setFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 items-center">
        <h1 className="text-xl font-semibold">
          Rescue Vehicles <span className="text-gray-500">({totalCount})</span>
        </h1>
        <SearchBar
          onSearch={setSearchTerm}
          placeholder="Search code or plate…"
        />
        <div className="justify-self-end">
          <AddButton onClick={openNew} />
        </div>
      </div>

      <VehicleTable
        vehicles={vehicles}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <Stack spacing={2} alignItems="center">
        <Pagination
          count={pageCount}
          page={page}
          onChange={(_e, val) => setPage(val)}
          color="primary"
        />
      </Stack>

      <VehicleForm
        isOpen={isFormOpen}
        initialData={editingVehicle ?? undefined}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
