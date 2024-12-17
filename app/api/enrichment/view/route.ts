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

export async function GET(req: NextRequest) {
    try {
        const write_session = neo4jDriver.session({
            defaultAccessMode: neo4j.session.WRITE
        })
        const read_session = neo4jDriver.session({
            defaultAccessMode: neo4j.session.READ
        })
        try {
            const userListId = req.nextUrl.searchParams.get("userListId")
            const query = `MATCH (a:GeneSet) WHERE a.id = "${userListId}" RETURN a`
            
            const rs = await read_session.readTransaction(txc => txc.run(query))
            if (rs.records.length === 1) {
                const a = rs.records[0].get('a')
                const geneset = {
                    genes: a.properties.gene_set.split(/\s+/),
                    description: a.properties.description
                }
                return NextResponse.json(geneset,  {status: 200}) // return success
            }
            return NextResponse.json({error: "Not found"},  {status: 404}) // return success
            
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