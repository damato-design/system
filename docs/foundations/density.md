---
title: Density
order: 4
---

# Density

The exercise of applying space between elements is to identify where elements are related. Elements with a closer relation have tigher space while elements with less relation are farther apart. This is the concept popularly known as [The Gestalt Law of Proximity](https://www.nngroup.com/articles/gestalt-proximity/).

A way to visualize this is by social degrees of separation. People living in the same house are 1 degree of separation while neighbors could be 2 degrees of separation. In other words, parent-child and child-child relationships are commonly closer than any other.

## Padding and gap

Using the above concept we have idenitifed that only two spacing properties are needed.

- **Padding**: The space around content.
- **Gap**: The space between content.

We can think of the padding as the space between neighbors and the gap as the space between parent-child or child-child relationships.

## Density contexts

In order to maintain the minimalistic spacing properties but allow for several values to be resolved, the concept of a **density context** is introduced. The page starts with a density context where the padding and gap values are at their largest, as we expect the items at this level to be the least related. As the layout is composed, items become more related and therefore require the spacing to decrease as the content becomes more specific. This is where a new density context would be added. The system delivers 3 density contexts. By the third context, additional contexts are inert.

With each new context, padding and gap values will reduce. This allows for only those two values to be recalled in any given area to describe the necessary space resolving to a total of 6 spacing values. It could be argued that this is limiting however, designing within constaints forges new solutions. This is not [the first time](https://medium.com/eightshapes-llc/space-in-design-systems-188bcbae0d62#1e49) the idea of a limited exponental set has been considered. Reducing the values limits the decisions required. The only question to ask is if the items are related or not.

## Calculating density values

Two variables are used to control the overall density system.

- **Base grid**: A unit value which describes the grid where elements should align. Adjusting this value will change space uniformly.
- **Spacing scale**: Similar to a type scale, a multiplier to adjust the amount of space in a logistic curve. Adjusting this value will change space exponentially.

To calculate the values at a given context the following formula is used where each step is a new context:

- base grid × spacing scale<sup>step</sup>

Use the control below to affect the base grid value. This page will update with the new value.

<density-control reference="--box_standard_density-size"></density-control>

{% audience "engineer" %}

Adding a new density context can be done by adding the `data-density-shift` attribute to an element. The name implies we are shifting the density context to the next step within this element. It is not possible to explicitly set the preferred density context; it is implied by relation to the other contexts defined in each page.

{% endaudience %}