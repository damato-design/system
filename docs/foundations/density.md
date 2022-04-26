---
title: Density
order: 4
---

# Density

The exercise of applying space between elements is to identify where elements are related. Elements with a closer relation have tigher space while elements with less relation are farther apart. This is the concept commonly known as [The Gestalt Law of Proximity](https://www.nngroup.com/articles/gestalt-proximity/).

A way to visualize this is by social degrees of separation. People living in the same house are 1 degree of separation while neighbors could be 2 degrees of separation. In other words, parent-child and child-child relationships are closer than any other.

## Padding and gap

Using the above concept we have idenitifed that only two spacing properties are needed.

- **Padding**: The space around content.
- **Gap**: The space between content.

We can think of the padding as the space between neighbors and the gap as the space between parent-child or child-child relationships.

## Density contexts

In order to maintain the minimalistic spacing properties but allow for several values to be resolved, the concept of a **density context** is introduced. The page starts with a density context where the padding and gap values are at their largest, as we expect the items at this level to be the least related. As the layout is composed, items become more related and therefore require the spacing to decrease as the content becomes more specific. This is where a new density context would be added. The system delivers 3 density contexts. By the third context, additional contexts are inert.

Two variables are used to control the density.

- **Base grid**: A unit value which describes the grid where elements should align. Adjusting this value will change space uniformly.
- **Spacing scale**: Similar to a type scale, a multiplier to adjust the amount of space in a logistic curve. Adjusting this value will change space exponentially.

To calculate the values at a given context the following formula is used:

- base grid × spacing scale<sup>step</sup>

Where each step is a new context.

Use the control below to affect the base grid value. This page will update with the new value.

<density-control reference="--box_standard_density-size"></density-control>
