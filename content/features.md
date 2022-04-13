---
page: Introduction
anchor: Features
order: 3
---

## Features

### User Preferences

At the top of each page are controls that set user preferences across the site. They're saved for each time you visit and you can change them at any time. Setting a toggle will alter the presentation of the site in different ways.

#### System Color
[Many](https://stackoverflow.blog/2020/03/31/building-dark-mode-on-stack-overflow/ "Building dark mode on Stack Overflow") [sites](https://medium.com/microsoft-design/designing-for-dark-mode-more-than-flipping-a-switch-c21fb38722d2 "Designing for Dark Mode: More Than Flipping a Switch") are exploring the ability to provide a light and dark theme for the user as it might assist the user experience and [include other benefits](https://www.nngroup.com/articles/dark-mode/ "Dark Mode vs. Light Mode: Which Is Better?"). The toggle featured here is a bit different as it doesn't toggle between light and dark themes specifically; it toggles between your system preferred color theme and the contrast. This design decision was based on the article [_Your dark mode toggle is broken_](https://kilianvalkhof.com/2020/design/your-dark-mode-toggle-is-broken/).

> Make sure your dark mode toggle can switch to the system value. _[Kilian Valkhof](https://kilianvalkhof.com/)_

So, for example, if your system is set to dark mode, then on first visit this page should also have a dark theme applied. Switching the toggle will then change to a light theme. This will be the reverse for users who have either set the system to a light theme or have not set a preference.

#### Designer/Engineer Info
These toggles help focus content for a specific audience. For example, if you are visiting the site as a designer, you might not want to see all of the code examples taking up large blocks of content space across the site. You can turn off the Engineer Info tab to hide all of the content geared toward engineers. The same occurs for the Designer Info toggle.

When toggling one of these controls off, the site will assume you are viewing from the perspective of the other toggle. If both toggles are on or off, then all content is displayed. The accent color of the site will also match the intended audience for the content; pink for designers, blue for engineers, green for everyone.

