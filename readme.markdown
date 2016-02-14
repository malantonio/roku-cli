# roku-cli

WIP cli app to control a local Roku box.

On first run, there will be a delay as `roku-cli` finds your local Roku via ssdp
and stores the address in `~/.roku-cli.json`.


```
usage: roku <command> <value>

Control a local Roku from the command line

Commands:
    home            shortcut for `roku press home`
    info            get Roku info
    launch <app>    launch <app>
    list            list installed apps
    press <button>  emulate a button press, see below for choices
    replay          shortcut for `roku press instantReplay`
    search [phrase] launch search and search `phrase` if provided

Other shortcuts for `press` (roku <cmd>)
    backspace
    down
    enter
    fwd
    home
    left
    play
    rev
    right
    search
    select
    up

Other values for `roku press <button>`
    instantReplay
    pause
```
