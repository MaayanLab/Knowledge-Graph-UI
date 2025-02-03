'use client'
import { Button, Dialog, DialogContent, DialogContentText, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import { 
    DataGrid,
    GridColDef,
    GridToolbarContainer,
    GridToolbarQuickFilter,
    GridToolbarExport,
} from "@mui/x-data-grid";
import { useState } from "react";
const header: GridColDef[] = [
    {
        field: 'enrichr_label',
        headerName: "Term",
        flex: 1,
        // style: {flexDirection: "row"},
        align: "left"
    },
	{
        field: 'library',
        headerName: "Library",
        flex: 1,
        // style: {flexDirection: "row"},
        align: "left"
    },
    {
        field: 'pval',
        headerName: "p-value",
        align: "left"
    },
    {
        field: 'qval',
        headerName: "q-value",
        align: "left"
    },
    {
        field: 'zscore',
        headerName: "z-score",
        align: "left"
    },
    {
        field: 'combined_score',
        headerName: "combined score",
        align: "left"
    },
    {
        field: 'overlapping_set',
        headerName: "overlaps",
        align: "left",
        valueGetter: ({row})=>{
            return row.overlapping_set.join(";")
        },
        renderCell: ({row})=>{
            const [open, setOpen] = useState(false)
            return <><Button variant="outlined" color="secondary" onClick={()=>setOpen(!open)}><Typography>{row.overlap}</Typography></Button>
                    <Dialog
                        open={open}
                        onClose={()=>setOpen(false)}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle><Typography variant="h4">Overlaps</Typography></DialogTitle>
                        <DialogContent>
                            <TextField
                            value={row.overlapping_set.join("\n")}
                            multiline
                            />
                        </DialogContent>
                    </Dialog>
                </>
        }
    }
]

export function CustomToolbar() {
    return (
      <GridToolbarContainer sx={{padding: 2}}>
        <GridToolbarQuickFilter variant="outlined" placeholder="Search Results"/>
        <GridToolbarExport sx={{color: "secondary.main"}}/>
      </GridToolbarContainer>
    );
  }


const NetworkTable = ({sorted_entries, columns}:{sorted_entries:Array<{[key:string]:any}>, columns: {[key:string]: boolean}}) => (
	<DataGrid
		components={{ Toolbar: CustomToolbar }}
		sortingOrder={['desc', 'asc']}
		rows={sorted_entries}
		columns={header.filter(i=>columns[i.field])}
		autoPageSize
		disableColumnMenu
		autoHeight
		pageSize={10}
		rowsPerPageOptions={[5, 10, 25]}
        sx={{
            '.MuiDataGrid-columnHeaders': {
                color: 'dataGrid.contrastText',
                backgroundColor: 'dataGrid.main',
                borderRadius: "1rem 1rem 0 0",
            },
            borderRadius: "0 0 4px 4px",
            '.MuiDataGrid-columnSeparator': {
                display: 'none',
            },
        }}
	/>
)

export default NetworkTable