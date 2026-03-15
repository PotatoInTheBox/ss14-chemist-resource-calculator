# Space Station 14 Chemistry Resource Calculator

This app is an interactive resource calculator where a user can define their
Chemical goals and the app will calculate the necessary resources to prepare.

The project uses the Reagant data and it's recipes data from the game to recursively
break down target chemicals into their base components.

# Features

- Input for Goal chemicals with realtime ingredient and intermediary breakdowns.
- Input for Ingredient start amounts with indicators
- - Total usage can be seen in the form of an editable equation
- - Usage ratios can be seen in the form of a bar breaking down what chemicals consume the ingredient chemical
- Loading and saving presets to local storage as well as loading from default presets
- Sharing presets via a link with an encoded URI

# Running the code

The project was built using NPM and React. To build:

```bash
npm install
```

and to run:

```bash
npm run dev
```

# Purpose

The purpose of this project is to learn React. While creating the project I also
wanted to style it so I'm also using this project to learn Bootstrap. The code,
as a result, may touch on features/concepts here and there without refinement.

This project is also to have fun creating a project in React. So fun features
to implement were prioritized more.

Lastly, I sometimes enjoy playing a bit of Space Station 14 which involves me
preparing and figuring out what I want to try out for any given round/shift.
This calculator can hopefully be of some use and allow me to tweak my goals and
see in realtime what I would have to prepare for, and where it would even be
within the resource budget.

In the future I could maybe consider making this more beginner friendly by including
more information about each chemical such as descriptions and properties of chemicals.
However, the [Reagents page in the game wiki](https://wiki.spacestation14.com/wiki/Reagents)
is already a great resource for that and is probably what needs more attention.

# TODO

- Remove or hide button to remove hardcoded preset (when hardcoded preset selected)
- ~~Show a description in every single card.~~
- - May not be able to do it right now since I don't know how to properly get the description data from SS14

# Videos/Websites used as learning material

https://www.youtube.com/watch?v=8pKjULHzs0s

https://www.youtube.com/watch?v=SqcY0GlETPk

https://www.w3schools.com/REACT/default.asp

https://react.dev/learn

https://react-bootstrap.netlify.app/

https://getbootstrap.com/

# Projects to check out

### The game this project was made for and where I pulled my data from

https://spacestation14.com/ - [Github](https://github.com/space-wizards/space-station-14/)

### A cool guide with a ton of information

Chemist Cheatsheet
https://docs.google.com/spreadsheets/d/1Txt7lIquLU9VLBD8viLqxQsGwjBkOr6s8TdWaSyqelc

### Another spreadsheet packed with information

SS14 Chemist Cheatsheet
https://docs.google.com/spreadsheets/d/1-U_emy1uNRW--982WoYZGpprhrN4A2v7VEfik_6Zshw/htmlview

### A chemical recipe lookup - similar to this project.

https://aussieguy0.github.io/ss14-tools/chemist/ - [Github](https://github.com/AussieGuy0/ss14-tools)

### A similar project to this one but with a Windows 98 theme

https://alex-infdev.github.io/ss14-chem-cookbook/ - [Github](https://github.com/alex-infdev/ss14-chem-cookbook)
