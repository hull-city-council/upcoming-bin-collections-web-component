import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Avatar from "@mui/joy/Avatar";
import Typography from "@mui/joy/Typography";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import Sheet from "@mui/joy/Sheet";
import { Box, LinearProgress, Stack } from "@mui/material";
import useFetch from "react-fetch-hook";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import "./styles.css";

const CollectionDays = ({ uprn }) => {
  const [open, setOpen] = useState(true);

  const { isLoading, data } = useFetch(
    `https://www.hullcc.gov.uk/api/property/bindate2/${uprn}`,
  );

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
    }),
  );

  return (
    <>
      <Box sx={{ height: 400, width: "100%" }} boxShadow={3}>
        <Modal
          aria-labelledby="modal-title"
          aria-describedby="modal-desc"
          open={open}
          onClose={() => setOpen(false)}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ModalDialog color="danger" variant="plain">
            <ModalClose variant="plain" sx={{ m: 1 }} />
            <Typography
              component="h2"
              id="modal-title"
              level="h4"
              fontWeight="lg"
              mb={1}
            >
              Missed bins on...
            </Typography>
            <Typography id="modal-desc" textColor="text.tertiary">
              We are aware that that we have not collected the bins from all the
              properties on your street. If you have been affected, please leave
              your bin out and we will return as soon as possible.
            </Typography>
          </ModalDialog>
        </Modal>
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
