import { typed_fetch } from "@/utils/helper"
import AllFiles from "./all_files"

const DownloadFiles = async ({src}: {src?: string}) => {
	const download = await typed_fetch<{
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
		}>
		notebook: Array<{
			title: string,
			description: string,
			url: string,
			size: string,
			updated: string
		}>
	}>(src)
	return <AllFiles download={download}/>
}

export default DownloadFiles