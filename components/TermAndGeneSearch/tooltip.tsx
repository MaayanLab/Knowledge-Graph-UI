'use client'
import { useEffect, useState } from "react"
import { FilterSchema } from "@/utils/helper"
import AsyncFormComponent from "./async_form"
import { router_push } from "@/utils/client_side"
import { usePathname, useRouter, useSearchParams} from "next/navigation"
import { Stack, 
	Typography, 
	Card, 
	CardContent, 
	CardActions, 
	Button, 
	IconButton,
	Tooltip
 } from "@mui/material"
import { NetworkSchema } from "@/app/api/knowledge_graph/route"
import { useQueryState, parseAsJson } from 'next-usequerystate';
import { makeTemplate } from "@/utils/helper"
import { precise } from "@/utils/math"
import HubIcon from '@mui/icons-material/Hub';
import DeleteIcon from '@mui/icons-material/Delete'
import SendIcon from '@mui/icons-material/Send'
import { UISchema } from "@/app/api/schema/route"
import Link from "next/link"

export const TooltipComponent = ({data, float, tooltip_templates, schema}: {
	data: {
		id: string,
		label?: string,
		relation?: string,
		kind: string,
		[key: string]: string | number
	},
	tooltip_templates: {[key: string]: Array<{[key: string]: string}>}, 
	schema: UISchema,
	float?: boolean
}) => {
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const queryParams = {}
	let filter = {}
	let filter_field = 'filter'
	searchParams.forEach((value, key) => {
		console.log(key, value)
		if (['filter', 'q', 'selected', 'hovered'].indexOf(key) === -1) queryParams[key] = value;
		else if (['filter', 'q'].indexOf(key) > -1) {
			filter_field = key
			filter = JSON.parse(value)
		}
	});
	const router = useRouter()
	const elements = []
	const field = data.kind === "Relation" ? data.label : data.kind.replace(/Search TFs that are also ranked|Top 10 Ranked TFs|Search TFs/g, "Transcription Factor")
	//const [selected, setSelected] = useQueryState('selected',  parseAsJson<{id: string, type: 'nodes' | 'edges'}>().withDefault(null))
	//const [hovered, setHovered] = useQueryState('hovered',  parseAsJson<{id: string, type: 'nodes' | 'edges'}>().withDefault(null))
	for (const i of tooltip_templates[field] || []) {
		if (i.type === "link") {
			const text = makeTemplate(i.text, data)
			const href = makeTemplate(i.href, data)
			if (text !== 'undefined') {
			  elements.push(
				<Typography key={i.label} variant="subtitle2" sx={{wordWrap: "break-word"}}>
				  <b>{i.label}:</b> <Button size='small' 
					color="secondary"
					  sx={{padding: 0, textDecoration: "underline"}} 
					  href={href}
									  target="_blank"
									  rel="noopener noreferrer"
				  >{text}</Button>
				</Typography>  
			  )
			}
		  } else {
			let e = makeTemplate(i.text, data)
			if (e !== 'undefined') {
			  elements.push(
				<Typography key={i.label} sx={{wordWrap: "break-word"}} variant="subtitle2">
				  <b>{i.label}:</b> {i.type === "text" ? e: precise(e)}
				</Typography>  
			  )
			}
		  }
	}
	const extrasx = {}
	if (float) {
		extrasx["position"] = "absolute"
		extrasx["top"] = 0
		extrasx["left"] = 0
		extrasx["zIndex"] = 100
	}
	return (
		<Card sx={{marginTop: 2, ...extrasx}}>
			<CardContent sx={{padding: 2}}>
				{elements}
			</CardContent>
			{data.kind !== "Relation" &&
            <CardActions>
              {!filter["end_term"] && <Tooltip title="Delete Node">
				<Link href={`${pathname}?${filter_field}=${JSON.stringify({
					...filter,
					remove: [...(filter["remove"] || []), parseInt(data.id)]
				})}${Object.keys(queryParams).length ? "&" + Object.entries(queryParams).map(([k,v])=>`${k}=${v}`).join("&"): ""}`}>
					<IconButton>
						<DeleteIcon/>
					</IconButton> 
				</Link>
              </Tooltip>}
			  <Tooltip title="Expand Node">
				<Link href={`${pathname}?${filter_field}=${JSON.stringify({
					...filter,
					expand: [...(filter["expand"] || []), parseInt(data.id)]
				})}${Object.keys(queryParams).length ? "&" + Object.entries(queryParams).map(([k,v])=>`${k}=${v}`).join("&"): ""}`}>
					<IconButton>
						<HubIcon/>
					</IconButton> 
				</Link>
              </Tooltip>
              <Tooltip title="Open node in new page">
				<Link href={`${(schema.header.tabs.filter(i=>i.component === 'KnowledgeGraph')[0] || {}).endpoint || '/'}?filter=${JSON.stringify({
                        start: data.kind.replace(/Search TFs that are also ranked|Top 10 Ranked TFs|Search TFs/g, "Transcription Factor"),
                        start_term: data.label
                      })}`}>
					<IconButton>
						<SendIcon sx={{transform: "scaleX(-1)"}}/>
					</IconButton>
				</Link>
              </Tooltip>
            </CardActions>
          }
		</Card>
	)
}

const TooltipComponentGroup = ({
	elements,
	tooltip_templates_nodes,
    tooltip_templates_edges,
	schema,
	float,

}: {
		elements: null | NetworkSchema,
		tooltip_templates_edges: {[key: string]: Array<{[key: string]: string}>},
        tooltip_templates_nodes: {[key: string]: Array<{[key: string]: string}>},
		schema: UISchema,
		float?: boolean,

	}) => {
	
	const [tooltip, setTooltip] = useQueryState('tooltip')
	const [selected, setSelected] = useQueryState('selected',  parseAsJson<{id: string, type: 'nodes' | 'edges'}>().withDefault(null))
	const [hovered, setHovered] = useQueryState('hovered',  parseAsJson<{id: string, type: 'nodes' | 'edges'}>().withDefault(null))
	const [elementMapper, setElementMapper] = useState({nodes: {}, edges: {}})


	useEffect(()=>{
        if (elements) {
			const nodes = elements.nodes.reduce((acc, i)=>({
				...acc,
				[i.data.id]: i.data
			}), {})

			const edges = elements.edges.reduce((acc, i)=>({
				...acc,
				[`${i.data.source}_${i.data.relation}_${i.data.target}`]: i.data
			}), {})
			setElementMapper({nodes, edges})
		}
    }, [elements])
	const user_input = selected || hovered
	if (tooltip && user_input !== null && elementMapper[user_input.type][user_input.id] !== undefined) {
		return (
			<TooltipComponent 
					data={elementMapper[user_input.type][user_input.id]} 
					tooltip_templates={user_input.type === 'nodes' ? tooltip_templates_nodes: tooltip_templates_edges}
					schema={schema}
					float={float}
				/>
		)
	}
	else return null
	
}

export default TooltipComponentGroup