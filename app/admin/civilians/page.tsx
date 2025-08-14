"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";

import SearchBar from "@/components/ui/search/SearchBar";
import CiviliansTable from "@/components-page/civilians/CiviliansTable";
import { Civilian } from "@/graphql/types/civilian";
import { GET_CIVILIANS } from "@/graphql/queries/civilianQueries";
import {
  RESTRICT_CIVILIAN,
  UNRESTRICT_CIVILIAN,
} from "@/graphql/mutations/civilianMutations";
import {
  RestrictCivilianResp,
  RestrictCivilianVars,
  UnrestrictCivilianResp,
  UnrestrictCivilianVars,
} from "@/graphql/types/civilian";

export default function CiviliansPage() {
  const pageSize = 10;

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [cursors, setCursors] = useState<string[]>([""]);

  const where = useMemo(() => {
    const w: any = {};
    if (searchTerm) w.name = { contains: searchTerm };
    return Object.keys(w).length ? w : null;
  }, [searchTerm]);

  const { data, loading, error, refetch, client } = useQuery(GET_CIVILIANS, {
    variables: { first: pageSize, after: null, where },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (!data) return;
    const end = data.civilians.pageInfo.endCursor;
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

  const civilians: Civilian[] = useMemo(
    () => data?.civilians.edges.map((e: any) => e.node) ?? [],
    [data]
  );

  const totalCount = data?.civilians.totalCount ?? 0;
  const pageCount = Math.ceil(totalCount / pageSize);

  // Mutations
  const [restrictCivilian] = useMutation<RestrictCivilianResp, RestrictCivilianVars>(
    RESTRICT_CIVILIAN
  );
  const [unrestrictCivilian] = useMutation<UnrestrictCivilianResp, UnrestrictCivilianVars>(
    UNRESTRICT_CIVILIAN
  );

  const onRestrictToggle = async (civ: Civilian, nextState: boolean) => {
    const idNum = parseInt(civ.id, 10);

    const identify = client.cache.identify({ __typename: "Civilian", id: civ.id });

    const updateIsRestrict = (val: boolean) =>
      client.cache.modify({
        id: identify,
        fields: {
          isRestrict() {
            return val;
          },
        },
      });

    try {
      if (nextState) {
        await restrictCivilian({
          variables: { id: idNum },
          optimisticResponse: { restrictCivilian: { success: true, message: "Restricted", __typename: "RestrictCivilianPayload" as any } },
          update: () => updateIsRestrict(true),
        });
      } else {
        await unrestrictCivilian({
          variables: { id: idNum },
          optimisticResponse: { unrestrictCivilian: { success: true, message: "Unrestricted", __typename: "UnrestrictCivilianPayload" as any } },
          update: () => updateIsRestrict(false),
        });
      }
    } catch (e) {
      // fallback: refetch to restore server truth if something went wrong
      await refetch();
    }
  };

  if (loading && !data) return <p>Loading…</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 items-center">
        <h1 className="text-xl font-semibold">
          Civilians <span className="text-gray-500">({totalCount})</span>
        </h1>
        <SearchBar onSearch={setSearchTerm} placeholder="Search by name…" />
        <div />
      </div>

      <CiviliansTable civilians={civilians} onRestrictToggle={onRestrictToggle} />

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
