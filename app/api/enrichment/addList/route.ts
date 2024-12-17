import neo4j from "neo4j-driver"
import { neo4jDriver } from "@/utils/neo4j"
import { NextResponse } from "next/server"
import { NextRequest } from 'next/server'
import { v5 as uuidv5 } from 'uuid';

const MY_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';

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
            
            const tryquery =  `MATCH (a:GeneSet) WHERE a.gene_set = "${list}" AND a.description = "${description}" RETURN a.id`
            // const test = await read_session.readTransaction(txc => txc.run(tryquery))
            const userListId:string = uuidv5(JSON.stringify({list, description}), MY_NAMESPACE)
            const query = `MATCH (a:GeneSet) WHERE a.id = "${userListId}" RETURN a.id`
            
            const rs = await read_session.readTransaction(txc => txc.run(query))
            if (rs.records.length === 0) {
                const query = `CREATE (n:\`GeneSet\` {id: "${userListId}", gene_set: "${list}", description: "${description}", hidden: true}) RETURN n.id` // add node to graph
                const rs = await write_session.run(query)
                console.log(`id: ${JSON.stringify(userListId)}`)
            }
            return NextResponse.json({userListId},  {status: 200}) // return success
            
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