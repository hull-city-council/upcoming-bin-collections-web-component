import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, LinearProgress, Chip } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function App() {
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ["next_collection_date", "collection_type"],
    queryFn: () =>
      axios
        .get("https://www.hullcc.gov.uk/api/property/bindate2/21044210")
        .then((res) => res.data),
  });

  const rows = [];
  data?.map((item, index) =>
    rows.push({
      id: index,
      type: item.collection_type,
      date: new Date(item.next_collection_date).toLocaleDateString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    })
  );

  if (error) return "An error has occurred: " + error.message;

  return (
    <Box sx={{ height: 400, width: "100%" }} boxShadow={3}>
      <DataGrid
        pageSizeOptions={0}
        sx={{
          ".MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold !important",
            overflow: "visible !important",
          },
        }}
        rows={rows}
        columns={[
          {
            field: "type",
            headerClassName: "super-app-theme--header",
            headerName: "Bin Colour",
            minWidth: 100,
            flex: 1,
            renderCell: (params) => {
              return (
                <Chip color={params.value === "Blue Bin" ? "primary" : ""}>
                  {params.value}
                </Chip>
              );
            },
          },
          { field: "date", headerName: "Date", minWidth: 100, flex: 1 },
        ]}
        slots={{
          loadingOverlay: LinearProgress,
        }}
        loading={isPending}
      />
    </Box>
  );
}
