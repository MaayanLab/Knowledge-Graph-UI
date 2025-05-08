'use client'
import { useState, useEffect, useRef } from "react";
import { makeTemplate } from "@/utils/helper";
import { precise } from "@/utils/math";
import { Grid, Button, Tabs, Tab, Card, CardContent } from "@mui/material";
import { DataGrid, GridToolbar, GridColDef } from "@mui/x-data-grid";
import { UISchema } from "@/app/api/schema/route";
import { NetworkSchema } from "@/app/api/knowledge_graph/route";
import { CustomToolbar } from "../Enrichment/NetworkTable";

const NetworkTable = ({data, schema}: {data: NetworkSchema, schema: UISchema}) => {
	const [processedData, setProcessedData] = useState<{
		[key:string]: {
			header: Array<{field: string, headerName: string, count: number, [key: string]: string | number | {[key:string]: any}}>, 
			data: {[key: string]: {[key: string]: any}}, 
			columnVisibilityModel: {[key: string]: boolean}
		}
	} | null>(null)
	const tableRef = useRef(null)
	const [tab, setTab] = useState<null | string>(null)
	const [tabs, setTabs] = useState<Array<string>>(null)
	
	// Separate display configs for nodes and edges
	const nodeDisplay = {}
	const edgeDisplay = {}
	
	for (const i of schema.nodes) {
		nodeDisplay[i.node] = i.display
	}
	for (const i of schema.edges) {
		for (const m of i.match) {
			edgeDisplay[m] = i.display
		}
	}

	useEffect(()=>{
		if (data) {
			const processed = {}
			const node_tabs = []
			const edge_tabs = []
			
			// Process nodes first
			for (const d of data.nodes) {
				const properties = d.data
				const {kind, relation, source, target, label, ...rest} = d.data
				const key = `node_${kind}`
				
				if (kind && typeof kind === 'string') {
					if (processed[key] === undefined) {
						node_tabs.push(key)
						processed[key] = {header: [], data: {}, columnVisibilityModel: {}}
						const header = []
						const columnVisibilityModel = {}
						
						if (nodeDisplay[kind]) {
							for (const prop of nodeDisplay[kind]) {
								const field = prop.label
								columnVisibilityModel[field] = !(prop.hide)
								if (prop.type === "link") {
									header.push({
										field,
										headerName: field,
										flex: 1,
										style: {flexDirection: "row"},
										align: "left",
										text: prop.text,
										href: prop.href,
										renderCell: ({row, field})=>{
											return <Button href={row[field].href}>{row[field].text}</Button>
										},
										count: 0
									})
								} else {
									header.push({
										field,
										headerName: field,
										flex: 1,
										style: {flexDirection: "row"},
										align: "left",
										text: prop.text,
										count: 0
									})
								}
							}
						} else {
							header.push({
								field: 'label',
								headerName: "Label",
								flex: 1,
								style: {flexDirection: "row"},
								align: "left",
								type: "node",
							})
							for (const field of Object.keys(rest)) {
								const headerName = field.replaceAll(".", " ")
								header.push({
									field,
									headerName: headerName.charAt(0).toUpperCase() + headerName.slice(1),
									style: {flexDirection: "row"},
									align: "left",
									type: "node",
									count: 0
								})
							}
						}
						processed[key].header = header
						processed[key].columnVisibilityModel = columnVisibilityModel
					}
					
					// Process node data
					if (processed[key].data[properties.id] === undefined) {
						processed[key].data[properties.id] = {id: properties.id}
					}
					for (const i of processed[key].header) {
						if (i.href) {
							const val = makeTemplate(i.text, properties)
							const href = makeTemplate(i.href, properties)
							processed[key].data[properties.id][i.field] = {
								text: val === "undefined" ? "": val,
								href: href === "undefined" ? "": href
							}
							if (val !== "undefined") {
								i.count = i.count + 1
							}
						} else {
							const val = makeTemplate(i.text, properties)
							processed[key].data[properties.id][i.field] = val === "undefined" ? "": precise(val)
							if (val !== "undefined") {
								i.count = i.count + 1
							}
						}
					}
					if (processed[key].data[properties.id]["label"] === "") {
						processed[key].data[properties.id]["label"] = label
					}
				}
			}
			
			// Process edges
			for (const d of data.edges) {
				const properties = d.data
				const {kind, relation, source, target, label, ...rest} = d.data
				if (properties.id === undefined) properties.id = `${source}_${target}`
				const key = `edge_${relation}`
				
				if (relation && typeof relation === 'string') {
					if (processed[key] === undefined) {
						edge_tabs.push(key)
						processed[key] = {header: [], data: {}, columnVisibilityModel: {}}
						const header = []
						const columnVisibilityModel = {}
						
						if (edgeDisplay[relation]) {
							for (const prop of edgeDisplay[relation]) {
								const field = prop.label
								columnVisibilityModel[field] = !(prop.hide)
								if (prop.type === "link") {
									header.push({
										field,
										headerName: field,
										flex: 1,
										style: {flexDirection: "row"},
										align: "left",
										text: prop.text,
										href: prop.href,
										renderCell: ({row, field})=>{
											return <Button href={row[field].href}>{row[field].text}</Button>
										},
										count: 0
									})
								} else {
									header.push({
										field,
										headerName: field,
										flex: 1,
										style: {flexDirection: "row"},
										align: "left",
										text: prop.text,
										count: 0
									})
								}
							}
						} else {
							header.push({
								field: 'label',
								headerName: "Label",
								flex: 1,
								style: {flexDirection: "row"},
								align: "left",
								type: "edge",
							})
							for (const field of Object.keys(rest)) {
								const headerName = field.replaceAll(".", " ")
								header.push({
									field,
									headerName: headerName.charAt(0).toUpperCase() + headerName.slice(1),
									style: {flexDirection: "row"},
									align: "left",
									type: "edge",
									count: 0
								})
							}
						}
						processed[key].header = header
						processed[key].columnVisibilityModel = columnVisibilityModel
					}
					
					// Process edge data
					if (processed[key].data[properties.id] === undefined) {
						processed[key].data[properties.id] = {id: properties.id}
					}
					for (const i of processed[key].header) {
						if (i.href) {
							const val = makeTemplate(i.text, properties)
							const href = makeTemplate(i.href, properties)
							processed[key].data[properties.id][i.field] = {
								text: val === "undefined" ? "": val,
								href: href === "undefined" ? "": href
							}
							if (val !== "undefined") {
								i.count = i.count + 1
							}
						} else {
							const val = makeTemplate(i.text, properties)
							processed[key].data[properties.id][i.field] = val === "undefined" ? "": precise(val)
							if (val !== "undefined") {
								i.count = i.count + 1
							}
						}
					}
					if (processed[key].data[properties.id]["label"] === "") {
						processed[key].data[properties.id]["label"] = label
					}
				}
			}
			
			setTabs([...node_tabs, ...edge_tabs])
			setTab(node_tabs[0])
			setProcessedData(processed)	
		}
	}, [data])

	if (processedData === null) return null
	else {
		const {data={}, header=[], columnVisibilityModel} = processedData[tab] || {}
		const columns: GridColDef[] = header.filter(i=>i.count === undefined || i.count > 0)
		return (
			<Card sx={{marginBottom: 10}} ref={tableRef}>
				<CardContent>
					<Grid container justifyContent={"center"} sx={{paddingBottom: 10}}>
						<Grid item xs={12}>
							<Tabs
								value={tab}
								variant="scrollable"
								scrollButtons="auto"
								onChange={(e, val)=>setTab(val)}
								aria-label="tab"
								sx={{
									'& .MuiTab-root.Mui-selected': {color: '#336699',}
								}}
							>
							{tabs.map(k=>(
								<Tab value={k} aria-label="left aligned" key={`tab-${k}`} label={k.replace('node_', '').replace('edge_', '') + (k.startsWith('node_') ? ' nodes' : ' edges')}/>
							))}
							</Tabs>
						</Grid>
						<Grid item xs={12}>
							<DataGrid
								key={tab}
								initialState={{
									columns: {
									columnVisibilityModel
									},
								}}
								components={{ Toolbar: CustomToolbar }}
								sortingOrder={['desc', 'asc']}
								rows={Object.values(data)}
								columns={columns}
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
						</Grid>
					</Grid>
				</CardContent>
			</Card>
		)
	}
}

export default NetworkTable
