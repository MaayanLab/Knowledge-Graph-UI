'use client'
import { Button } from "@mui/material"
import { 
	GridColDef, 
	GridRenderCellParams, 
	DataGrid,
	GridToolbarContainer,
	GridToolbarQuickFilter
} from "@mui/x-data-grid"
import DownloadIcon from '@mui/icons-material/Download';
import Link from "next/link";

const network_header: GridColDef[] = [
    {
        field: 'name',
        headerName: "Network type",
        flex: 1,
        // style: {flexDirection: "row"},
        align: "left"
    },
	{
        field: 'nodes',
        headerName: "Nodes",
        flex: 1,
        // style: {flexDirection: "row"},
        align: "left"
    },
    {
        field: 'edges',
        headerName: "Edges",
        flex: 1,
        align: "left"
    },
    {
        field: 'size',
        headerName: "File size",
        align: "left",
    },
    {
        field: 'zip',
        headerName: "Download",
        align: "left",
		renderCell: (params: GridRenderCellParams<any, String>) => (
			<Link href={params.value}>
			<Button
				size="small"
				color="secondary"
			>
				<DownloadIcon/>
			</Button>
			</Link>
		),
    },
    
]

const benchmark_header: GridColDef[] = [
    {
        field: 'resource',
        headerName: "Resource",

        // style: {flexDirection: "row"},
        align: "left"
    },
	{
        field: 'library',
        flex: 1,
        headerName: "Library",
        align: "left"
    },
    {
        field: 'size',
        headerName: "File size",
        align: "left"
    },
    {
        field: 'url',
        headerName: "Download",
        align: "left",
		renderCell: (params: GridRenderCellParams<any, String>) => (
			<Link href={params.value}>
			<Button
				size="small"
				color="secondary"
			>
				<DownloadIcon/>
			</Button>
			</Link>
		),
    }
]

const rummageo_header: GridColDef[] = [
    {
        field: 'resource',
        headerName: "Resource",
        flex: 1,
        // style: {flexDirection: "row"},
        align: "left"
    },
    {
        field: 'size',
        headerName: "File size",
        align: "left"
    },
    {
        field: 'url',
        headerName: "Download",
        align: "left",
		renderCell: (params: GridRenderCellParams<any, String>) => (
			<Link href={params.value}>
			<Button
				size="small"
				color="secondary"
			>
				<DownloadIcon/>
			</Button>
			</Link>
		),
    }
]

const notebook_header: GridColDef[] = [
    {
        field: 'title',
        headerName: "Notebook",
        flex: 1,
        // style: {flexDirection: "row"},
        align: "left"
    },
    {
        field: 'description',
        headerName: "Description",
        flex: 1,
        // style: {flexDirection: "row"},
        align: "left"
    },
    {
        field: 'size',
        headerName: "File size",
        align: "left"
    },
    {
        field: 'updated',
        headerName: "Last Updated",
        align: "left",
		minWidth: 120
    },
    {
        field: 'url',
        headerName: "Download",
        align: "left",
		renderCell: (params: GridRenderCellParams<any, String>) => (
			<Link href={params.value}>
			<Button
				size="small"
				color="secondary"
			>
				<DownloadIcon/>
			</Button>
			</Link>
		),
    }
]

export function CustomToolbar() {
    return (
      <GridToolbarContainer sx={{padding: 2}}>
        <GridToolbarQuickFilter variant="outlined" placeholder="Search Results"/>
      </GridToolbarContainer>
    );
  }

  const headers = {
	network: network_header,
	benchmark: benchmark_header,
	rummageo: rummageo_header,
	notebook: notebook_header,
  }
  const ClientSide = ({download, type}: {download: Array<{
    name: string,
	nodes: number,
	edges: number,
	zip: string,
	size: string
}> | Array<{
	resource: string,
	url: string,
	size: string
}> | Array<{
    title: string,
    description: string,
    size: string,
    updated: string,
    url: string
}>
type: 'network' | 'rummageo' | 'notebook'
}) => {
	
	return (
		<DataGrid
				//components={{ Toolbar: CustomToolbar }}
				sortingOrder={['desc', 'asc']}
				rows={download}
				columns={headers[type]}
				autoPageSize
				disableColumnMenu
				autoHeight
				pageSize={10}
				//rowsPerPageOptions={[5, 10, 25]}
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
					border: 0
				}}
			/>
	)
}

export default ClientSide