import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Avatar from "@mui/joy/Avatar";
import Typography from "@mui/joy/Typography";
import ReportIcon from "@mui/icons-material/Report";
import Alert from "@mui/joy/Alert";
import { Box, LinearProgress, Stack } from "@mui/material";
import useFetch from "react-fetch-hook";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import "./styles.css";

const CollectionDays = ({ uprn }) => {
  const [open, setOpen] = useState(true);
  const { isLoading, data } = useFetch(
    `https://prod-27.westeurope.logic.azure.com/workflows/287131afe7b24a33aa0cb07c7b6ddce5/triggers/manual/paths/invoke/uprn/${uprn}?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=XeMnYJGciF98b7ClKvpA1SXHB6jAWK5hqvCU62ih58M`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const rows = [];
  data?.collection_days.map((item, index) =>
    rows.push({
      id: index,
      type: item.collection_type,
      date: new Date(item.next_collection_date).toLocaleDateString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }),
  );

  return (
    <>
      {data?.events.street_event && (
        <Alert
          sx={{ alignItems: "flex-start", mb: 3 }}
          startDecorator={<ReportIcon />}
          variant="soft"
          color="danger"
        >
          <div>
            <div>
              Missed bins on{" "}
              <span style={{ textTransform: "capitalize" }}>
                {data?.events.street_name}
              </span>
            </div>
            <Typography level="body-sm" color="danger">
              {data?.events.message}
            </Typography>
          </div>
        </Alert>
      )}
      <Box sx={{ height: 400, width: "100%" }} boxShadow={1}>
        <DataGrid
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
                const blue = params.value === "Blue Bin";
                const black = params.value === "Black Bin";
                const brown = params.value === "Brown Bin";
                const green = params.value === "GreenCaddy";
                return (
                  <>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar
                        variant="soft"
                        color={
                          blue
                            ? "primary"
                            : black
                              ? "neutral"
                              : brown
                                ? "warning"
                                : green
                                  ? "success"
                                  : "default"
                        }
                      >
                        <DeleteOutlineIcon />
                      </Avatar>
                      <Typography level="body-md">{params.value}</Typography>
                    </Stack>
                  </>
                );
              },
            },
            { field: "date", headerName: "Date", minWidth: 100, flex: 1 },
          ]}
          slots={{
            loadingOverlay: LinearProgress,
          }}
          loading={isLoading}
        />
      </Box>
    </>
  );
};
export default CollectionDays;
