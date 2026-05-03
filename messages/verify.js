const {
    MediaGalleryBuilder,
    MediaGalleryItemBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    ContainerBuilder,
    MessageFlags,
    ButtonBuilder,
    ButtonStyle,
    SectionBuilder,
} = require("discord.js");

module.exports = {
    name: "verify",
    description: "Sends the verification panel.",
    async execute(message) {
        await message.delete();

        const components = [
            new ContainerBuilder()
                .addMediaGalleryComponents(
                    new MediaGalleryBuilder().addItems(
                        new MediaGalleryItemBuilder().setURL(
                            "https://media.discordapp.net/attachments/1500287703206596648/1500292072656212099/image.png?ex=69f7e760&is=69f695e0&hm=6ca739d3f6d48ec3e4fdfc3c541f627932b673418c458e82fb3d686991465360&=&format=webp&quality=lossless&width=1210&height=363"
                        )
                    )
                )
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent("### Verification Panel")
                )
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(
                        "At **Alaska State Roleplay**, we use **Dock Systems** to verify users. In order to gain access to the rest of the server, you must verify your Roblox account. Please click the **verification** button below this message to get started in the verification process."
                    )
                )
                .addSeparatorComponents(
                    new SeparatorBuilder()
                        .setDivider(true)
                        .setSpacing(SeparatorSpacingSize.Small)
                )
                .addSectionComponents(
                    new SectionBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder().setContent(
                                "Verify using the button here:"
                            )
                        )
                        .setButtonAccessory(
                            new ButtonBuilder()
                                .setCustomId("start-verify")
                                .setLabel("Begin Verification")
                                .setStyle(ButtonStyle.Secondary)
                        )
                )
                .addSeparatorComponents(
                    new SeparatorBuilder()
                        .setDivider(true)
                        .setSpacing(SeparatorSpacingSize.Small)
                )
                .addMediaGalleryComponents(
                    new MediaGalleryBuilder().addItems(
                        new MediaGalleryItemBuilder().setURL(
                            "https://media.discordapp.net/attachments/1500287703206596648/1500290986570416319/image.png?ex=69f7e65d&is=69f694dd&hm=683f3f1be50da9fb377dec43e52f65d38b5005ccbb54a039ac5b90ac267b0e0a&=&format=webp&quality=lossless&width=2834&height=194"
                        )
                    )
                ),
        ];

        await message.channel.send({
            flags: MessageFlags.IsComponentsV2,
            components,
        });
    },
};
