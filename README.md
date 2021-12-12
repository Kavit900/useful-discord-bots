#### To set up Development Environment

1. Clone the current repository.
2. Run the command - `npm install`.
3. Create a separate branch from `main`.
4. Make changes and raise a Pull Request.
5. In order to test it locally, you might need a `TOKEN` key for the bot, ask me personally for it.

#### To test the bot in a Dockerized Environment

1. Follow all of the above steps.
2. In order to test it locally, you might need a `TOKEN` key for the bot, ask me personally for it.
3. Make sure you have docker installed and running.
4. Run the command - `docker-compose up` and see all the services running in docker containers.
5. For simple docker commands, take reference from this article:- https://medium.com/unitechie/docker-helpful-commands-b9f1e59abe7d

#### Discord bots

-> Before pushing, set heroku stack to container - `heroku stack:set container`
-> Push to heroku - `git push heroku main`


#### To invite the Bot, use this url:- https://discord.com/api/oauth2/authorize?client_id=911733940199493652&permissions=414464510016&scope=bot%20applications.commands
