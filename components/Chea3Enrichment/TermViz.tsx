'use client'
import { precise } from "@/utils/math";
import { useQueryState } from "next-usequerystate";
// import EnrichmentBar from "./EnrichmentBar";
import { NetworkSchema } from "@/app/api/knowledge_graph/route";
import { UISchema } from "@/app/api/schema/route";
import NetworkTable from "./NetworkTable";
import { Typography, CircularProgress } from "@mui/material";
import dynamic from "next/dynamic";
import Cytoscape from "../Cytoscape";

const TermViz = ({elements, schema, tooltip_templates_edges, tooltip_templates_nodes}:
	{
		elements:NetworkSchema,
		schema: UISchema,
		tooltip_templates_edges: {[key: string]: Array<{[key: string]: string}>}, 
		tooltip_templates_nodes: {[key: string]: Array<{[key: string]: string}>}, 
	}) => {
	const [view, setView] = useQueryState('view')
	const entries:{[key:string]: {library: string, score: number, [key: string]: number | string | boolean}} = {}
	const columns:{[key:string]: boolean} = {}
	for (const dt of [...elements.nodes, ...elements.edges]) {
		const {label, id: i, kind, color, gradient_color, ...properties} = dt.data
		{/*if (dt.data.score !== undefined) {*/}
			const {enrichr_label} = properties
			const id = `${properties.library}: ${enrichr_label} (${i})`
			if (entries[id] === undefined && kind !== "Gene") {
				const {
					library,
					score
				} = properties
				entries[id] = {
					id,
					label,
					enrichr_label,
					...properties,
					library: `${library}`,
					score: typeof score === 'number' ? parseFloat(`${precise(score)}`): undefined,
				}
				for (const [k,v] of Object.entries(entries[id])) {
					if (v !== undefined) columns[k] = true
				}
			}
			
		{/*}*/}
	}
	const sorted_entries = Object.values(entries)
	if (sorted_entries.length === 0) return <Typography variant="h5">No Results Found</Typography>
	else {
		if (view === 'network' || !view) return (
			<Cytoscape 
				elements={elements}
				schema={schema}
				tooltip_templates_edges={tooltip_templates_edges}
				tooltip_templates_nodes={tooltip_templates_nodes}
				search={false}
			/> 
		) 
		else if (view === "table") return (
			<NetworkTable sorted_entries={sorted_entries} columns={columns}/>
		) 
		// else if (view === "bar") return(
			// <EnrichmentBar data={sorted_entries}
				// max={sorted_entries[0]["score"]}
				// min={sorted_entries[sorted_entries.length - 1]["score"]}
				// width={900}
			// />
		// )
	}
}

export default TermViz