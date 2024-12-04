import { get_regex } from "./get_regex/helper"
export const chea_query = async ({
    userListId,
    library,
    term_limit,
    term_degree
}: {
    userListId: string,
    library: string,
    term_limit: number,
    term_degree?: number
}) => {
    const data = await fetch(`${process.env.NODE_ENV==="development" ? process.env.NEXT_PUBLIC_HOST_DEV : process.env.NEXT_PUBLIC_HOST}${process.env.NEXT_PUBLIC_PREFIX ? process.env.NEXT_PUBLIC_PREFIX: ''}/api/enrichment/view?userListId=${userListId}`)
    if (data.ok !== true) {
        throw new Error(`Error fetching gene set from ID`)
    }
    
    const info = await data.json()
    console.log(`sending to ChEA3`)
    let d = JSON.parse(info)
    const s = d.set
    const gs = s.split('\r\n')
    const res = await fetch(`${process.env.NEXT_PUBLIC_CHEA3_URL}/api/enrich/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
           },
        body: JSON.stringify( {
            query_name: info.desc,
            gene_set: gs
        })
    }
    )

    if (res.ok !== true) {
        console.log(`${process.env.NODE_ENV==="development" ? process.env.NEXT_PUBLIC_HOST_DEV : process.env.NEXT_PUBLIC_HOST}${process.env.NEXT_PUBLIC_PREFIX ? process.env.NEXT_PUBLIC_PREFIX: ''}/api/enrichment/view`)
        throw new Error(`Error communicating with ChEA3`)
    } 
    const regex = {}
    const reg:{[key:string]: string} = await get_regex()
    for (const [k,v] of Object.entries(reg)) {
        regex[k] = new RegExp(v)
    }
    const results = await res.json()

    const terms = {}
    const genes = {}
    let max_score = 0
    let min_score = 10000

    // here I need to change results to not access specific libraries and hten alter the return results to fit the chea3 return
    for (const i of results[library].slice(0,term_limit)) {
        const rank = i.Rank
        const chea3label = i.TF
        const label = regex[library] !== undefined ? regex[library].exec(chea3label).groups.label:chea3label
        const score = parseFloat(i.Score)
        const libs = i.Library.split(';').map(i => i.split(',')[0])
        const overlapping_genes = i.Overlapping_Genes.split(',')

        // label is the term name from enrichr. collect the label and store it in terms along with the library it was found in
        if (term_degree===undefined || overlapping_genes.length >= term_degree) {
            if (terms[label] === undefined) terms[label] = {library, label}
            
            // keep track of max score 
            if (score > max_score) max_score = score
            if (score < min_score) min_score = score

            // if there is no existing term just put it on top -- add the properties
            if (terms[label].score === undefined) {
                terms[label].enrichr_label = chea3label
                terms[label].score = score
                terms[label].rank = rank
                terms[label].overlap = overlapping_genes.length
            } else {
                // if it appeared before (e.g. drug up, drug down) then use the one with lower pvalue 
                // as default and push alternative enrichment to enrichment
                if (terms[label].enrichment === undefined) {
                    const {library, label: l, ...rest} = terms[label]
                    terms[label].enrichment = [rest]
                }
                terms[label].enrichment.push({
                    label,
                    score,
                    rank,
                    overlap: overlapping_genes.length
                })
                if (terms[label].score > score) {
                    terms[label].enrichr_label = chea3label
                    terms[label].score = score
                    terms[label].rank = rank
                    terms[label].overlap = overlapping_genes.length
                }
            }
            for (const gene of overlapping_genes) {
                genes[gene] = (genes[gene] || 0) + 1
            }
        }
    }
    return {genes, terms, max_score, min_score, library}
}

export const enrichr_query = async ({
    userListId,
    library,
    term_limit,
    term_degree
}: {
    userListId: string,
    library: string,
    term_limit: number,
    term_degree?: number
}) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_ENRICHR_URL}/enrich?userListId=${userListId}&backgroundType=${library}`)
    if (res.ok !== true) {
        console.log(`${process.env.NEXT_PUBLIC_ENRICHR_URL}/enrich?userListId=${userListId}&backgroundType=${library}`)
        throw new Error(`Error communicating with Enrichr`)
    }
    const regex = {}
    const reg:{[key:string]: string} = await get_regex()
    for (const [k,v] of Object.entries(reg)) {
        regex[k] = new RegExp(v)
    }
    const results = await res.json()

    const terms = {}
    const genes = {}
    let max_pval = 0
    let min_pval = 1
    for (const i of results[library].slice(0,term_limit)) {
        const enrichr_label = i[1]
        const label = regex[library] !== undefined ? regex[library].exec(enrichr_label).groups.label:enrichr_label
        const pval = i[2]
        const zscore = i[3]
        const combined_score = i[4]
        const overlapping_genes = i[5]
        const qval = i[6]
        if (term_degree===undefined || overlapping_genes.length >= term_degree) {
            if (terms[label] === undefined) terms[label] = {library, label}
            if (pval > max_pval) max_pval = pval
            if (pval < min_pval) min_pval = pval

            // if there is no existing term just put it on top
            if (terms[label].pval === undefined) {
                terms[label].enrichr_label = enrichr_label
                terms[label].pval = pval
                terms[label].zscore = zscore
                terms[label].combined_score = combined_score
                terms[label].qval = qval
                terms[label].logpval = -Math.log(pval)
                terms[label].overlap = overlapping_genes.length
            } else {
                // if it appeared before (e.g. drug up, drug down) then use the one with lower pvalue 
                // as default and push alternative enrichment to enrichment
                if (terms[label].enrichment === undefined) {
                    const {library, label: l, ...rest} = terms[label]
                    terms[label].enrichment = [rest]
                }
                terms[label].enrichment.push({
                    enrichr_label,
                    pval,
                    zscore,
                    combined_score,
                    qval,
                    logpval: -Math.log(pval),
                    overlap: overlapping_genes.length
                })
                if (terms[label].pval > pval) {
                    terms[label].enrichr_label = enrichr_label
                    terms[label].pval = pval
                    terms[label].zscore = zscore
                    terms[label].combined_score = combined_score
                    terms[label].qval = qval
                    terms[label].logpval = -Math.log(pval)
                    terms[label].overlap = overlapping_genes.length
                }
            }
            for (const gene of overlapping_genes) {
                genes[gene] = (genes[gene] || 0) + 1
            }
        }
    }
    return {genes, terms, max_pval, min_pval, library}
}