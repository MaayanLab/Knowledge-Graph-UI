'use client'
import { Alert, AlertTitle, Button, Grid, Typography } from '@mui/material'

import { useState, useEffect } from "react"
import Cookies from 'js-cookie'

const consent_cookie_name = 'consentCookie'

export function withCookie<P>(Component: React.ComponentType<{[key:string]: any}>){
    const WrappedComponent = (props: {[key: string]: any}) => {
        const [consentCookie, setConsentCookie] = useState(Cookies.get(consent_cookie_name))
        useEffect(()=>{
            Cookies.set(consent_cookie_name, consentCookie)
        }, [consentCookie])
        
        const resetCookie  = () => {
            Cookies.remove(consent_cookie_name)
            setConsentCookie(undefined)
        }

        return <Component {...props} consentCookie={consentCookie} setConsentCookie={setConsentCookie} resetCookie={resetCookie}/>
    }
    if (typeof process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID === 'undefined') return Component
    WrappedComponent.displayName = "WithCookie"
    return WrappedComponent

}

export const ConsentCookie = ({consentCookie, setConsentCookie}) => {
    if (consentCookie !== undefined || typeof process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID === 'undefined') return null
    else {
        return(
            <Alert severity="info" id="cookieConsent">
                <AlertTitle>Cookie Policy</AlertTitle>
                <Grid container alignItems={"center"} spacing={2}>
                    <Grid item>
                        <Typography>Is it ok to have Google Analytics turned on while you are visiting this website?</Typography>
                    </Grid>
                    <Grid item>
                        <Button onClick={() => {
                            setConsentCookie('allow')
                        }} variant='outlined' color="secondary">I agree</Button>
                    </Grid>
                    <Grid item>
                        <Button onClick={() => {
                            setConsentCookie('deny')
                        }} variant='outlined' color="secondary">Decline</Button>
                    </Grid>
                </Grid>
            </Alert>
        )
    }
}


export default ConsentCookie