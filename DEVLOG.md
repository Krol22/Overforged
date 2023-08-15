# JS13K devlog

## Day 1

I've had couple nice game ideas but the idea of the XIII century blacksmith simulator stayied with me most.

TLDR is that it will be a simpler (duh!) overcooked version based not in the kitchen but in the blacksmith workshop.

- A chaos manager,
- Day/night cycle - days start slowely goes into full chaos then cut,
- Player will need to manage the furnace temperature and metal heating to make all of the orders during the day,

Planning schedule for comming 4th weeks. I'll build it using an ECS + 2dCanvas.

1st week - Engine, finished design + mini MVP,
2nd week - Real MVP + assets,
3rd week - extending core idea + fight with the 13KB limit + lights + particles,
4th week - bugfixes -> playtests -> bugfixes, balancing chaos meters,

last days - making stable build, prepare itch page and go!

Setting up project

## Day 2

Solid first real day of coding work. I wanted to have core foundation like ECS + game loop done. Fortunately game loop was done in the template that I've while setting up project. So I've stretched this to testing ECS, Controlls + setting up simple renderer both for sprites and fonts.

[x] - Adding + testing ECS,
[x] - Setting up first system + components,
[x] - Setting up renderer,
[x] - Adding font and test text,
[x] - Adding aabb & smith entities with labels,

Worrying thing: File with font weights ~800Kb but I've seen bigger immages with lower size so Aseprite might add some unnecessary thing.

Another worrying thing: Building process doesn't work so I don't know how much everything weights,

## Day 3 (stretch to 4?)

Day (days?) about furnace:

[x] - Pickup coal from the ground and put it in the furnace,
[] - Spawn coal from the coalPile,

[] - Putting it in the furnace,
[] - Tempareture rising,
[] - Losing temperature over time,

[] - I'll need temperature reading,
[] - Add action label underneath,
[] - Remove current labels,
