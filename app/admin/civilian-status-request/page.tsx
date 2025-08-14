"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";

import SearchBar from "@/components/ui/search/SearchBar";
import CivilianRequestTable from "@/components-page/civilian-status-request/CivilianRequestTable";
import { GET_CIVILIAN_STATUS_REQUESTS } from "@/graphql/queries/civilianStatusRequestQueries";
import { UPDATE_CIVILIAN_STATUS_REQUEST } from "@/graphql/mutations/civilianStatusRequestMutations";
import { CivilianStatusRequest } from "@/graphql/types/civilianStatusRequest";

export default function CivilianStatusRequestsPage() {
  const pageSize = 10;

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(""); // '', 'Pending', 'Approved', 'Rejected'
  const [page, setPage] = useState(1);
  const [cursors, setCursors] = useState<string[]>([""]);

  // Build filter: search by numeric id OR name/requestedRole/status + header status filter
  const where = useMemo(() => {
    const or: any[] = [];
    const term = searchTerm.trim();

    if (term) {
      // ONLY include id filter if term is an integer
      if (/^\d+$/.test(term)) {
        or.push({ id: { eq: Number(term) } });
      }
      // text searches
      or.push({ civilian: { name: { contains: term } } });
      or.push({ civilianStatus: { role: { contains: term } } });
      or.push({ status: { contains: term } });
    }

    let filter: any = or.length ? { or } : null;

    if (statusFilter) {
      const statusEq = { status: { eq: statusFilter } };
      filter = filter ? { and: [filter, statusEq] } : statusEq;
    }

    return filter;
  }, [searchTerm, statusFilter]);

  const { data, loading, error, refetch, client } = useQuery(
    GET_CIVILIAN_STATUS_REQUESTS,
    {
      variables: { first: pageSize, after: null, where },
      notifyOnNetworkStatusChange: true,
    }
  );

  // reset pagination when filters change
  useEffect(() => {
    setPage(1);
    setCursors([""]);
  }, [searchTerm, statusFilter]);

  // Remember endCursor for each visited page
  useEffect(() => {
    if (!data) return;
    const end = data.civilianStatusRequests.pageInfo.endCursor;
    setCursors((prev) => {
      const next = [...prev];
      next[page] = end;
      return next;
    });
  }, [data, page]);

  // Refetch when page/search/filter changes
  useEffect(() => {
    const after = page > 1 ? cursors[page - 1] : null;
    refetch({ first: pageSize, after, where });
  }, [page, cursors, where, refetch]);

  const requests: CivilianStatusRequest[] =
    data?.civilianStatusRequests.edges.map((e: any) => e.node) ?? [];

  const totalCount = data?.civilianStatusRequests.totalCount ?? 0;
  const pageCount = Math.ceil(totalCount / pageSize);

  // Approve / Reject
  const [updateRequest] = useMutation(UPDATE_CIVILIAN_STATUS_REQUEST);

  const updateStatusLocally = (reqId: number, newStatus: "Approved" | "Rejected") => {
    const cacheId = client.cache.identify({ __typename: "CivilianStatusRequest", id: reqId });
    if (!cacheId) return;
    client.cache.modify({
      id: cacheId,
      fields: {
        status: () => newStatus,
        updatedAt: () => new Date(),
      },
    });
  };

  const onApprove = async (req: CivilianStatusRequest) => {
    const idNum = Number(req.id);
    if (!Number.isFinite(idNum)) return; // safeguard
    try {
      await updateRequest({
        variables: { id: idNum, input: { status: "Approved" } },
        optimisticResponse: {
          updateCivilianStatusRequest: {
            __typename: "UpdateCivilianStatusRequestPayload",
            success: true,
            message: "Approved",
            civilianStatusRequest: {
              __typename: "CivilianStatusRequest",
              id: idNum,
              status: "Approved",
              civilianId: req.civilianId,
              civilianStatusId: req.civilianStatusId,
              proofImage: req.proofImage,
              createdAt: req.createdAt,
              updatedAt: new Date(),
            },
          },
        },
        update: () => updateStatusLocally(idNum, "Approved"),
      });
    } catch {
      await refetch();
    }
  };

  const onReject = async (req: CivilianStatusRequest) => {
    const idNum = Number(req.id);
    if (!Number.isFinite(idNum)) return; // safeguard
    try {
      await updateRequest({
        variables: { id: idNum, input: { status: "Rejected" } },
        optimisticResponse: {
          updateCivilianStatusRequest: {
            __typename: "UpdateCivilianStatusRequestPayload",
            success: true,
            message: "Rejected",
            civilianStatusRequest: {
              __typename: "CivilianStatusRequest",
              id: idNum,
              status: "Rejected",
              civilianId: req.civilianId,
              civilianStatusId: req.civilianStatusId,
              proofImage: req.proofImage,
              createdAt: req.createdAt,
              updatedAt: new Date(),
            },
          },
        },
        update: () => updateStatusLocally(idNum, "Rejected"),
      });
    } catch {
      await refetch();
    }
  };

  if (loading && !data) return <p>Loading…</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 items-center">
        <h1 className="text-xl font-semibold">
          Civilian Status Requests <span className="text-gray-500">({totalCount})</span>
        </h1>

        <SearchBar
          onSearch={setSearchTerm}
          placeholder="Search by ID, name, requested role"
        />

        <div />
      </div>

      <CivilianRequestTable
        requests={requests}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onApprove={onApprove}
        onReject={onReject}
      />

      <Stack spacing={2} alignItems="center">
        <Pagination
          count={pageCount}
          page={page}
          onChange={(_e, val) => setPage(val)}
          color="primary"
        />
      </Stack>
    </div>
  );
}
