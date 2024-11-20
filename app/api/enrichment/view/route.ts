import neo4j from "neo4j-driver"
import { neo4jDriver } from "@/utils/neo4j"
import { NextResponse } from "next/server"
import { NextRequest } from 'next/server'

export async function GET(req:NextRequest) {
    try {
        const read_session = neo4jDriver.session({
            defaultAccessMode: neo4j.session.READ
        })

        try {
            const url = new URL(req.url)
            const id = url.searchParams.get("userListId")
            if (id !== undefined){
                const query = `MATCH (n:\`GeneSet\`) WHERE n.id = "${id}" RETURN n.gene_set as set, n.description as desc`
                const rs = await read_session.readTransaction(txc => txc.run(query))
                const results = rs.records.flatMap(record => {
                    const set = record.get('set')
                    const desc = record.get('desc')
                    return JSON.stringify({"set":set, "desc":desc})
                })[0]
                return NextResponse.json(results,  {status: 200}) // return success
            } else {
                console.log("id is undefined")
                return NextResponse.json(id, {status:400})
            }
        } catch (e) {
            console.log(e.message)
            return NextResponse.json(e, {status: 400})
        } finally {
            read_session.close()
        }
    } catch (error) {
        console.log(error)
        return NextResponse.error()
    }
}