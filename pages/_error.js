import Link from 'next/link'
import { Button } from 'semantic-ui-react'
function Error({ statusCode,message }) {
    return (
        <div className="error-page">
            <div class="wrapper">
                <h1>Hmm. {statusCode}</h1>

    <p>{message?message:"It seems that you're lost in a perpetual black hole. Let us help guide you out and get you back home."}</p>
                <Button primary><Link href="/"><a >home</a></Link></Button>
            </div>
            <div class="space">
                <div class="blackhole"></div>
                <div class="ship"></div>
            </div>
        </div>
    )
}

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { statusCode }
}

export default Error
