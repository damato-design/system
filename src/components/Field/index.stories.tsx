import React, { MouseEvent } from 'react';
import type { Meta, StoryObj } from '@storybook/react'

import { Field } from '.';

import { input } from '../Input';
import { Button } from '../Button';

const meta = {
    title: 'Components/Field',
    component: Field,
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        label: 'Search',
        inputRef: React.createRef(),
        children: [
            <input.text placeholder='Search for something' ref={ React.createRef() } key='input'/>,
            <Button icon='search' key='button'/>
        ]
    },
}

export const Messaging: Story = {
    args: {
        label: 'Search',
        inputRef: React.createRef(),
        helpMessage: 'You can search for anything you want!',
        errorMessage: 'This is where you will find the error message.',
        children: [
            <input.text placeholder='Search for something' ref={ React.createRef() } key='input'/>,
            <Button icon='search' key='button'/>
        ]
    }
}

export const Stepper: Story = {
    args: {
        label: 'Stepper',
        inputRef: React.createRef(),
    },
    render: (args) => {
        const [value, setValue] = React.useState(0);

        const onClick = React.useCallback((ev: any) => {
            setValue((val) => val + Number(ev.target.value));
        }, []);

        const onChange = React.useCallback((ev: any) => {
            setValue(ev.target.value);
        }, []);

        return (
            <Field { ...args } stretch={ false }>
                <Button icon='remove' value={ -1 } onClick={ onClick }/>
                <input.text value={ value } ref={ args.inputRef } onChange={ onChange } fieldSizing='content'/>
                <Button icon='add' value={ 1 } onClick={ onClick }/>
            </Field>
        )
    }
}

