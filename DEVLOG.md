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

## Day 3

Day about furnace:

[x] - Pickup coal from the ground and put it in the furnace,
[x] - Spawn coal from the coalPile,
[x] - Putting it in the furnace,
[x] - Tempareture rising,
[x] - Losing temperature over time,

[x] - I'll need temperature reading,
[x] - Add action label underneath,
[x] - Remove current labels,

Started bit hectic, I've had couple of the problems with the engine and architecture it self, mostly I was struggling with understanding how to build player - objects, objects - objects interactions? But I think I already have a base for that. I was able to finish building the spawner for coal (coalpile), and dropzone for coal (furnace). 

Also Furnace heats up

## Day 4:

It's time to heat up some steel.
I've also spend some time planning on how the forging system would look like.

[x] - spawing steel from steel box,
[x] - adding steel to the furnace and waiting for it to be heated,
    [] - one potential improvement minimal furnace temperature,
[x] - picking up heated steel from the furnace,
[x] - puting it down to anvil,

## Day 5:

Great day of work. I think the transformerComponent is really great and it simplified the process of working with forging. I've planned 4 items for now but with this system it should be eaisly extendable. Also I think 3 mini mechanics of the game will be really fun! Next is implementing sharpener and desk (but its should be kind eassy) and all mechanics will be ready!

Forging.
[x] - when there is a hot-steel on anvil I should have additional menu for selecting what needs to be forged.
[x] - spawning forgingItem with whole set of actions that needs to be done.
[] - I need to readd functionality to put the stuff down (Just need to plan it better - maybe add a button to cycle around items, or priority to interaction component? Yeah blocking interaction component would be nice :thinking: Blocking + tabing?),

## Day 6-7:

Didnt do much on the 6th day I've only started on adding last 2 entities: Sharpener + desk. But I've got good idea with simplifying the forging process. Instead of particular items there will be 3 categories:

- horse-shoe,
- tool,
- weapon,

On the 7th day I actually had some time :D And I've finished the main gameloop. 

[x] - add sharpener,
[x] - add desk,

It's still not perfect and has a lot of bugs but II see the light in the tunnel. Next things that I need to do are:
- swapping steel with a heated weapon in the forge (and the other way),
- dropping items system - this is a bit a safe exit, just to be sure that there won't be a possibility where player is locked.
- simlifying the transformes.

## Day 8:

Fck me, yesterday I had majority of mechanics done so today I rewrote 50% of it as my interactions were bit shitty. Main problem was with implementing swapping items functionality. Fortunately majority is working there are still 2 bug:

[] - swapping steel - hot-steel in furnace doesn't work.
[x] - after forging tool I need to pick it up and forge again.

but other than that:
[x] - dropping items system is back, not perfect but good enough. I'll implement a way so dropped item won't overlap with forge entities,
[x] - ui component,
