import { box } from '../components/Box';
import { Media } from '../components/Media';
import { lockup } from '../components/Lockup';
import { text } from '../components/Text';
import { Button } from '../components/Button';

const MODEL_SRC = 'https://images.unsplash.com/photo-1462804993656-fac4ff489837?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

export const CalloutBanner = () => {
    const subject = <text.h2 priority='primary'>New deal every day!</text.h2>
    return (
        <box.div mode='callout' wrap placeChildren='start' purpose='surface'>
            <Media src={ MODEL_SRC } maxWidth='600px'/>
            <lockup.div subject={ subject } padding placeChildren='start'>
                <text.p>
                    Don't wait to catch our great deals on all of your favorite projects.
                </text.p>
                <Button priority='primary'>Shop Now!</Button>
            </lockup.div>
        </box.div>
    )
}