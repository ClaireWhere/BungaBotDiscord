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

## Setup

### Prerequisites

- [node.js](https://nodejs.org/en/) (v20.10.0 or higher)
- [git](https://git-scm.com/) (v2.41.0 or higher)

### Installation

1. Clone the repository

    ```sh
    git clone https://github.com/ClaireWhere/BungaBotDiscord.git
    ```

2. Install NPM packages

    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory of the project and add the following:

    ```env
    CLIENT_ID=
    GUILD_ID=
    DISCORD_TOKEN=""
    ```

    - `CLIENT_ID` is the ID of the bot application
    - `GUILD_ID` is the ID of the guild the bot will be used in
    - `DISCORD_TOKEN` is the token of the bot application

4. Setup `config.json` to your configuration

    <details><summary>View example config.json:</summary>

    <br>

    **Example `config.json`:**

    ---

    ```json
    {
        "config": {
            "custom_status": {
                "enabled": true,
                "state": "",
                "status": "online"
            },
            "youtube": {
                "enabled": true,
                "channels": [
                    {
                        "id": "",
                        "role": "",
                        "message": ""
                    }
                ]
            },
            "images": {
                "image_id": "image_url"
            },
            "channels": {
                "channel_id": "discord_channel_name"
            },
            "users": {
                "user_id": "discord_user_id"
            },
            "roles": {
                "role_id": {
                    "id": "role_id",
                    "name": "discord_role_name",
                    "color": "hex_color_code",
                    "exclusion": [
                        "role_id"
                    ]
                }
            },
            "colors": {
                "multi_color_id": [
                    {
                        "hex": "hex_color_code",
                    }
                ],
                "single_color_id": {
                    "hex": "hex_color_code",
                    "darken": [
                        {
                            "intensity": 1, "hex": "hex_color_code"
                        }
                    ],
                    "lighten": [
                        {
                            "intensity": 1, "hex": "hex_color_code"
                        }
                    ]
                }
            }
        }
    }
    ```

    </details>

5. Run the bot

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
