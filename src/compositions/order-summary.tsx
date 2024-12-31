import { text } from '../components/Text';
import { Button } from '../components/Button';
import { box } from '../components/Box';

function ItemizedTable() {
    return (
        <box.div stack denser>
            <box.div gap distribute='between'>
                <text.span priority='auxiliary'>Item Total</text.span>
                <text.span priority='auxiliary'>$5.99</text.span>
            </box.div>
            <box.div gap distribute='between'>
                <text.span priority='auxiliary'>Store Pickup</text.span>
                <text.span priority='auxiliary'>FREE</text.span>
            </box.div>
            <box.div gap distribute='between'>
                <text.span priority='auxiliary'>Estimated Sales Tax</text.span>
                <text.span priority='auxiliary'>Calculated at checkout</text.span>
            </box.div>
            <text.hr/>
            <box.div gap distribute='between'>
                <text.strong>Total</text.strong>
                <text.strong>$5.99</text.strong>
            </box.div>
        </box.div>
    );
}

export const OrderSummary = () => {
    return (
        <box.div stack gap>
            <text.h2 priority='primary'>Order Summary</text.h2>
            <ItemizedTable/>
            <Button priority='primary'>Checkout</Button>
        </box.div>
    )
}
