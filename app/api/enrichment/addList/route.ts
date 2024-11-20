import neo4j from "neo4j-driver"
import { neo4jDriver } from "@/utils/neo4j"
import { NextResponse } from "next/server"
import { NextRequest } from 'next/server'
import { z } from 'zod'
import {v4 as uuidv4, v5 as uuidv5} from 'uuid'

interface GeneSet {
    list: string,
    description: string
}

export async function POST(req: NextRequest) {
    try {
        const write_session = neo4jDriver.session({
            defaultAccessMode: neo4j.session.WRITE
        })
        const read_session = neo4jDriver.session({
            defaultAccessMode: neo4j.session.READ
        })
        try {
            
            const formData = await req.formData() // get gene set
            const list = formData.get('list') as string | null
            const description = formData.get('description') as string | null
            const namespace = uuidv4() // create persistent ID
            const userListId:string = uuidv5(list, namespace)
            const query = `MATCH (a:GeneSet) WHERE a.id = "${userListId}" RETURN a.id`
    
            const rs = await read_session.readTransaction(txc => txc.run(query))
            if (rs.records.length === 0) {
                const query = `CREATE (n:\`GeneSet\` {id: "${userListId}", gene_set: "${list}", description: "${description}"}) RETURN n.id` // add node to graph
                const rs = await write_session.run(query)
                console.log(`id: ${JSON.stringify(userListId)}`)
            }
            return NextResponse.json(userListId,  {status: 200}) // return success
            
        } catch (e) {
            console.log(e.message)
            return NextResponse.json(e, {status: 400})
        } finally {
            write_session.close()
            read_session.close()
        }
    } catch (error) {
        console.log(error)
        return NextResponse.error()
    }
}