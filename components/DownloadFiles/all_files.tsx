import { Grid, Typography, } from "@mui/material"
import Link from 'next/link';
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
			{/*<Grid item xs={12}>
				<Typography variant={"h2"}>Download Page</Typography>
			</Grid>*/}
			<Grid item xs={12}>
				<Typography variant={"h3"}>Networks</Typography>
				<Typography variant={"body1"}>
				Each entry below contains a link to zipped archives each containing three files. The first file in each archive lists the nodes of each network, and the other two files list the edges of each network.  
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<ClientSide download={(download.network || []).map(i=>({id: i.zip, ...i}))} type='network'/>
			</Grid>
			<Grid item xs={12}>
				<Typography variant={"h3"}>Gene Set Files</Typography>
				<Typography variant={"body1"}>
					This file contains a list of control vs. perturbation gene sets from&nbsp;
                            <Link href={"https://rummageo.com"} 
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{color: "black", textDecoration: "underline"}}
                            >
                                <span style={{fontSize: 16, fontWeight: 700, fontFamily: 'Open-sans, sans-serif'}}>RummaGEO</span>
                            </Link>
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<ClientSide download={(download.rummageo || []).map(i=>({id: i.url, ...i}))} type='rummageo'/>
			</Grid>
			<Grid item xs={12}>
				<Typography variant={"h3"}>Network-Building Notebooks</Typography>
				<Typography variant={"body1"}>
				Links to notebooks used to construct, filter, benchmark, and format the GRNs. 
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<ClientSide download={(download.notebook || []).map(i=>({id: i.url, ...i}))} type='notebook'/>
			</Grid>
			
		</Grid>
	)
}

export default AllFiles