# BungaBotDiscord

A simple Discord bot for Twitch streamer AAAAurora_'s Discord server.

## Features

- [x] `/color {set|view|remove} {color}` - Set, view, or remove your color role.
- [x] Announce new YouTube uploads from each configured channel.
- [x] Add roles to users when with buttons
- [x] Send important server messages like rules, roles, etc.
- [x] Edit important server messages
- [x] Track clock in and clock out times for users
- [x] `/clock {in|out|view|display} [True|False]` - Clock in, clock out, view
your current clock status, or display the clock times of all users
- [x] Docker support

## Setup

### Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Run The Bot](#run-the-bot)
- [Run with Docker](#run-with-docker)
- [Usage](#usage)
  - [Commands](#commands)

### Prerequisites

- [node.js](https://nodejs.org/en/) (v20.10.0 or higher)
- [git](https://git-scm.com/) (v2.41.0 or higher)

### Installation

1. Clone the repository

    ```sh
    git clone https://github.com/ClaireWhere/BungaBotDiscord.git
    ```

2. Create a `.env` file in the root directory of the project and add the following:

    ```env
    CLIENT_ID=
    GUILD_ID=
    DISCORD_TOKEN=""
    ```

    - `CLIENT_ID` is the ID of the bot application
    - `GUILD_ID` is the ID of the guild the bot will be used in
    - `DISCORD_TOKEN` is the token of the bot application

3. Setup `config.json` to your configuration

    See [example.config.json](example.config.json) for an example configuration.

    All properties are setup inside the root `config` object.

    ```json
    {
        "config": {

        }
    }
    ```

    The following properties are available:

    - `custom_presence` - Custom presence configuration
        - `enabled` (`true`|`false`) - Whether the custom status is enabled.
        Default: `false`
        - `state` (*string*) - The state of the custom status. This is the text that
        displays on the bot's status
        - `status` (`'online'` | `'idle'` | `'dnd'` | `'offline'`) - The status
        of the custom presence. Default: `'online'`
    - `youtube` - YouTube configuration
        - `enabled` (`true`|`false`) - Whether the YouTube tracker is enabled
        - `interval_mins` (number) - The interval in minutes to check each channel
        for new uploads. Default: `30`.
        - `channels` - Array of YouTube channels to announce
            - `yt_channel_id` (string) - The ID of the YouTube channel. Click on
            the arrow in the about of the channels page, then click
            "Share channel", the click "Copy channel ID".
            - `discord_channel_id` (string) - The Discord channel to announce
            the YouTube upload. This should correspond to the id in the
            `channels` config.
            - `channel_icon` (string) - The YouTube channel's (direct link
            to image)
    - `images` - JSON object to configure images. Each key is the ID of the image
    (used throughout the bot) and the value is the direct link to the image.
        - `discord_announcements_thmb` (string): The thumbnail for the Discord
        announcements role selector
        - `stream_announcements_thmb` (string): The thumbnail for the Stream
        announcements role selector
        - `pronouns_thmb` (string): The thumbnail for the Pronouns role selector
        - `bunga_bot_icon` (string): The icon of this bot (used as the author
        icon for embeds)
        - `rules_thmb` (string): The thumbnail for the Rules message
    - `channels` - JSON object to configure Discord channels. Each key is the ID
    of the channel (used throughout the bot) and the value is the name of the
    channel in Discord (not including the # symbol)
        - `art_channel_name` (string): The art channel name
        - `spam_channel_name` (string): The spam channel name
        - `nsfw_channel_name` (string): The NSFW channel name
        - `wall_of_shame_channel_name` (string): The wall of shame channel name
        - `hall_of_fame_channel_name` (string): The hall of fame channel name
        - `self_promo_channel_name` (string): The self-promo channel name
        - `stream_announcements_channel_name` (string): The stream announcements
        channel name
        - `youtube_announcements_channel_name` (string): The YouTube
        announcements channel
         name
        - `va_announcements_channel_name`: The VA announcements channel name
    - `users` - JSON object to configure Discord users. Each key is the ID of the
    user (used throughout the bot) and the value is the Discord user ID
        - `aaaaurora_` (string): Aurora's Discord user ID
    - `roles` - JSON object to configure Roles. Each key is the ID to access the
    role and the value is an object. Role ID's can be nested to create sub-roles.
    Each role object has the following properties:
        - `id` (string) - The button event ID of the role. If this is nested,
        include the parent role ID before this role's ID, separated by a colon.
        For example, if the parent role ID is `pronouns`, and this role's ID is
        `he/him`, the button event ID would be `pronouns:he/him`.
        - `name` (string) - The name of the role in Discord
        - `color` (string) - The hex color of the role in Discord. 0 corresponds
        to no color
        (Note: use `0x000001` for black).
        - `exclusion` (list) - Array of roles by ID that are not allowed to be selected
        at the same time as this role.
    - `colors` - JSON object to configure Colors. Each key is the ID of the color
    and the value is an object or list of objects with the following properties:
        - `hex` (string) - The hex code of the color (in the format 0xAAAAAA)
        - `darken` (list) [*optional*] - Array of color objects to darken the color
            - `intensity` - The intensity of the color
            - `hex` - The hex code of the color
        - `lighten` (list) [*optional*] - Array of color objects to lighten the color
            - `intensity` - The intensity of the color
            - `hex` - The hex code of the color

## Run the bot

### Run with Docker

1. Navigate to the project directory

    ```sh
    cd BungaBotDiscord
    ```

2. Build the Docker image

    ```sh
    sudo docker build -t bungabotdiscord .
    ```

3. Run the Docker image

    ```sh
    sudo docker run -d --name bungabotdiscord bungabotdiscord
    ```

### Run without Docker

1. Install NPM packages

    ```sh
    npm install
    ```

2. Start the bot

    ```sh
    npm start
    ```

## Usage

### Commands

#### `/color {set|view|remove} <color>`

- Set, view, or remove your color role.
- Sends an ephemeral message (only viewable by the command user) to the channel
the command was used in
- `color` is the hex code of the color you want to set (in the format `#000000`
or `000000`). This is only required when using the `set` subcommand.

#### `/clock {in|out|view|display} [silent={True|False}]`

- Clock in, clock out, view your current clock status, or display the clock
times of all users
- Sends a persistent message (by default) to the channel the command was used in
- `silent` is an optional argument that defaults to `False`. If `True`, the bot
will send an ephemeral message (only viewable by the command user) instead of a
persistent message.
