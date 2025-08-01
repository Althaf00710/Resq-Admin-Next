"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client";
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
} from "@/graphql/mutations/rescueVehicleMutations";

import {
  Vehicle,
  CreateRescueVehicleVars,
  UpdateRescueVehicleVars,
} from "@/graphql/types/rescueVehicle";

export default function VehiclesPage() {
  const pageSize = 10;

  // ——— 1) top-level state/hooks ———
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "Active" | "Inactive" | "On Service" | ""
  >("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [cursors, setCursors] = useState<string[]>([""]);
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // ——— 2) build the `where` object for server filtering ———
  const where = useMemo(() => {
    const w: any = {};
    if (searchTerm) w.plateNumber = { contains: searchTerm };
    if (statusFilter) w.status = { eq: statusFilter };
    if (categoryFilter)
      w.rescueVehicleCategoryId = { eq: parseInt(categoryFilter, 10) };
    return Object.keys(w).length ? w : null;
  }, [searchTerm, statusFilter, categoryFilter]);

  // ——— 3) run the paginated + filtered query ———
  const { data, loading, error, refetch } = useQuery(GET_RESCUE_VEHICLES, {
    variables: { first: pageSize, after: null, where },
    notifyOnNetworkStatusChange: true,
  });

  const [createVehicle] = useMutation<
    { createRescueVehicle: { rescueVehicle: Vehicle } },
    CreateRescueVehicleVars
  >(CREATE_RESCUE_VEHICLE);

  const [updateVehicle] = useMutation<
    { updateRescueVehicle: { rescueVehicle: Vehicle } },
    UpdateRescueVehicleVars
  >(UPDATE_RESCUE_VEHICLE);

  // ——— 4) cache endCursor per page ———
  useEffect(() => {
    if (!data) return;
    const end = data.rescueVehicles.pageInfo.endCursor;
    setCursors((prev) => {
      const next = [...prev];
      next[page] = end;
      return next;
    });
  }, [data, page]);

  // ——— 5) refetch on page or filter change ———
  useEffect(() => {
    const after = page > 1 ? cursors[page - 1] : null;
    refetch({ first: pageSize, after, where });
  }, [page, cursors, where, refetch]);

  // ——— 6) flatten edges => nodes ———
  const vehicles: Vehicle[] = useMemo(
    () => data?.rescueVehicles.edges.map((e) => e.node) ?? [],
    [data]
  );

  const totalCount = data?.rescueVehicles.totalCount ?? 0;
  const pageCount = Math.ceil(totalCount / pageSize);

  // ——— 7) loading / error ———
  if (loading && !data) return <p>Loading…</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  // ——— 8) CRUD modal handlers ———
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
      await updateVehicle({ variables: vars as UpdateRescueVehicleVars });
    } else {
      await createVehicle({ variables: vars as CreateRescueVehicleVars });
    }
    await refetch();
    setFormOpen(false);
  };

  // ——— 9) render ———
  return (
    <div className="space-y-6">
      {/* HEADER */}
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

      {/* TABLE: filters are inside the table header */}
      <VehicleTable
        vehicles={vehicles}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        onEdit={openEdit}
      />

      {/* PAGINATION */}
      <Stack spacing={2} alignItems="center">
        <Pagination
          count={pageCount}
          page={page}
          onChange={(_e, val) => setPage(val)}
          color="primary"
        />
      </Stack>

      {/* FORM MODAL */}
      <VehicleForm
        isOpen={isFormOpen}
        initialData={editingVehicle ?? undefined}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
