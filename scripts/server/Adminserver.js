const system = server.registerSystem(0, 0);
let command = "minecraft:execute_command";

system.initialize = function ()
{
	this.registerEventData("AdminPanel:loadui", {});
	this.registerEventData("AdminPanel:loadmenu", {});
	this
	.listenForEvent("minecraft:block_interacted_with",
		(eventData) => this.onUsed(eventData));
};

system.runcommand = function (event)
{
	let name = this.getComponent(event.data.clientplayer, "minecraft:nameable");
	let eventdata = this.createEventData(command);
	eventdata.data.command =
		`/execute @p[name=${name.data.name}] ~~~ ${event.data.data}`;
	this.broadcastEvent(command, eventdata);
};

system.onUsed = function(eventData)
{
	let player = eventData.data.player;
	let handContainer = system.getComponent(player, "minecraft:hand_container");
	let item = handContainer.data[0];
	if(player.__identifier__ === "minecraft:player")
	{
		if (item.item === "adminpanel:adminpanel")
		{
			let name = this.getComponent(player, "minecraft:nameable");
			this.executeCommand(
        `scoreboard players test @p[name=${name.data.name}] PanelAdmins 1 1`,
				(result) => this.openEditor(result,eventData));
		}
   }
};

system.openEditor = function(result,eventData)
{
		let stringresult = JSON.stringify(result);
		if(!stringresult.includes("NOT") && !stringresult.includes("no"))
		{
			let event = system.createEventData("AdminPanel:loadui");
			event.data=eventData;
			system.broadcastEvent("AdminPanel:loadui", event);
		}
};

system.command = function(command)
{
	let data = this.createEventData("minecraft:execute_command");
	data.data.command = command;
	this.broadcastEvent("minecraft:execute_command", data);
};
