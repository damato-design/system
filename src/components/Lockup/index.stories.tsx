import type { Meta, StoryObj } from '@storybook/react';
import checklist from './checklist.md?raw';

import { lockup } from '.';
import { text } from '../Text';
import { field } from '../Field';
import { input } from '../Input';
import { useCallback, useState } from 'react';
import { Close } from '../Close';
import { Button } from '../Button';
import { box } from '../Box';
import { track } from '../Track';

/**
 * The `lockup` primitive helps create standardized layouts of content.
 */
const meta = {
    title: 'Primitives/lockup',
    component: lockup.div,
    parameters: {
        checklist
    }
} satisfies Meta<typeof lockup.div>

export default meta
type Story = StoryObj<typeof meta>

/**
 * It is common to show a `subject` (either a title or label) to introduce a concept
 * and then further explain the concept with additional information.
 */
export const Default: Story = {
    args: {
        subject: <text.h2 priority='primary'>Profound Story</text.h2>,
        children: <text.p>Once upon a time, there was a great protagonist.</text.p>
    },
}

/**
 * You can provide an icon reference to the `icon` prop to render the glyph
 * on the leading side of the composition. If a `subject` is provided,
 * the `icon` is wrapped with an identical treatment to the given `subject`
 * so it can match its presence. For more about icons, see the [Icon docs](/docs/primitives-icon--docs).
 */
export const Icon: Story = {
    args: {
        icon: 'info',
        subject: <text.h2 priority='primary'>Title</text.h2>,
        children: <text.p>Once upon a time, there was a great protagonist.</text.p>
    },
}

/**
 * If you want to provide the ability for a user to dismiss the message
 * you can include the `<Close/>` component. The placement of the component
 * is important to ensure it does not conflict with content. For more about
 * this expectation, see the [Close docs](/docs/primitives-close--docs).
 */
export const Dismissable: Story = {
    args: {
        subject: (
            <text.h2 priority='primary'>
                <Close onClick={ ()=> console.log('Close!') }/>
                Maybe you would like this message to be closed?
            </text.h2>
        ),
        children: <text.p>Once upon a time, there was a great protagonist.</text.p>
    },
}

/**
 * This component is also helpful with small amounts of content.
 * In this example, we standardize the composition of an `icon`
 * with normal body copy.
 */
export const Minimal: Story = {
    args: {
        icon: 'info',
        children: <text.p>Once upon a time, there was a great protagonist.</text.p>
    },
}

/**
 * The component is an extension of `box` and can be used similarly.
 * In this example, we set the `standby` flag to present the internal
 * structure in a loading state.
 */
export const Loading: Story = {
    render: (args) => (
        <lockup.div { ...args }
            standby
            subject={ <text.h2 priority='primary'/> }>
            <text.p/>
        </lockup.div>
    )
}

/**
 * The example shows how to compose the `track` with the lockup, showing the output of the range on the far-end.
 */
export const Output: Story = {
    args: {
        subject: <text.label>Percent</text.label>,
    },
    render: (args) => {
        const [val, setValue] = useState(30);
        const onChange = useCallback((ev: any) => setValue(ev.target.valueAsNumber), []);
        return (
            <lockup.div {...args} stack stretch output={ <text.output>{ val }%</text.output> }>
                <track.range value={ val } onChange={ onChange }/>
            </lockup.div>
        )
    }
}

/**
 * The component can also be used for form field composition.
 * The `passiveMessage` can be used to include helpful context about the field.
 * The `errorMessage` will politely announce its content when it is provided.
 * 
 * When the `errorMessage` is provided, a section of the component is given the
 * `system:critical` mode to emphasize this component should be addressed.
 * 
 * > #### Why are the messages above the input?
 * >
 * > Messages appear above the input due to the native browser hints that may appear below the input.
 * > These tend to cover messaging that appears below the input.
 * > Rendering these messages above the input help ensure they remain visible.
 * >
 * > Another reason aligns to how we normally read instructions before executing the task.
 * > First, the subject is read. Then the directions on how to complete the task.
 * > Finally, the task is presented to complete.
 */
export const Form: Story = {
    args: {
        subject: <text.label>Email</text.label>,
        passiveMessage: 'Enter your email to validate',
        errorMessage: 'Sorry, not good enough',
        icon: 'contact_mail'
    },
    render: (args) => {
        const [value, setValue] = useState('hello@example');

        const onChange = useCallback((ev: any) => {
            setValue(ev.target.value);
        }, []);

        return (
            <lockup.fieldset { ...args }>
                <field.div>
                    <input.email name='email' value={ value } onChange={ onChange }/>
                </field.div>
            </lockup.fieldset>
        )
    }
}

/**
 * This example shows an alternative to the double-confirmation pattern by preparing a input for the user to fill out before confirming a destructive action. We put `mode="system:critical"` on the component to indicate this is a critical message, causing the presentation of the content to indicate a higher severity.
 * 
 * This also uses a `box` primitive to help align the input and button.
 */
export const Confirm: Story = {
    args: {
        subject: <text.label>Confirm delete</text.label>,
        passiveMessage: 'Type the name of the item to delete. Beware, there is no going back!',
        icon: 'warning'
    },
    render: (args) => {
        const [value, setValue] = useState('');

        const onChange = useCallback((ev: any) => {
            setValue(ev.target.value);
        }, []);

        return (
            <lockup.fieldset { ...args } mode="system:critical">
                <box.div gap>
                    <field.div>
                        <input.text name='text' value={ value } onChange={ onChange }/>
                    </field.div>
                    <Button priority='primary'>Delete</Button>
                </box.div>
            </lockup.fieldset>
        )
    }
}

/**
 * This example stacks `lockup` components to create a login form.
 */
export const Login: Story = {
    args: {},
    render: (args) => {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [show, setShow] = useState(false);

        const forgotPassword = (
            <text.a href="#" priority='auxiliary'>Forgot Password</text.a>
        );

        return (
            <box.form action='' stack gap { ...args }>
                <lockup.div subject={ <text.h2 priority='primary'>Login</text.h2> }>
                    <text.p>Your progress is saved, we'll bring you right back!</text.p>
                </lockup.div>
                <lockup.fieldset subject={ <text.label>Email</text.label> }>
                    <field.div>
                        <input.email name='email' value={ email } onChange={ ({ target }: any) => setEmail(target.value) }/>
                    </field.div>
                </lockup.fieldset>
                <lockup.fieldset subject={ <text.label>Password</text.label> } passiveMessage={ forgotPassword }>
                    <field.div>
                        <input.password
                            name='password'
                            value={ password }
                            redact={ !show }
                            onChange={ ({ target }: any) => setPassword(target.value) }/>
                        <Button icon={ show ? 'visibility_off' : 'visibility' } onClick={() => setShow(!show)}>
                            { show ? 'Hide' : 'Show' }
                        </Button>
                    </field.div>
                </lockup.fieldset>
                <Button priority='primary'>Login</Button>
            </box.form>
        )
    }
}
