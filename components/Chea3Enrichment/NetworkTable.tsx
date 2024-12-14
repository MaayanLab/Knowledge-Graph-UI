'use client'
import { Stack } from "@mui/material";
import { 
    DataGrid,
    GridColDef,
    GridToolbarContainer,
    GridToolbarQuickFilter,
    GridToolbarExport,
} from "@mui/x-data-grid";
const header: GridColDef[] = [
    {
        field: 'label',
        headerName: "Term",
        //flex: 1,
        // style: {flexDirection: "row"},
        align: "left"
    },
    {
        field: 'kind',
        flex: 1,
        headerName: "Kind",
        align: "left"
    },
    {
        field: 'uri',
        headerName: "uri",
        flex: 2,
        align: "left"
    },
    {
        field: 'score',
        headerName: "score",
        align: "left"
    },
    {
        field: 'overlap',
        headerName: "overlapping genes",
        align: "left"
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