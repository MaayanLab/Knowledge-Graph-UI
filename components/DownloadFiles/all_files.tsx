import { Grid, Typography, } from "@mui/material"

import ClientSide from "./client_side";

const AllFiles = ({download}: {download: {
	network: Array<{
		name: string,
		nodes: number,
		edges: number,
		zip: string,
		size: string
	}>,
	rummageo: Array<{
		resource: string,
		url: string,
		size: string
		// updated: string
	}>
	notebook: Array<{
		title: string,
		description: string,
		size: string,
		updated: string,
		url: string
	}>
}}) => {
	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Typography variant={"h2"}>Download Page</Typography>
			</Grid>
			<Grid item xs={12}>
				<Typography variant={"h3"}>Network Files</Typography>
				<Typography variant={"body1"}>
					Each entry below contains a link to a compressed set of assertion files. For each network this includes the three "Transcription Factor.nodes.csv", "Transcription Factor.upregulates.Transcription Factor.edges.csv", and "Transcription Factor.downregulates.Transcription Factor.edges.csv" files. 
					The node files contain information about each node, formatted. Edge files contain the source, relation, target, and significance for each edge.  
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<ClientSide download={(download.network || []).map(i=>({id: i.zip, ...i}))} type='network'/>
			</Grid>
			<Grid item xs={12}>
				<Typography variant={"h3"}>Gene Set Files</Typography>
				<Typography variant={"body1"}>
					This file contains a list of control vs. perturbation gene sets. 
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<ClientSide download={(download.rummageo || []).map(i=>({id: i.url, ...i}))} type='rummageo'/>
			</Grid>
			<Grid item xs={12}>
				<Typography variant={"h3"}>Network-Building Notebooks</Typography>
				<Typography variant={"body1"}>
					Links to each notebook used to construct, filter, benchmark, and format the network assertions are provided below. 
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<ClientSide download={(download.notebook || []).map(i=>({id: i.url, ...i}))} type='notebook'/>
			</Grid>
			
		</Grid>
	)
}

export default AllFiles